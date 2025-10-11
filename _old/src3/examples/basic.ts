/**
 * Basic usage examples for AnyTool Core
 */

import { AnyToolCore } from '../core/AnyToolCore';

// Basic setup with minimal configuration
export async function basicExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key'
  });

  // Generate a simple tool
  const result = await tools.generateAndExecute({
    prompt: "Create a UUID generator",
    input: ""
  });

  console.log('Generated tool result:', result);
  return result;
}

// With caching enabled
export async function withCachingExample(cache: R2Bucket) {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key',
    cache,
    devMode: true
  });

  const result = await tools.generateAndExecute({
    prompt: "Create a markdown to HTML converter",
    input: "# Hello World\n\nThis is **bold** text."
  });

  console.log('Markdown conversion result:', result);
  return result;
}

// With event listeners for monitoring
export async function withMonitoringExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key',
    verbose: true,
    logLevel: 'debug'
  });

  // Set up event listeners
  tools.on('generation:start', ({ request }) => {
    console.log('Started generating tool for:', request.prompt);
  });

  tools.on('generation:complete', ({ result }) => {
    console.log('Tool generated successfully:', {
      hash: result.toolHash,
      packages: result.packages,
      cached: result.cached,
      executionTime: result.executionTime
    });
  });

  tools.on('package:verified', ({ compatibility }) => {
    console.log('Package verified:', {
      name: compatibility.name,
      compatible: compatibility.compatible,
      confidence: compatibility.confidence
    });
  });

  tools.on('cache:hit', ({ hash }) => {
    console.log('Cache hit for tool:', hash);
  });

  const result = await tools.generateAndExecute({
    prompt: "Build a password strength meter using zxcvbn",
    input: "mypassword123"
  });

  return result;
}

// Force regeneration (bypass cache)
export async function forceRegenerateExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key'
  });

  const result = await tools.generateAndExecute({
    prompt: "Create a QR code generator that outputs SVG",
    input: "https://example.com",
    forceRegenerate: true // Always generate fresh, ignore cache
  });

  console.log('Fresh QR code generator:', result);
  return result;
}

// With output type hints
export async function withOutputHintsExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key'
  });

  const result = await tools.generateAndExecute({
    prompt: "Create a color palette generator",
    input: "#ff0000",
    outputHints: {
      preferredType: 'json',
      contentType: 'application/json'
    }
  });

  console.log('Color palette result:', result);
  return result;
}

// Error handling example
export async function errorHandlingExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key',
    maxRetries: 2
  });

  try {
    const result = await tools.generateAndExecute({
      prompt: "Use an incompatible package like 'fs' to read files",
      input: "/etc/passwd"
    });
    console.log('Unexpected success:', result);
  } catch (error) {
    if (error.type === 'compatibility') {
      console.log('Package compatibility error:', {
        message: error.message,
        suggestion: error.suggestion,
        retryable: error.retryable
      });
    } else {
      console.log('Other error:', error.message);
    }
  }
}

// Get metrics and statistics
export async function metricsExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key'
  });

  // Generate a few tools first
  await tools.generateAndExecute({
    prompt: "Create a UUID generator",
    input: ""
  });

  await tools.generateAndExecute({
    prompt: "Create a slug generator",
    input: "Hello World!"
  });

  // Get metrics
  const metrics = await tools.getMetrics();
  console.log('AnyTool metrics:', metrics);

  return metrics;
}

// Warmup for production
export async function warmupExample() {
  const tools = new AnyToolCore({
    openaiApiKey: 'your-openai-api-key'
  });

  // Preload documentation and popular packages
  await tools.warmup();

  console.log('AnyTool warmed up and ready for production');
  return tools;
}