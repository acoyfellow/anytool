#!/usr/bin/env node

// Test all examples from the Anytool worker
// This script tests each example prompt to identify which ones fail and why

const examples = [
  "Make a UUID generator using the uuid package",
  "Create a markdown to HTML converter using marked",
  "Build a QR code generator that outputs SVG using qrcode-generator package",
  "Make a JWT token decoder that validates claims using jsonwebtoken",
  "Build a password strength meter using zxcvbn that scores passwords",
  "Create a fake person generator using faker.js with name, email, address",
  "Build a live Bitcoin price API to fetch from CoinGecko",
  "Make a URL slug generator using slugify package",
  "Create a password hash checker using bcryptjs",
  "Build a color palette generator using chroma-js for harmonious colors",
  "Make a JSON validator and formatter using ajv schema validation",
  "Create a text sentiment analyzer using sentiment analysis package"
];

// Test inputs for each example
const testInputs = {
  "Make a UUID generator using the uuid package": "",
  "Create a markdown to HTML converter using marked": "# Hello World\n\nThis is **bold** text.",
  "Build a QR code generator that outputs SVG using qrcode-generator package": "https://example.com",
  "Make a JWT token decoder that validates claims using jsonwebtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "Build a password strength meter using zxcvbn that scores passwords": "password123",
  "Create a fake person generator using faker.js with name, email, address": "",
  "Build a live Bitcoin price API to fetch from CoinGecko": "usd",
  "Make a URL slug generator using slugify package": "Hello World! This is a Test.",
  "Create a password hash checker using bcryptjs": "password123",
  "Build a color palette generator using chroma-js for harmonious colors": "#ff0000",
  "Make a JSON validator and formatter using ajv schema validation": '{"name": "John", "age": 30}',
  "Create a text sentiment analyzer using sentiment analysis package": "I love this product! It's amazing."
};

class TestRunner {
  constructor(baseUrl = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async testExample(prompt, input = '') {
    console.log(`\n🧪 Testing: ${prompt}`);
    console.log(`📝 Input: "${input}"`);

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          input,
          forceRegenerate: true // Always regenerate for fresh testing
        })
      });

      const duration = Date.now() - startTime;
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log(`✅ SUCCESS (${duration}ms)`);
      console.log(`   📊 Type: ${data.outputType} | Content-Type: ${data.contentType}`);
      console.log(`   📦 Packages: ${data.packages.join(', ')}`);
      console.log(`   🔗 Hash: ${data.toolHash}`);
      console.log(`   📄 Output length: ${data.output.length} chars`);
      console.log(`   💾 Cached: ${data.cached}`);

      return {
        prompt,
        input,
        success: true,
        duration,
        outputType: data.outputType,
        contentType: data.contentType,
        packages: data.packages,
        hash: data.toolHash,
        outputLength: data.output.length,
        cached: data.cached,
        output: data.output.substring(0, 200) + (data.output.length > 200 ? '...' : '')
      };

    } catch (error) {
      console.log(`❌ FAILED (${Date.now() - startTime}ms)`);
      console.log(`   🚨 Error: ${error.message}`);

      return {
        prompt,
        input,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
        errorDetails: error.stack
      };
    }
  }

  async runAllTests() {
    console.log(`🚀 Starting test run for ${examples.length} examples...\n`);

    for (const prompt of examples) {
      const input = testInputs[prompt] || '';
      const result = await this.testExample(prompt, input);
      this.results.push(result);

      // Small delay between tests to avoid overwhelming the server
      await TestRunner.delay(1000);
    }

    this.generateReport();
  }

  async runSingleTest(index) {
    if (index < 0 || index >= examples.length) {
      console.error(`❌ Invalid index ${index}. Must be 0-${examples.length - 1}`);
      return;
    }

    const prompt = examples[index];
    const input = testInputs[prompt] || '';
    console.log(`🎯 Running single test for example ${index}:`);

    const result = await this.testExample(prompt, input);
    this.results = [result];
    this.generateReport();
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST REPORT');
    console.log('='.repeat(80));

    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);

    console.log(`\n📈 SUMMARY:`);
    console.log(`   ✅ Successful: ${successful.length}/${this.results.length} (${Math.round(successful.length/this.results.length*100)}%)`);
    console.log(`   ❌ Failed: ${failed.length}/${this.results.length} (${Math.round(failed.length/this.results.length*100)}%)`);

    if (successful.length > 0) {
      console.log(`\n✅ SUCCESSFUL TESTS:`);
      successful.forEach((result, i) => {
        console.log(`   ${i+1}. ${result.prompt}`);
        console.log(`      Type: ${result.outputType} | Packages: ${result.packages.join(', ')}`);
        console.log(`      Duration: ${result.duration}ms | Output: ${result.outputLength} chars`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n❌ FAILED TESTS:`);
      failed.forEach((result, i) => {
        console.log(`   ${i+1}. ${result.prompt}`);
        console.log(`      Error: ${result.error}`);
        console.log(`      Duration: ${result.duration}ms`);
      });

      console.log(`\n🔍 ERROR ANALYSIS:`);
      const errorTypes = {};
      failed.forEach(result => {
        const errorType = this.categorizeError(result.error);
        errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
      });

      Object.entries(errorTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} occurrences`);
      });
    }

    // Package usage analysis
    if (successful.length > 0) {
      console.log(`\n📦 PACKAGE USAGE:`);
      const packageUsage = {};
      successful.forEach(result => {
        result.packages.forEach(pkg => {
          packageUsage[pkg] = (packageUsage[pkg] || 0) + 1;
        });
      });

      Object.entries(packageUsage)
        .sort(([,a], [,b]) => b - a)
        .forEach(([pkg, count]) => {
          console.log(`   ${pkg}: ${count} times`);
        });
    }

    // Output type analysis
    if (successful.length > 0) {
      console.log(`\n📄 OUTPUT TYPES:`);
      const outputTypes = {};
      successful.forEach(result => {
        outputTypes[result.outputType] = (outputTypes[result.outputType] || 0) + 1;
      });

      Object.entries(outputTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} tools`);
      });
    }

    console.log('\n' + '='.repeat(80));
  }

  categorizeError(error) {
    if (error.includes('Content-Type')) return 'Content-Type Validation';
    if (error.includes('compilation')) return 'Compilation Error';
    if (error.includes('package')) return 'Package Error';
    if (error.includes('timeout')) return 'Timeout';
    if (error.includes('network')) return 'Network Error';
    if (error.includes('validation')) return 'Validation Error';
    return 'Other';
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new TestRunner();

  if (args.length === 0) {
    // Run all tests
    await runner.runAllTests();
  } else if (args[0] === 'list') {
    // List all examples with indices
    console.log('📋 Available examples:');
    examples.forEach((example, index) => {
      console.log(`   ${index}: ${example}`);
    });
  } else if (args[0] === 'test' && args[1] !== undefined) {
    // Run specific test by index
    const index = parseInt(args[1]);
    await runner.runSingleTest(index);
  } else {
    console.log('Usage:');
    console.log('  node test-examples.js              # Run all tests');
    console.log('  node test-examples.js list         # List all examples');
    console.log('  node test-examples.js test <index> # Run specific test');
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TestRunner, examples, testInputs };