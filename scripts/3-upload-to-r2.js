#!/usr/bin/env node

/**
 * Script 3: Upload files to R2 bucket
 * Takes a folder and uploads each file to the 'anytool-docs' R2 bucket
 * Usage: node 3-upload-to-r2.js [input-dir]
 *
 * Prerequisites:
 * - Cloudflare API token with R2 permissions
 * - Account ID
 *
 * Environment variables:
 * - CLOUDFLARE_API_TOKEN
 * - CLOUDFLARE_ACCOUNT_ID
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DEFAULT_INPUT_DIR = 'downloaded-docs';
const BUCKET_NAME = 'anytool-docs';
const API_BASE_URL = 'https://api.cloudflare.com/client/v4';

function getRequiredEnvVars() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken) {
    console.error('❌ CLOUDFLARE_API_TOKEN environment variable is required');
    console.log('💡 Get your API token from: https://dash.cloudflare.com/profile/api-tokens');
    console.log('   Required permissions: Zone:Zone:Read, Zone:Zone Settings:Edit');
    process.exit(1);
  }

  if (!accountId) {
    console.error('❌ CLOUDFLARE_ACCOUNT_ID environment variable is required');
    console.log('💡 Find your Account ID in the Cloudflare dashboard sidebar');
    process.exit(1);
  }

  return { apiToken, accountId };
}

async function makeR2Request(apiToken, accountId, method, path, body = null, contentType = 'application/json') {
  // For bucket operations, use the R2 API
  // For object operations, we'll use presigned URLs or direct S3-compatible API
  const url = `${API_BASE_URL}/accounts/${accountId}/r2/buckets${path}`;

  const headers = {
    'Authorization': `Bearer ${apiToken}`
  };

  if (body && contentType) {
    headers['Content-Type'] = contentType;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    if (contentType === 'application/json') {
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (response.status === 204) {
      return null; // No content
    }

    const contentTypeHeader = response.headers.get('content-type');
    if (contentTypeHeader && contentTypeHeader.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    throw new Error(`R2 API request failed: ${error.message}`);
  }
}

async function uploadToR2Direct(apiToken, accountId, objectKey, fileContent, contentType) {
  try {
    // Use direct R2 object upload API
    const uploadUrl = `${API_BASE_URL}/accounts/${accountId}/r2/buckets/${BUCKET_NAME}/objects/${encodeURIComponent(objectKey)}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileContent,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': contentType
      }
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
    }

    return true;
  } catch (error) {
    throw new Error(`Direct upload failed: ${error.message}`);
  }
}

async function checkBucketExists(apiToken, accountId) {
  console.log(`🔍 Checking if bucket '${BUCKET_NAME}' exists...`);

  try {
    // List buckets to check if our bucket exists
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/r2/buckets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const bucketExists = data.result?.buckets?.some(bucket => bucket.name === BUCKET_NAME);

    if (bucketExists) {
      console.log(`✅ Bucket '${BUCKET_NAME}' exists and is accessible`);
      return true;
    } else {
      console.log(`❌ Bucket '${BUCKET_NAME}' not found in your account`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error checking bucket: ${error.message}`);
    return false;
  }
}

function generateObjectKey(filename, manifest = null) {
  // Create a structured key based on the file's original URL path
  if (manifest) {
    const fileInfo = manifest.files.find(f => f.localFilename === filename);
    if (fileInfo) {
      // Use the original URL path structure
      return fileInfo.urlPath;
    }
  }

  // Fallback: use filename with some structure
  return `docs/${filename}`;
}

async function uploadFile(apiToken, accountId, filePath, objectKey) {
  try {
    console.log(`📤 Uploading: ${path.basename(filePath)} -> ${objectKey}`);

    const fileContent = fs.readFileSync(filePath);
    const contentType = path.extname(filePath) === '.md' ? 'text/markdown' : 'application/octet-stream';

    await uploadToR2Direct(apiToken, accountId, objectKey, fileContent, contentType);

    console.log(`✅ Uploaded: ${objectKey}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${objectKey}: ${error.message}`);
    return false;
  }
}

function getAllFiles(dir) {
  const files = [];

  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name !== 'manifest.json') {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

async function uploadFiles(apiToken, accountId, inputDir) {
  console.log(`📁 Scanning directory: ${inputDir}`);

  // Check for manifest file
  const manifestPath = path.join(inputDir, 'manifest.json');
  let manifest = null;

  if (fs.existsSync(manifestPath)) {
    console.log('📋 Found manifest file, using it for object key mapping');
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }

  // Get all files to upload
  const files = getAllFiles(inputDir);

  if (files.length === 0) {
    console.error('❌ No files found to upload');
    process.exit(1);
  }

  console.log(`📊 Found ${files.length} files to upload\n`);

  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const filename = path.basename(filePath);
    const progress = `[${i + 1}/${files.length}]`;

    console.log(`${progress} Processing: ${filename}`);

    // Generate object key
    const objectKey = generateObjectKey(filename, manifest);

    const success = await uploadFile(apiToken, accountId, filePath, objectKey);

    if (success) {
      uploaded++;
    } else {
      failed++;
    }

    // Small delay to be respectful
    if (i < files.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(''); // Empty line for readability
  }

  return { uploaded, failed };
}

async function createUploadSummary(apiToken, accountId, uploaded, failed, inputDir) {
  console.log('📊 Creating upload summary...');

  const summary = {
    timestamp: new Date().toISOString(),
    bucket: BUCKET_NAME,
    inputDirectory: inputDir,
    results: {
      uploaded,
      failed,
      total: uploaded + failed
    },
    nextSteps: [
      'Configure AI Search to index the R2 bucket',
      'Set up Workers binding for the AI Search instance',
      'Test search functionality'
    ]
  };

  const summaryPath = path.join(inputDir, 'upload-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`✅ Upload summary saved to: ${summaryPath}`);
}

async function main() {
  const inputDir = process.argv[2] || DEFAULT_INPUT_DIR;

  console.log('🚀 Starting R2 upload\n');
  console.log(`📁 Input directory: ${inputDir}`);
  console.log(`🪣 R2 bucket: ${BUCKET_NAME}\n`);

  // Check if input directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Input directory not found: ${inputDir}`);
    console.log('💡 Run script 2 first to download files:');
    console.log(`   node 2-download-files.js`);
    process.exit(1);
  }

  // Get environment variables
  const { apiToken, accountId } = getRequiredEnvVars();

  // Check bucket exists
  const bucketExists = await checkBucketExists(apiToken, accountId);
  if (!bucketExists) {
    process.exit(1);
  }

  try {
    // Upload all files
    const { uploaded, failed } = await uploadFiles(apiToken, accountId, inputDir);

    // Create summary
    await createUploadSummary(apiToken, accountId, uploaded, failed, inputDir);

    // Final summary
    console.log('🎉 Upload complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   🪣 Bucket: ${BUCKET_NAME}`);

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Configure AI Search to index the '${BUCKET_NAME}' R2 bucket`);
    console.log(`   2. Set up Workers binding for AI Search`);
    console.log(`   3. Test search functionality`);

    console.log(`\n🔗 Useful links:`);
    console.log(`   • R2 Dashboard: https://dash.cloudflare.com/${accountId}/r2`);
    console.log(`   • AI Search Docs: https://developers.cloudflare.com/ai-search/`);

  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});