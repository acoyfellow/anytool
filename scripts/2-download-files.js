#!/usr/bin/env node

/**
 * Script 2: Download files from CSV URLs
 * Reads the CSV file and downloads all markdown files into a folder
 * Usage: node 2-download-files.js [csv-file] [output-dir]
 */

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const DEFAULT_CSV_FILE = 'llms.csv';
const DEFAULT_OUTPUT_DIR = 'downloaded-docs';

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const entries = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const match = line.match(/^"([^"]*(?:""[^"]*)*)","(.+)"$/);
    if (match) {
      const name = match[1].replace(/""/g, '"'); // Unescape quotes
      const url = match[2];
      entries.push({ name, url });
    } else {
      console.warn(`⚠️  Skipping malformed line: ${line}`);
    }
  }

  return entries;
}

function sanitizeFilename(name) {
  // Replace invalid characters for filesystem
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function downloadFile(url, outputPath, name) {
  try {
    console.log(`📥 Downloading: ${name}`);
    console.log(`    URL: ${url}`);
    console.log(`    Path: ${outputPath}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Stream the response to file
    const fileStream = createWriteStream(outputPath);
    await pipeline(response.body, fileStream);

    console.log(`✅ Downloaded: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${name}: ${error.message}`);
    return false;
  }
}

async function downloadFiles(entries, outputDir) {
  console.log(`📁 Creating output directory: ${outputDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let downloaded = 0;
  let failed = 0;

  console.log(`\n🚀 Starting download of ${entries.length} files...\n`);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const progress = `[${i + 1}/${entries.length}]`;

    // Create filename from URL path
    const urlPath = entry.url.replace('https://developers.cloudflare.com/', '');
    const filename = urlPath.replace(/\//g, '_').replace('.md', '') + '.md';
    const outputPath = path.join(outputDir, filename);

    console.log(`${progress} Processing: ${entry.name}`);

    const success = await downloadFile(entry.url, outputPath, entry.name);

    if (success) {
      downloaded++;
    } else {
      failed++;
    }

    // Add a small delay to be respectful to the server
    if (i < entries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(''); // Empty line for readability
  }

  return { downloaded, failed };
}

async function createManifest(entries, outputDir) {
  console.log('📋 Creating manifest file...');

  const manifest = {
    timestamp: new Date().toISOString(),
    totalFiles: entries.length,
    files: entries.map(entry => {
      const urlPath = entry.url.replace('https://developers.cloudflare.com/', '');
      const filename = urlPath.replace(/\//g, '_').replace('.md', '') + '.md';

      return {
        name: entry.name,
        originalUrl: entry.url,
        localFilename: filename,
        urlPath: urlPath
      };
    })
  };

  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✅ Manifest saved to: ${manifestPath}`);
}

async function main() {
  const csvFile = process.argv[2] || DEFAULT_CSV_FILE;
  const outputDir = process.argv[3] || DEFAULT_OUTPUT_DIR;

  console.log('🚀 Starting file download\n');
  console.log(`📄 CSV file: ${csvFile}`);
  console.log(`📁 Output directory: ${outputDir}\n`);

  // Check if CSV file exists
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV file not found: ${csvFile}`);
    console.log('💡 Run script 1 first to generate the CSV file:');
    console.log('   node 1-parse-llms-txt.js');
    process.exit(1);
  }

  try {
    // Read and parse CSV
    console.log(`📖 Reading CSV file: ${csvFile}`);
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const entries = parseCSV(csvContent);

    console.log(`📊 Found ${entries.length} entries to download\n`);

    if (entries.length === 0) {
      console.error('❌ No entries found in CSV file');
      process.exit(1);
    }

    // Download all files
    const { downloaded, failed } = await downloadFiles(entries, outputDir);

    // Create manifest
    await createManifest(entries, outputDir);

    // Summary
    console.log('🎉 Download complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Downloaded: ${downloaded}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Output directory: ${outputDir}`);

    console.log(`\n💡 Next step: Run script 3 to upload to R2`);
    console.log(`   node 3-upload-to-r2.js ${outputDir}`);

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