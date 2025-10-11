# Anytool v6: Remote + SvelteKit Implementation Plan

## Overview
Migrate from current worker.tsx approach to a proper SvelteKit + Remote framework application for early adopter launch.

## Current State Analysis (src5/)
- Single worker.tsx file handling everything
- Hono-based API with JSX rendering
- Basic caching with R2
- Tool generation, execution, and modification features
- Universal content sandbox with iframe isolation
- History tracking and management

## Target Architecture (Remote Framework)

### Project Structure
```
anytool-app/
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte 5 components
│   │   ├── stores/             # Svelte stores
│   │   └── utils/              # Shared utilities
│   ├── routes/
│   │   ├── api/                # API routes
│   │   ├── tools.remote.ts     # Core remote functions
│   │   ├── +layout.svelte      # Main layout
│   │   ├── +page.svelte        # Homepage
│   │   └── history/            # History page
│   └── app.html               # Base HTML template
├── worker/
│   └── index.ts               # Durable Objects + tool execution
└── static/                    # Static assets
```

## Implementation Plan

### Phase 1: Project Setup
1. Create new Remote app: `bun create remote-app anytool-app`
2. Remove authentication (no user backend for v1)
3. Configure Cloudflare bindings for:
   - TOOL_CACHE (R2)
   - OPENAI_API_KEY (env var)
   - LOADER (Worker binding for tool execution)

### Phase 2: Core Remote Functions (tools.remote.ts)
Migrate current API endpoints to Remote functions:
- `generateTool(prompt, input, forceRegenerate, baseToolHash?, modification?)`
- `getHistory()`
- `clearHistory()`
- `clearCache(hash?)`

### Phase 3: Frontend Components (Svelte 5)
1. **ToolGenerator.svelte** - Main tool generation interface
   - Prompt textarea
   - Input field
   - Force regenerate checkbox
   - Run button
   - Universal content renderer

2. **OutputDisplay.svelte** - Universal content sandbox
   - Auto-detection of content types
   - Enhanced iframe with CORS proxy
   - Modify tool button for cached tools

3. **ModifyDialog.svelte** - Tool modification interface
   - Modal for modification requests
   - Apply/cancel actions

4. **HistoryList.svelte** - Tool history management
   - List of previous tools
   - Modify buttons
   - Clear history option

5. **ExampleGrid.svelte** - Quick example buttons

### Phase 4: Durable Objects Migration (worker/index.ts)
1. **ToolCache DO** - Manage tool and prompt storage
2. **ToolExecutor DO** - Handle Worker Loader execution
3. **HistoryManager DO** - Track tool history

### Phase 5: Universal Content Sandbox
Port current iframe-based renderer with enhancements:
- Auto content-type detection
- CORS proxy integration
- Enhanced security sandbox
- Live data refresh capabilities

### Phase 6: Homepage Design (PlanetScale-style)
- Ultra minimal, terminal-like aesthetic
- Hero section explaining the concept
- API-only service messaging
- CTA: email support@getanytool.com
- No billing/signup (for now)

### Phase 7: API Integration
Structure for inbox.dog integration:
- RESTful API endpoints
- Simple API key authentication
- Rate limiting considerations
- Error handling and monitoring

## Key Technical Decisions

### Remote Functions Benefits
- Type-safe client-server communication
- Automatic development/production switching
- Built-in error handling
- Simplified state management

### Svelte 5 Features to Leverage
- Runes for reactive state
- Snippet composition
- Enhanced component lifecycle
- Better TypeScript integration

### Durable Objects Strategy
- Separate DOs for different concerns
- Efficient caching strategies
- Global consistency for tool execution
- Scalable architecture

## Success Metrics
1. **Feature Parity**: All src5/ functionality working
2. **Performance**: Faster than current implementation
3. **UX**: Cleaner, more responsive interface
4. **Architecture**: Scalable for future features
5. **API Ready**: Easy integration for inbox.dog

## Next Steps
1. Initialize Remote app
2. Port core tool generation logic
3. Build Svelte components
4. Implement universal sandbox
5. Create minimal homepage
6. Test with inbox.dog integration

## Timeline Estimate
- Setup & core functions: 2-3 hours
- Frontend components: 3-4 hours
- Durable Objects: 2-3 hours
- Homepage & polish: 1-2 hours
- **Total**: ~8-12 hours for MVP

## Notes
- Keep it super minimal for early adopters
- Focus on functionality over aesthetics initially
- Ensure easy API integration path
- Plan for future billing integration
- Maintain security-first approach with sandboxing

---

## Integration Patterns & Use Cases

### Core Problem: "Generate Anything On Demand Apps"
Anytool creates functional tools instantly, but the key is **how do people integrate and render the outputs**. We need to solve both the API integration AND the frontend rendering challenge.

### 1. Email Agents (inbox.dog Primary Use Case)

#### How inbox.dog Would Integrate:
```typescript
// In inbox.dog's tool definitions
import { generateObject } from 'ai'

const tools = [
  {
    name: 'anytool_generate',
    description: 'Generate and execute custom tools on-demand for any request',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'What tool to generate (e.g., "Create a QR code for this URL", "Generate a chart of this data")'
        },
        input: {
          type: 'string',
          description: 'Data to process with the tool'
        }
      }
    }
  }
]

// Tool execution
async function execute_anytool_generate(prompt: string, input: string) {
  const response = await fetch('https://api.anytool.com/generate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, input })
  })

  const result = await response.json()

  // Key: Return both the output AND a shareable URL
  return {
    output: result.output,
    contentType: result.outputType,
    shareableUrl: `https://anytool.com/view/${result.toolHash}?input=${encodeURIComponent(input)}`,
    description: result.outputDescription
  }
}
```

#### Email Agent Workflow:
1. **User**: "Create a QR code for my website and include it in the email"
2. **Agent**: Calls `anytool_generate("QR code generator", "https://mysite.com")`
3. **Anytool**: Returns SVG QR code + shareable URL
4. **Agent**: Embeds in email: "Here's your QR code: [View Interactive Version](https://anytool.com/view/abc123)"

### 2. Shareable Tool Outputs (Critical Feature)

#### URL Structure:
```
https://anytool.com/view/{toolHash}?input={encodedInput}
```

#### SvelteKit Route: `/view/[hash]/+page.svelte`
```svelte
<script>
  import { page } from '$app/stores'
  import UniversalRenderer from '$lib/components/UniversalRenderer.svelte'

  const toolHash = $page.params.hash
  const input = $page.url.searchParams.get('input') || ''

  // Execute cached tool with new input
  let toolResult = $state()

  onMount(async () => {
    toolResult = await executeCachedTool(toolHash, input)
  })
</script>

{#if toolResult}
  <UniversalRenderer
    content={toolResult.output}
    contentType={toolResult.outputType}
  />
{/if}
```

### 3. Multi-Platform Integration Patterns

#### A. REST API (Universal)
```bash
# Generate tool
POST https://api.anytool.com/generate
{
  "prompt": "Create a crypto portfolio tracker",
  "input": "BTC,ETH,ADA"
}

# Response
{
  "output": "<html>...</html>",
  "outputType": "html",
  "shareableUrl": "https://anytool.com/view/xyz789",
  "toolHash": "xyz789",
  "cached": false
}
```

#### B. Slack Integration
```typescript
// Slack slash command: /anytool
app.command('/anytool', async ({ command, ack, respond }) => {
  await ack()

  const [prompt, ...inputParts] = command.text.split(' | ')
  const input = inputParts.join(' | ')

  const result = await anytoolAPI.generate(prompt, input)

  await respond({
    text: `Generated: ${result.outputDescription}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${prompt}*` }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Result' },
            url: result.shareableUrl
          }
        ]
      }
    ]
  })
})
```

#### C. Discord Bot
```typescript
// Discord command: !anytool <prompt> | <input>
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!anytool ')) {
    const [prompt, input] = message.content.slice(9).split(' | ')

    const result = await anytoolAPI.generate(prompt, input)

    const embed = new EmbedBuilder()
      .setTitle(result.outputDescription)
      .setDescription(`[View Interactive Result](${result.shareableUrl})`)
      .setColor(0x00AE86)

    if (result.outputType === 'image') {
      embed.setImage(result.output)
    }

    await message.reply({ embeds: [embed] })
  }
})
```

### 4. Frontend Rendering Solutions

#### A. Universal Renderer Component (Core)
```svelte
<!-- UniversalRenderer.svelte -->
<script>
  let { content, contentType, height = '400px' } = $props()

  function renderContent(content, type) {
    switch(type) {
      case 'html':
        return renderInSandbox(content, height)
      case 'svg':
        return `<div class="svg-container">${content}</div>`
      case 'json':
        return `<pre><code>${JSON.stringify(JSON.parse(content), null, 2)}</code></pre>`
      case 'image':
        return `<img src="${content}" alt="Generated image" />`
      case 'csv':
        return renderCSVTable(content)
      default:
        return `<pre>${content}</pre>`
    }
  }
</script>

{@html renderContent(content, contentType)}
```

#### B. Embeddable Widget
```html
<!-- For external sites -->
<script src="https://anytool.com/embed.js"></script>
<div data-anytool-hash="abc123" data-input="custom input"></div>
```

### 5. Real-World Use Cases

#### Email Marketing
- **Agent**: "Create a personalized chart of this customer's usage data"
- **Result**: Interactive HTML chart embedded in email + shareable link

#### Customer Support
- **Agent**: "Generate a troubleshooting guide for this error code"
- **Result**: Step-by-step HTML guide with interactive elements

#### Sales
- **Agent**: "Create a pricing calculator for this prospect"
- **Result**: Interactive calculator they can use and share

#### Education
- **Agent**: "Make a quiz about this topic"
- **Result**: Interactive quiz with immediate feedback

### 6. Technical Architecture for URLs

#### Database Schema (D1):
```sql
CREATE TABLE tool_executions (
  id TEXT PRIMARY KEY,
  tool_hash TEXT NOT NULL,
  input TEXT,
  output TEXT,
  content_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME
);
```

#### Caching Strategy:
- **Tool Code**: Cached indefinitely (R2)
- **Executions**: Cached 30 days (D1 + R2)
- **Popular Tools**: CDN cached

### 7. Revenue Model Ideas

#### Usage-Based:
- Free: 100 generations/month
- Pro: $10/month for 10K generations
- Enterprise: Custom pricing

#### Per-Integration:
- Email agents: $5/agent/month
- Slack/Discord: $20/workspace/month
- API access: $0.01/generation

### 8. Marketing Message

**"Turn any AI agent into a universal app generator"**

Instead of building dozens of tools, give your AI agents ONE tool that can create anything on-demand:
- QR codes, charts, calculators, forms, dashboards
- All securely rendered and shareable
- Works in email, Slack, Discord, or any platform

**For inbox.dog**: "Your email agents can now generate custom tools to answer any request - from data visualizations to interactive calculators - all rendered beautifully and shareable."