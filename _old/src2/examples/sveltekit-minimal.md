# Minimal SvelteKit Integration

This shows the absolute minimum to get anytool working in a SvelteKit project.

## Files to Copy (2 files)

```bash
# Copy these 2 files to your SvelteKit project
cp src2/types.ts your-app/src/lib/anytool/types.ts
cp src2/client.ts your-app/src/lib/anytool/client.ts
```

## Usage

### 1. Create the Page Component

```svelte
<!-- src/routes/tools/+page.svelte -->
<script lang="ts">
  import { AnytoolClient } from '$lib/anytool/client'
  
  const anytool = new AnytoolClient({
    endpoint: 'https://anytool-v2.your-workers.dev'
  })
  
  let prompt = $state('Create a UUID generator using the uuid package')
  let input = $state('')
  let result = $state<any>(null)
  let loading = $state(false)
  let error = $state<string | null>(null)
  
  async function generate() {
    loading = true
    error = null
    result = null
    
    try {
      result = await anytool.generate({ prompt, input })
    } catch (err: any) {
      error = err.message
    } finally {
      loading = false
    }
  }
</script>

<div class="container">
  <h1>Anytool Demo</h1>
  
  <div class="input-group">
    <label>
      Describe your tool:
      <textarea 
        bind:value={prompt} 
        placeholder="Create a UUID generator using the uuid package"
        rows="3"
      />
    </label>
    
    <label>
      Test input (optional):
      <input bind:value={input} placeholder="test value" />
    </label>
    
    <button onclick={generate} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Tool'}
    </button>
  </div>
  
  {#if error}
    <div class="error">
      <strong>Error:</strong> {error}
    </div>
  {/if}
  
  {#if result}
    <div class="result">
      <div class="meta">
        <span class="badge">{result.outputType}</span>
        <span class="badge">{result.cached ? 'cached' : 'compiled'}</span>
        <span class="packages">Packages: {result.packages.join(', ')}</span>
      </div>
      
      <div class="output">
        {#if result.outputType === 'json'}
          <pre>{JSON.stringify(JSON.parse(result.output), null, 2)}</pre>
        {:else if result.outputType === 'svg'}
          {@html result.output}
        {:else if result.outputType === 'html'}
          {@html result.output}
        {:else}
          <pre>{result.output}</pre>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  textarea, input {
    width: 100%;
    padding: 0.5rem;
    font-family: inherit;
  }
  
  textarea {
    resize: vertical;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background: #0066cc;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error {
    padding: 1rem;
    background: #fee;
    border: 1px solid #c00;
    color: #c00;
    margin-bottom: 1rem;
  }
  
  .result {
    border: 1px solid #ddd;
    padding: 1rem;
  }
  
  .meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .badge {
    padding: 0.25rem 0.5rem;
    background: #eee;
    border-radius: 3px;
    font-size: 0.875rem;
  }
  
  .packages {
    color: #666;
    font-size: 0.875rem;
  }
  
  .output {
    background: #f5f5f5;
    padding: 1rem;
    overflow-x: auto;
  }
  
  pre {
    margin: 0;
  }
</style>
```

## That's It!

Total files needed: **2 TypeScript files** + **1 Svelte component**

Total setup time: **~5 minutes**

## Examples to Try

1. **UUID Generator**
   ```
   Prompt: "Create a UUID generator using the uuid package"
   Input: (leave empty)
   ```

2. **QR Code**
   ```
   Prompt: "Build a QR code generator that outputs SVG using qrcode-generator package"
   Input: "https://yoursite.com"
   ```

3. **Password Strength**
   ```
   Prompt: "Build a password strength meter using zxcvbn"
   Input: "password123"
   ```

4. **Markdown to HTML**
   ```
   Prompt: "Create a markdown to HTML converter using marked"
   Input: "# Hello\n\nThis is **bold** text."
   ```

## Deploy the Worker First

```bash
# In the anytool directory
cd /path/to/anytool
wrangler deploy --config wrangler2.jsonc

# Note the URL
# Update the endpoint in your Svelte component
```

## Environment Variables

If you add authentication later:

```typescript
// .env
PUBLIC_ANYTOOL_ENDPOINT=https://anytool-v2.your-workers.dev
PUBLIC_ANYTOOL_API_KEY=your-secret-key
```

```typescript
// In your component
const anytool = new AnytoolClient({
  endpoint: env.PUBLIC_ANYTOOL_ENDPOINT,
  apiKey: env.PUBLIC_ANYTOOL_API_KEY
})
```


