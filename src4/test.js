#!/usr/bin/env node

/**
 * Test script for Anytool v4 - Pragmatic Dogfooding Version
 * Run: node test.js
 */

const API_URL = 'http://localhost:8787';
const API_KEY = 'anytool-internal-dogfood-key-2024';

async function makeRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers
    },
    ...options
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function testTool(name, prompt, input = '') {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`📝 Prompt: "${prompt}"`);
  if (input) console.log(`📥 Input: "${input}"`);

  const start = Date.now();
  const result = await makeRequest('/api/tool', {
    method: 'POST',
    body: JSON.stringify({ prompt, input })
  });
  const duration = Date.now() - start;

  if (result.status === 200) {
    console.log(`✅ Success (${duration}ms)`);
    console.log(`📤 Output: ${result.data.output}`);
    console.log(`🏷️  Type: ${result.data.outputType}`);
    console.log(`💾 Cached: ${result.data.cached}`);
    console.log(`📦 Packages: ${result.data.packages.join(', ') || 'none'}`);
    return result.data;
  } else {
    console.log(`❌ Failed (${duration}ms)`);
    console.log(`💥 Error: ${result.data.error}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Anytool v4 - Pragmatic Dogfooding Version');
  console.log('='.repeat(60));

  // Test 1: Health check
  console.log('\n🏥 Health Check');
  const health = await makeRequest('/health');
  console.log(`Status: ${health.status === 200 ? '✅ Healthy' : '❌ Unhealthy'}`);
  console.log(`Service: ${health.data.service} v${health.data.version}`);

  // Test 2: UUID Generation (should work with packages)
  await testTool(
    'UUID Generator',
    'Generate a UUID',
    ''
  );

  // Test 3: UUID Generation again (should be cached)
  await testTool(
    'UUID Generator (cached)',
    'Generate a UUID',
    ''
  );

  // Test 4: Email Intent Extraction (no packages needed)
  await testTool(
    'Email Intent Parser',
    'Parse email subject and extract intent (meeting, urgent, question, update) and priority (high, normal, low), return JSON',
    'RE: URGENT - Q4 Budget Review Meeting Tomorrow'
  );

  // Test 5: Date Parser (no packages needed)
  await testTool(
    'Date Parser',
    'Parse natural language date and return ISO 8601 string',
    'next Tuesday at 3pm'
  );

  // Test 6: QR Code Generator (might need packages)
  await testTool(
    'QR Code Generator',
    'Generate a simple QR code as SVG for a URL',
    'https://inbox.dog'
  );

  // Test 7: Text Summarizer (no packages needed)
  await testTool(
    'Text Summarizer',
    'Summarize text in one sentence',
    'The quick brown fox jumps over the lazy dog. This is a pangram sentence that contains every letter of the English alphabet at least once. It is commonly used for testing fonts and keyboards.'
  );

  // Test 8: Color Converter (might need packages)
  await testTool(
    'Color Converter',
    'Convert hex color to RGB, return JSON with {hex, rgb, name}',
    '#FF5733'
  );

  console.log('\n🎉 Test suite completed!');
  console.log('\n💡 Try running individual tests:');
  console.log('  node test.js --single "Generate a UUID"');
}

async function runSingleTest(prompt) {
  console.log('🧪 Single Test Mode');
  console.log('='.repeat(30));

  const input = process.argv[4] || '';
  await testTool('Custom Test', prompt, input);
}

// CLI handling
if (process.argv.includes('--single')) {
  const prompt = process.argv[3];
  if (!prompt) {
    console.log('Usage: node test.js --single "your prompt here" [optional input]');
    process.exit(1);
  }
  runSingleTest(prompt);
} else {
  runTests();
}