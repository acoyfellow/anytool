# Anytool v2 - Quick Start

## 3 Ways to Use

### 1. Remote Service (5 minutes)

Deploy once, use everywhere.

```bash
# Deploy the worker
cd anytool
wrangler deploy --config wrangler2.jsonc
# → https://anytool-v2.your-name.workers.dev
```

```typescript
// In ANY project (SvelteKit, Next.js, Vue, etc.)
import { AnytoolClient } from './anytool/client'

const anytool = new AnytoolClient({
  endpoint: 'https://anytool-v2.your-name.workers.dev'
})

const result = await anytool.generate({
  prompt: 'Create a UUID generator using the uuid package',
  input: ''
})

console.log(result.output)      // Generated UUID
console.log(result.outputType)  // 'json'
console.log(result.packages)    // ['uuid']
```

**Files to copy:** 2 (`types.ts`, `client.ts`)

### 2. Self-Hosted API (30 minutes)

Run the logic in your own backend.

```typescript
// src/routes/api/anytool/+server.ts
import { Anytool } from '$lib/anytool/anytool'
import { MemoryCache } from '$lib/anytool/cache'
import { YourExecutor } from '$lib/anytool/your-executor'

const anytool = new Anytool({
  openaiApiKey: env.OPENAI_API_KEY,
  compilerUrl: env.COMPILER_URL,
  cache: new MemoryCache(),
  executor: new YourExecutor()
})

export async function POST({ request }) {
  const body = await request.json()
  return json(await anytool.generate(body))
}
```

**Files to copy:** 10 (all of `src2/` except `worker.tsx`)

### 3. Full Control (2 hours)

Copy everything, customize everything.

**Files to copy:** All of `src2/` + `container/`

## Key Benefits

### Before (v1)
- ❌ 1343 lines in one file
- ❌ No types
- ❌ Copy-paste nightmare
- ❌ Cloudflare-only
- ❌ Can't test
- ❌ Can't swap cache/executor

### After (v2)
- ✅ ~100 lines per file
- ✅ Full TypeScript
- ✅ Copy 2 files to integrate
- ✅ Platform agnostic
- ✅ Testable with mocks
- ✅ Pluggable adapters

## Examples

### UUID Generator
```typescript
const result = await anytool.generate({
  prompt: 'Create a UUID generator using the uuid package',
  input: ''
})
// result.output: "a1b2c3d4-..."
```

### QR Code (SVG)
```typescript
const result = await anytool.generate({
  prompt: 'Build a QR code generator that outputs SVG using qrcode-generator package',
  input: 'https://example.com'
})
// result.output: "<svg>...</svg>"
// result.outputType: "svg"
```

### Password Strength
```typescript
const result = await anytool.generate({
  prompt: 'Build a password strength meter using zxcvbn',
  input: 'password123'
})
// result.output: {"score":1,"feedback":...}
// result.outputType: "json"
```

### Markdown to HTML
```typescript
const result = await anytool.generate({
  prompt: 'Create a markdown to HTML converter using marked',
  input: '# Hello\n\nThis is **bold**.'
})
// result.output: "<h1>Hello</h1><p>This is <strong>bold</strong>.</p>"
// result.outputType: "html"
```

## Type Safety

```typescript
// Everything is typed
import type { ToolResponse, OutputType } from './anytool/types'

const result: ToolResponse = await anytool.generate({ prompt, input })

// Autocomplete works
result.output          // ✓
result.outputType      // ✓ Type: 'text' | 'json' | 'html' | 'image' | 'svg' | 'csv' | 'xml'
result.contentType     // ✓
result.toolHash        // ✓
result.packages        // ✓ Type: string[]
result.cached          // ✓
result.foo             // ✗ Error!
```

## Architecture

```
types.ts       → API contract (50 lines)
hash.ts        → Prompt hashing (7 lines)
packages.ts    → Package compatibility DB (120 lines)
generator.ts   → AI code generation (80 lines)
compiler.ts    → Code compilation (25 lines)
cache.ts       → Cache adapters (50 lines)
executor.ts    → Execution adapters (30 lines)
anytool.ts     → Core business logic (100 lines)
client.ts      → Client SDK (45 lines)
worker.tsx     → Cloudflare Workers entry (120 lines)
index.ts       → Public exports (30 lines)
```

Total: ~650 lines (vs 1343 in v1)

## Integration Time

| Project Type | Files | Setup Time |
|--------------|-------|------------|
| Use remote worker | 2 | 5 min |
| SvelteKit API | 10 | 30 min |
| Next.js API | 10 | 30 min |
| Custom runtime | All | 2 hours |

## Next Steps

1. **Quick Test**: Deploy worker, copy 2 files, test in your app
2. **Self-Host**: Copy core files, implement executor for your runtime
3. **Full Control**: Copy everything, customize as needed

## Documentation

- `README.md` - Usage patterns
- `INTEGRATION-GUIDE.md` - Step-by-step integration
- `COMPARISON.md` - v1 vs v2 differences
- `examples/sveltekit-minimal.md` - Minimal SvelteKit example

## Questions?

**Q: Do I need Cloudflare Workers?**  
A: No. You can self-host the API in Node.js, Bun, Deno, or any runtime.

**Q: Can I use a different cache?**  
A: Yes. Implement the `CacheAdapter` interface for your database.

**Q: Can I use a different executor?**  
A: Yes. Implement the `ExecutorAdapter` interface for your runtime.

**Q: What if I don't want AI generation?**  
A: You can pre-generate tools and cache them, then just use the execution layer.

**Q: Is this production-ready?**  
A: The pattern works. Add authentication, rate limiting, and monitoring for production.

## License

MIT - Use freely, no attribution required.


