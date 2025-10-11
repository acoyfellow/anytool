# Anytool: Dynamic Tool Generation Pattern

## The Problem

AI applications typically bundle dozens of predefined tools, each consuming precious context window space. A password checker, QR code generator, CSV parser, and data validator all sit in memory whether used or not. Teams spend weeks implementing, testing, and maintaining each tool. Context limits force difficult choices about which capabilities to include.

## The Pattern

Generate tools on-demand from natural language descriptions. Compile them once, cache the result, and execute them as needed. Each tool runs in isolation with its own dependencies, returns properly formatted output, and costs nothing when not in use.

**First request:** 15-35 seconds for generation and compilation  
**Every subsequent request:** 50-100ms from cache

## Why This Matters

**For Business Leaders:**
- Reduce engineering time from weeks to minutes for new capabilities
- Pay only for tools actually used, not theoretical functionality
- Adapt to new requirements without redeploy cycles
- Test ideas quickly before committing to full implementations

**For Technical Teams:**
- Eliminate context window management complexity
- No tool maintenance burden or version conflicts
- Real NPM packages with proper dependency resolution
- Each tool runs isolated with zero interference

## When To Use This Pattern

**Good fit:**
- AI applications with many specialized functions (data transformation, format conversion, validation)
- Products requiring frequent capability additions without releases
- Systems where different users need different tool combinations
- Environments where context window size is constrained

**Not suitable for:**
- Mission-critical functions requiring deterministic behavior
- Operations needing complex state management across calls
- Functions with strict latency requirements under 100ms
- Scenarios where AI-generated code review isn't feasible

## How It Works

The system uses two-tier caching for speed:

**Request Flow:**
1. Tool prompt arrives (e.g., "Create QR code generator")
2. Check Durable Object cache for generated script
   - **Hit:** Script exists, proceed to compilation check
   - **Miss:** Call OpenAI to generate worker script, save to DO cache
3. Check R2 cache for compiled code
   - **Hit:** Load compiled worker from R2, execute immediately
   - **Miss:** Send script to Bun compiler service, save compiled code to R2
4. Execute tool with user input
5. Return formatted output

**Why Two Caches:**
- **DO Cache (scripts):** Stores AI-generated source code. Fast regeneration if compilation cache is cleared.
- **R2 Cache (compiled code):** Stores bundled, executable workers. This is what actually runs.

**Cache Benefits:**
- First request: 15-35 seconds (AI generation + compilation)
- Cached script only: 5-10 seconds (compilation only)
- Fully cached: 50-100ms (execution only)

### Content Type Handling

The system automatically detects and formats seven output types:

| Type | Use Case | Format |
|------|----------|--------|
| image | QR codes, charts | Binary data with image headers |
| svg | Vector graphics | XML with SVG MIME type |
| json | Structured data | Formatted JSON objects |
| html | Rich content | Rendered markup |
| csv | Tabular data | Comma-separated values |
| xml | API responses | Formatted XML |
| text | Simple output | Plain text |

### Example Requests

```bash
# QR Code Generator
curl -X POST /api/tool -d '{"prompt": "Create QR code generator", "input": "https://example.com"}'
# Returns: <svg>...</svg>

# Password Checker  
curl -X POST /api/tool -d '{"prompt": "Password strength checker", "input": "MyPass123"}'
# Returns: {"score": 2, "feedback": "Add special characters"}

# CSV Parser
curl -X POST /api/tool -d '{"prompt": "CSV to HTML table", "input": "Name,Age\nJohn,25"}'
# Returns: <table><tr><th>Name</th>...</table>
```

## Technical Architecture

**Pipeline:**
```
Description → Hash → Cache Check → AI Generation → Compilation → Execution → Cache Store
```

**Infrastructure:**
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/)** - Main runtime environment
- **[Worker Loaders](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/)** - Dynamic tool loading and isolation
- **[Durable Objects](https://developers.cloudflare.com/durable-objects/)** - History storage and compiler coordination
- **[Cloudflare Containers](https://developers.cloudflare.com/workers/configuration/containers/)** - Bun compilation service
- **[R2 Storage](https://developers.cloudflare.com/r2/)** - Compiled tool caching
- **[OpenAI API](https://platform.openai.com/)** - Code generation (GPT-4)

**Stack:**
- UI: Hono + JSX for rendering
- Bundler: Bun for NPM package resolution

**Performance:**
- Cold start: 15-35 seconds (AI generation + compilation)
- Warm start: 50-100ms (cached execution)
- Storage: ~10MB per compiled tool
- Scale: Tested with 100+ unique tools

## Integration Patterns

### MCP Server Implementation

```typescript
// Single tool definition replaces dozens of specialized tools
export const tools = [{
  name: "anytool_generate",
  description: "Generate and execute tools from natural language descriptions",
  inputSchema: {
    type: "object",
    properties: {
      prompt: { type: "string" },
      input: { type: "string" }
    }
  }
}];
```

### OpenAI Function Calling

```javascript
const functions = [{
  name: 'anytool_generate',
  description: 'Generate tools dynamically from descriptions',
  parameters: {
    type: 'object',
    properties: {
      description: { type: 'string' },
      input: { type: 'string' }
    }
  }
}];
```

### Direct HTTP Integration

```javascript
async function anytool(description, input = "") {
  const response = await fetch('/api/tool', {
    method: 'POST',
    body: JSON.stringify({ prompt: description, input })
  });
  return response.json();
}

// Usage
const qrCode = await anytool("QR code generator", "https://example.com");
```

## Implementation Details

### Content Type Detection

The AI determines output type during code generation and sets appropriate headers:

```typescript
// Generated code includes proper content type
return new Response(svgString, {
  headers: { 'Content-Type': 'image/svg+xml' }
});
```

### Worker Isolation

Each generated tool runs in its own Cloudflare Worker context with:
- Dedicated dependency bundle
- Isolated execution environment
- No shared state between tools
- Independent failure domains

### Outbound Request Monitoring

All network requests from dynamically generated tools are intercepted by a lightweight proxy:

```typescript
export class OutboundProxy extends WorkerEntrypoint {
  async fetch(request: Request): Promise<Response> {
    const toolId = this.ctx.props?.toolId || 'unknown';
    const url = new URL(request.url);
    console.log(`[${toolId}] Outbound fetch: ${url.hostname}${url.pathname}`);
    return fetch(request);
  }
}
```

This enables:
- Logging all external API calls per tool
- Rate limiting by tool or destination
- Domain whitelist/blacklist enforcement
- Cost tracking for third-party API usage
- Security monitoring for suspicious requests

The proxy is attached via Worker Loaders' `globalOutbound` binding, which intercepts all `fetch()` calls within the dynamic worker.

### Compilation Process

Bun handles real NPM package resolution:
- Fetches packages from NPM registry
- Resolves transitive dependencies
- Bundles for Workers runtime
- Produces single executable module

## API Reference

### Tool Generation Endpoint

```bash
POST /api/tool
{
  "prompt": "Create a QR code generator that returns SVG",
  "input": "https://example.com"
}
```

Response:
```json
{
  "output": "<svg>...</svg>",
  "outputType": "svg",
  "cached": true,
  "packages": ["qr-code-generator"]
}
```

### Cache Management

```bash
GET /api/cache          # List cached tools
DELETE /api/cache       # Clear all cache
DELETE /api/cache/hash  # Clear specific tool
```

## Getting Started

```bash
bun install
bun dev
# Visit http://localhost:8787
```

### Example Tool Descriptions

- "Create a UUID generator using the uuid package"
- "Build a QR code generator that returns SVG"  
- "Create a password strength meter using zxcvbn"
- "Make a CSV parser that returns HTML tables"
- "Build a markdown to HTML converter using marked"

## Production Deployment

### Requirements

- Cloudflare Workers account with Worker Loaders enabled
- Cloudflare Containers for Bun compilation service
- R2 bucket for caching compiled tools
- OpenAI API key for code generation

### Deployment Process

```bash
# Deploy to production (uses Cloudflare Containers)
wrangler deploy --var ENVIRONMENT:production

# Or use Alchemy (automatically uses container in production)
NODE_ENV=production bun alchemy.run.ts
```

### Environment Configuration

```bash
OPENAI_API_KEY=your_openai_key_here
AUTH_SECRET=your_secret_key_here  # Required for production
ENVIRONMENT=development  # Set to "production" for container compilation
```

**Development:** Run `bun dev` with `ENVIRONMENT=development` (default) - uses localhost:3000  
**Production:** Deploy with `ENVIRONMENT=production` - uses Cloudflare Containers

## Security Considerations

AI code generation has costs and risks. Never expose this pattern in production without authentication.

### API Key Authentication

```typescript
const authMiddleware = async (c, next) => {
  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!apiKey || apiKey !== c.env.AUTH_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};
```

### Additional Security Measures

- Rate limit tool generation requests
- Monitor generated code before execution in sensitive environments
- Set appropriate CORS policies
- Use separate API keys for different environments
- Log all generated code for audit purposes

## Project Structure

```
src/
├── worker.tsx              # Main Hono app + AI generation
├── do.tsx                  # Durable Object for history
└── utils/
    ├── hash.ts             # Prompt hashing
    ├── r2-cache.ts         # R2 cache management
    └── compiler.ts         # Bun compilation
```

## Cost Considerations

- AI generation: $0.01-0.05 per tool (one-time)
- R2 storage: ~$0.015 per GB per month
- Worker execution: Free tier covers most use cases
- Container compilation: ~$0.01 per build

Typical usage pattern: 100 unique tools costs ~$1-5 for generation, ~$0.15/month for storage, minimal execution costs.

---

MIT License - Use this pattern as a foundation for your own AI-powered tools.