# Integration Guide: Adding Anytool to Your Project

This guide shows how to integrate the anytool pattern into different project types.

## Option 1: Use as Remote Service (Recommended)

Deploy anytool to Cloudflare Workers, then consume from any project.

### Step 1: Deploy the Worker

```bash
cd /path/to/anytool
wrangler deploy --config wrangler2.jsonc
# Note your worker URL: https://anytool-v2.your-name.workers.dev
```

### Step 2: Copy Client Files to Your Project

Copy these 2 files:
- `src2/types.ts` → `$lib/anytool/types.ts`
- `src2/client.ts` → `$lib/anytool/client.ts`

### Step 3: Use in Your App

**SvelteKit Example:**

```typescript
// src/routes/tools/+page.svelte
<script lang="ts">
  import { AnytoolClient } from '$lib/anytool/client'
  
  const anytool = new AnytoolClient({
    endpoint: 'https://anytool-v2.your-name.workers.dev'
  })
  
  let prompt = $state('Create a UUID generator')
  let input = $state('')
  let result = $state<any>(null)
  let loading = $state(false)
  
  async function generate() {
    loading = true
    try {
      result = await anytool.generate({ prompt, input })
    } catch (err) {
      console.error(err)
    } finally {
      loading = false
    }
  }
</script>

<div class="container">
  <h1>Anytool</h1>
  
  <textarea bind:value={prompt} placeholder="Describe your tool..." />
  <input bind:value={input} placeholder="Test input (optional)" />
  <button onclick={generate} disabled={loading}>
    {loading ? 'Generating...' : 'Generate'}
  </button>
  
  {#if result}
    <div class="output">
      <h2>Output ({result.outputType})</h2>
      <pre>{result.output}</pre>
      <p>Packages: {result.packages.join(', ')}</p>
    </div>
  {/if}
</div>
```

**Next.js Example:**

```typescript
// app/tools/page.tsx
'use client'

import { AnytoolClient } from '@/lib/anytool/client'
import { useState } from 'react'

const anytool = new AnytoolClient({
  endpoint: 'https://anytool-v2.your-name.workers.dev'
})

export default function ToolsPage() {
  const [prompt, setPrompt] = useState('Create a UUID generator')
  const [result, setResult] = useState<any>(null)
  
  const generate = async () => {
    const res = await anytool.generate({ prompt, input: '' })
    setResult(res)
  }
  
  return (
    <div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={generate}>Generate</button>
      {result && <pre>{result.output}</pre>}
    </div>
  )
}
```

## Option 2: Self-Host the API

Run the anytool logic in your own backend.

### Step 1: Copy Core Files

Copy these files to your project:
```
src2/types.ts       → $lib/anytool/types.ts
src2/hash.ts        → $lib/anytool/hash.ts
src2/packages.ts    → $lib/anytool/packages.ts
src2/generator.ts   → $lib/anytool/generator.ts
src2/compiler.ts    → $lib/anytool/compiler.ts
src2/cache.ts       → $lib/anytool/cache.ts
src2/anytool.ts     → $lib/anytool/anytool.ts
src2/client.ts      → $lib/anytool/client.ts
```

### Step 2: Implement Executor for Your Runtime

**Example: Node.js VM Executor**

```typescript
// $lib/anytool/node-executor.ts
import { ExecutorAdapter } from './executor'
import vm from 'vm'

export class NodeExecutor implements ExecutorAdapter {
  async execute(bundledCode: string, input: string, hash: string) {
    const context = vm.createContext({
      fetch,
      console,
      URL,
      TextEncoder,
      TextDecoder,
      crypto
    })
    
    const script = new vm.Script(bundledCode)
    const exports: any = {}
    context.exports = exports
    
    script.runInContext(context)
    
    const worker = exports.default
    const request = new Request(`http://tool/?q=${encodeURIComponent(input)}`)
    const response = await worker.fetch(request, {}, {})
    
    return {
      output: await response.text(),
      contentType: response.headers.get('content-type') || 'text/plain'
    }
  }
}
```

### Step 3: Create API Endpoint

**SvelteKit Example:**

```typescript
// src/routes/api/anytool/+server.ts
import { json } from '@sveltejs/kit'
import { Anytool } from '$lib/anytool/anytool'
import { MemoryCache } from '$lib/anytool/cache'
import { NodeExecutor } from '$lib/anytool/node-executor'
import { OPENAI_API_KEY, COMPILER_URL } from '$env/static/private'

const anytool = new Anytool({
  openaiApiKey: OPENAI_API_KEY,
  compilerUrl: COMPILER_URL,
  cache: new MemoryCache(),
  executor: new NodeExecutor()
})

export async function POST({ request }) {
  const body = await request.json()
  const result = await anytool.generate(body)
  
  if ('error' in result) {
    return json(result, { status: 500 })
  }
  
  return json(result)
}
```

### Step 4: Use Client SDK

```typescript
// src/routes/tools/+page.svelte
import { AnytoolClient } from '$lib/anytool/client'

const anytool = new AnytoolClient({
  endpoint: '/api/anytool'  // Your local endpoint
})

// Same usage as Option 1
```

## Option 3: Embed Everything

Copy the entire `src2/` directory and run it yourself.

### Pros:
- Full control
- No external dependencies
- Can customize everything

### Cons:
- Need to handle compilation service
- Need to set up R2 or alternative storage
- More maintenance

### Setup:

1. Copy `src2/` to your project
2. Set up a Bun compiler service (see `container/` directory)
3. Implement or use existing `CacheAdapter`
4. Deploy and configure

## Comparison

| Approach | Setup Time | Maintenance | Control | Best For |
|----------|-----------|-------------|---------|----------|
| Remote Service | 5 min | None | Low | Quick prototypes, MVPs |
| Self-Host API | 30 min | Low | Medium | Production apps |
| Embed Everything | 2-4 hours | Medium | Full | Special requirements |

## Tips

1. **Start with Remote Service**: Get it working first, self-host later if needed
2. **Type Safety**: Always copy `types.ts` for proper TypeScript support
3. **Caching**: In self-hosted setups, implement a persistent cache adapter
4. **Security**: Add authentication in production (API keys, JWT, etc.)
5. **Rate Limiting**: Anytool generates code with AI - add rate limits

## Example Projects

### Minimal SvelteKit Integration

```
your-sveltekit-app/
├── src/
│   ├── lib/
│   │   └── anytool/
│   │       ├── types.ts       # Copied
│   │       └── client.ts      # Copied
│   └── routes/
│       └── tools/
│           └── +page.svelte   # Your UI
└── package.json
```

### Full Self-Hosted

```
your-app/
├── src/
│   ├── lib/
│   │   └── anytool/
│   │       ├── types.ts
│   │       ├── hash.ts
│   │       ├── packages.ts
│   │       ├── generator.ts
│   │       ├── compiler.ts
│   │       ├── cache.ts
│   │       ├── anytool.ts
│   │       ├── client.ts
│   │       └── your-executor.ts  # Custom
│   └── routes/
│       └── api/
│           └── anytool/
│               └── +server.ts     # API endpoint
└── package.json
```

## Next Steps

1. Choose your integration approach
2. Copy the necessary files
3. Test with a simple tool (UUID generator)
4. Add authentication if needed
5. Build your UI
6. Ship it

## Questions?

- Check `src2/README.md` for usage patterns
- Look at `src2/types.ts` for API contract
- See `src2/worker.tsx` for reference implementation


