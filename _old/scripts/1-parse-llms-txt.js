#!/usr/bin/env node

/**
 * Script 1: Parse llms.txt to CSV
 * Downloads https://developers.cloudflare.com/llms.txt and converts it to CSV format
 * Usage: node 1-parse-llms-txt.js
 */

import fs from 'fs';
import path from 'path';

const LLMS_TXT_URL = 'https://developers.cloudflare.com/llms.txt';
const OUTPUT_FILE = 'llms.csv';

async function fetchLlmsTxt() {
  console.log(`📥 Fetching ${LLMS_TXT_URL}...`);

  try {
    const response = await fetch(LLMS_TXT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log(`✅ Downloaded ${text.length} characters`);
    return text;
  } catch (error) {
    console.error('❌ Failed to fetch llms.txt:', error.message);
    process.exit(1);
  }
}

function parseLlmsTxtToCSV(content) {
  console.log('🔍 Parsing llms.txt content...');

  const lines = content.split('\n');
  const entries = [];

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Check if this line contains a URL
    if (trimmed.includes('https://developers.cloudflare.com/')) {
      // Extract URL
      const urlMatch = trimmed.match(/https:\/\/developers\.cloudflare\.com\/[^\s)]+/);
      if (urlMatch) {
        let url = urlMatch[0];

        // Ensure it ends with .md
        if (!url.endsWith('.md')) {
          if (url.endsWith('/')) {
            url += 'index.md';
          } else {
            url += '/index.md';
          }
        }

        // Extract name - everything before the URL
        const beforeUrl = trimmed.substring(0, trimmed.indexOf('http')).trim();
        let name = beforeUrl;

        // Clean up common prefixes/formatting
        name = name.replace(/^[-*]\s*/, ''); // Remove bullet points
        name = name.replace(/^\d+\.\s*/, ''); // Remove numbered lists
        name = name.replace(/^[>\s]+/, ''); // Remove quotes and whitespace
        name = name.trim();

        // If no name extracted, derive from URL
        if (!name) {
          const pathParts = url.replace('https://developers.cloudflare.com/', '').replace('.md', '').split('/');
          name = pathParts[pathParts.length - 1] === 'index'
            ? pathParts[pathParts.length - 2] || pathParts[0]
            : pathParts[pathParts.length - 1];

          // Capitalize and clean up
          name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        entries.push({ name, url });
      }
    }
  }

  console.log(`📝 Found ${entries.length} entries`);
  return entries;
}

function generateCSV(entries) {
  console.log('📊 Generating CSV...');

  const csvLines = ['name,markdown_url']; // Header

  for (const entry of entries) {
    // Escape quotes in CSV values
    const name = `"${entry.name.replace(/"/g, '""')}"`;
    const url = `"${entry.url}"`;
    csvLines.push(`${name},${url}`);
  }

  return csvLines.join('\n');
}

async function saveCSV(csvContent) {
  console.log(`💾 Saving to ${OUTPUT_FILE}...`);

  try {
    fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf8');
    console.log(`✅ Saved ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Failed to save CSV:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting llms.txt to CSV conversion\n');

  // Fetch the llms.txt content
  const content = await fetchLlmsTxt();

  // Parse content to extract entries
  const entries = parseLlmsTxtToCSV(content);

  if (entries.length === 0) {
    console.error('❌ No entries found in llms.txt');
    process.exit(1);
  }

  // Generate CSV
  const csvContent = generateCSV(entries);

  // Save to file
  await saveCSV(csvContent);

  console.log(`\n🎉 Conversion complete!`);
  console.log(`📋 ${entries.length} entries saved to ${OUTPUT_FILE}`);
  console.log(`\n💡 Next step: Run script 2 to download the files`);
  console.log(`   node 2-download-files.js`);
}

// Run the script
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});