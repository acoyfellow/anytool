# Anytool Core - Developer-First Dynamic Tool Generation

A reusable, intelligent tool generation system designed for easy integration into any Cloudflare Workers project.

## 🎯 Core Philosophy

Instead of maintaining static package databases, Anytool Core uses **live documentation crawling** and **real-time compatibility verification** to generate robust tools that work in the Cloudflare Workers environment.

## 🚀 Quick Start

```typescript
import { AnyToolCore } from './anytool-core';

const toolGenerator = new AnyToolCore({
  openaiApiKey: env.OPENAI_API_KEY,
  cache: env.TOOL_CACHE, // R2 bucket
  compiler: env.BUN_COMPILER_DO // Optional: for compilation
});

// Generate and execute a tool
const result = await toolGenerator.generateAndExecute({
  prompt: "Create a UUID generator",
  input: "",
  userContext?: "Building API for inbox.dog" // Optional context
});
```

## 🏗️ Architecture

### Core Components

1. **`AnyToolCore`** - Main orchestrator class
2. **`DocumentationCrawler`** - Fetches live CF Workers docs
3. **`PackageVerifier`** - Real-time NPM compatibility checking
4. **`SmartPromptBuilder`** - Constructs intelligent prompts
5. **`ToolExecutor`** - Handles compilation and execution
6. **`CacheManager`** - Intelligent caching layer

### Design Principles

- **Zero Configuration**: Works out of the box
- **Environment Aware**: Automatically adapts to CF Workers constraints
- **Self-Improving**: Gets smarter with each use
- **Lightweight**: Minimal bundle size impact
- **TypeScript First**: Full type safety

## 🎨 Developer Experience Features

### 1. **Intelligent Defaults**
```typescript
// Minimal setup - everything else is automatic
const tools = new AnyToolCore({ openaiApiKey });
```

### 2. **Rich Error Messages**
```typescript
// Instead of cryptic errors, get actionable feedback
{
  error: "Package 'fs' incompatible with Workers",
  suggestion: "Use fetch() for file operations",
  documentation: "https://developers.cloudflare.com/workers/..."
}
```

### 3. **Development Mode**
```typescript
const tools = new AnyToolCore({
  openaiApiKey,
  devMode: true, // Extra logging, validation, suggestions
  verbose: true   // Step-by-step generation process
});
```

### 4. **Hot Reloading**
```typescript
// For development - bypass cache for rapid iteration
await tools.generateAndExecute({
  prompt: "UUID generator",
  forceRegenerate: true
});
```

### 5. **Context Injection**
```typescript
// Automatically include project context
const tools = new AnyToolCore({
  openaiApiKey,
  projectContext: {
    name: "inbox.dog",
    domain: "email processing",
    constraints: ["GDPR compliant", "high performance"]
  }
});
```

## 📦 Package Structure

```
src3/
├── index.ts                 # Main exports
├── core/
│   ├── AnyToolCore.ts      # Main orchestrator
│   ├── types.ts            # TypeScript definitions
│   └── config.ts           # Configuration handling
├── crawlers/
│   ├── DocumentationCrawler.ts  # CF Workers docs crawler
│   ├── PackageVerifier.ts       # NPM compatibility checker
│   └── types.ts                 # Crawler-specific types
├── generation/
│   ├── SmartPromptBuilder.ts    # Intelligent prompt construction
│   ├── ToolValidator.ts         # Generated code validation
│   └── templates/               # Reusable code templates
├── execution/
│   ├── ToolExecutor.ts         # Compilation & execution
│   ├── CacheManager.ts         # Intelligent caching
│   └── ContainerManager.ts     # Bun compiler interface
├── utils/
│   ├── logger.ts               # Structured logging
│   ├── errors.ts               # Custom error types
│   └── helpers.ts              # Utility functions
└── examples/
    ├── basic.ts                # Simple usage examples
    ├── advanced.ts             # Complex integration patterns
    └── inbox-dog.ts            # inbox.dog specific examples
```

## 🔧 Integration Patterns

### For Existing CF Workers Projects

```typescript
// Add to your existing Hono app
import { AnyToolCore } from '@anytool/core';

app.post('/api/generate-tool', async (c) => {
  const tools = new AnyToolCore({
    openaiApiKey: c.env.OPENAI_API_KEY,
    cache: c.env.TOOL_CACHE
  });

  return tools.handleRequest(c.req);
});
```

### For New Projects

```typescript
// Bootstrap a complete tool generation API
import { createAnyToolApp } from '@anytool/core';

export default createAnyToolApp({
  openaiApiKey: env.OPENAI_API_KEY,
  customMiddleware: [authMiddleware, rateLimitMiddleware]
});
```

### For Libraries/SDKs

```typescript
// Use as a library component
import { generateTool } from '@anytool/core';

const emailParser = await generateTool({
  prompt: "Parse email headers and extract metadata",
  apiKey: process.env.OPENAI_API_KEY
});
```

## 🎪 Configuration Options

```typescript
interface AnyToolConfig {
  // Required
  openaiApiKey: string;

  // Storage
  cache?: R2Bucket;
  cachePrefix?: string;

  // Compilation
  compiler?: DurableObjectNamespace;
  compilationTimeout?: number;

  // Intelligence
  documentationUrls?: string[];
  packageRegistries?: string[];
  customVerifiers?: PackageVerifier[];

  // Development
  devMode?: boolean;
  verbose?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';

  // Project Context
  projectContext?: {
    name: string;
    domain: string;
    constraints: string[];
  };

  // Customization
  promptTemplates?: Record<string, string>;
  outputFormats?: string[];
  validationRules?: ValidationRule[];
}
```

## 🔍 Monitoring & Observability

```typescript
// Built-in metrics and tracing
const tools = new AnyToolCore({
  openaiApiKey,
  onGenerationStart: (prompt) => console.log('Starting:', prompt),
  onGenerationComplete: (result) => analytics.track('tool-generated', result),
  onError: (error) => logger.error('Tool generation failed', error)
});

// Structured logging
tools.on('package-verified', ({ package, compatible, reason }) => {
  metrics.increment('package-verification', { compatible });
});
```

## 🧪 Testing & Development

```typescript
// Built-in test helpers
import { createTestToolGenerator } from '@anytool/core/testing';

const mockTools = createTestToolGenerator({
  mockCompilation: true,
  mockExecution: true,
  fixtures: ['uuid-generator', 'qr-code', 'email-parser']
});

// Test your integration
await mockTools.test({
  prompt: "Generate UUID",
  expectedOutput: { type: 'json', contentType: 'application/json' }
});
```

## 📚 Usage Examples

See the `examples/` directory for:
- Basic tool generation
- Advanced configuration patterns
- Integration with existing projects
- Performance optimization techniques
- Error handling strategies

## 🎯 Next Steps

1. **Review the API design** - Does this meet your DX needs?
2. **Implementation priority** - Which components should I build first?
3. **Integration planning** - How will this fit into inbox.dog?
4. **Package distribution** - NPM package, or internal module?

This design prioritizes **developer happiness** while maintaining the intelligent, documentation-driven approach we discussed. Ready to start building?