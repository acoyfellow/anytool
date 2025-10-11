# Anytool as a Paid Service

## The Pivot

**Before:** Open-source pattern anyone can self-host  
**After:** Paid API service you dogfood, then sell

## Why This Makes More Sense

### Open Source Problems
- ❌ Everyone runs their own (support burden)
- ❌ Different versions everywhere
- ❌ People break it in creative ways
- ❌ You maintain docs for edge cases
- ❌ No revenue for your work
- ❌ Race to bottom on pricing

### Paid Service Benefits
- ✅ One deployment to maintain
- ✅ You control quality
- ✅ Fast iteration (no breaking changes for others)
- ✅ Revenue from day one (your usage)
- ✅ Dogfood before selling
- ✅ Clear value proposition
- ✅ Better than DIY (no OpenAI key needed, no infra)

## The Plan

### Phase 1: Dogfood (Week 1-2)

**Goal:** Use it in inbox.dog, make it work really well

```typescript
// inbox.dog backend
import { AnytoolClient } from '$lib/anytool/client'

const anytool = new AnytoolClient({
  endpoint: 'https://anytool-api.coey.dev',
  apiKey: env.ANYTOOL_INTERNAL_KEY  // Your internal key
})

// Use for inbox.dog features
// - Email parsing tools
// - Data transformation
// - Content generation
// - Whatever inbox.dog needs
```

**Deploy:**
```bash
# Deploy to your own subdomain
wrangler deploy --config wrangler2.jsonc
# → https://anytool-api.coey.dev
```

**Track:**
- What tools get generated most
- Performance (cache hit rate, latency)
- Errors and edge cases
- What packages people actually need
- Cost per tool generation

### Phase 2: Add Auth & Billing (Week 3)

**Goal:** Multi-tenant, API keys, usage tracking

```typescript
// src2/auth.ts
export async function verifyApiKey(apiKey: string, env: any) {
  // Check against your user DB or Cloudflare KV
  const user = await env.USERS_DB.get(`apikey:${apiKey}`)
  if (!user) throw new Error('Invalid API key')
  return JSON.parse(user)
}

export async function trackUsage(userId: string, toolHash: string, env: any) {
  // Track usage for billing
  await env.USAGE_DB.put(`${userId}:${Date.now()}:${toolHash}`, {
    timestamp: Date.now(),
    cached: false  // or true
  })
}
```

```typescript
// src2/worker.tsx - add middleware
app.use("/api/*", async (c, next) => {
  const apiKey = c.req.header('x-api-key')
  if (!apiKey) return c.json({ error: 'Missing API key' }, 401)
  
  try {
    const user = await verifyApiKey(apiKey, c.env)
    c.set('user', user)
  } catch (err) {
    return c.json({ error: 'Invalid API key' }, 401)
  }
  
  await next()
})

app.post("/api/tool", async (c) => {
  const user = c.get('user')
  
  // Check rate limits / quota
  const usage = await checkUsage(user.id, c.env)
  if (usage.exceeded) {
    return c.json({ error: 'Quota exceeded' }, 429)
  }
  
  // ... existing logic ...
  
  // Track usage
  await trackUsage(user.id, hash, c.env)
  
  return Response.json(result)
})
```

### Phase 3: Billing Integration (Week 4)

**Use Stripe:**

```typescript
// Pricing tiers
const PLANS = {
  hobby: {
    price: 19,        // $19/mo
    tools: 1000,      // 1k tool executions
    cache: true       // benefit from caching
  },
  pro: {
    price: 99,        // $99/mo
    tools: 10000,     // 10k executions
    cache: true,
    priority: true    // faster queue
  },
  business: {
    price: 299,       // $299/mo
    tools: 100000,    // 100k executions
    cache: true,
    priority: true,
    sla: true         // SLA guarantee
  }
}
```

**Why this pricing works:**
- Your cost: ~$0.01-0.05 per tool generation (OpenAI + compute)
- Cached hits: ~$0.0001 (just execution)
- Cache hit rate: 60-80% in production
- Average cost per execution: ~$0.005
- Your margin: 90%+ on cached, 60%+ on generation

**Customer math:**
- Alternative: Run it themselves
  - OpenAI API: $20/mo min
  - Cloudflare Workers: $5-20/mo
  - R2 storage: $5/mo
  - Container: $5-10/mo
  - Engineering time: 8+ hours setup
  - Maintenance: Ongoing
  
- Your service: $19/mo
  - Zero setup
  - No OpenAI key needed
  - No infrastructure
  - Always up to date
  - Just works

### Phase 4: MCP Server (Week 5)

**Ship MCP server for Claude/Cursor/etc:**

```typescript
// mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new Server({
  name: 'anytool',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
})

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'anytool_generate',
    description: 'Generate and execute tools on demand from natural language',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Tool description' },
        input: { type: 'string', description: 'Input to process' }
      },
      required: ['prompt']
    }
  }]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'anytool_generate') {
    const { prompt, input } = request.params.arguments
    
    const result = await fetch('https://anytool-api.coey.dev/api/tool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ANYTOOL_API_KEY
      },
      body: JSON.stringify({ prompt, input })
    })
    
    const data = await result.json()
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2)
      }]
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

**Package as:**
```json
{
  "name": "@acoyfellow/anytool-mcp",
  "version": "1.0.0",
  "bin": {
    "anytool-mcp": "./dist/mcp-server.js"
  }
}
```

**Users install:**
```bash
npx @acoyfellow/anytool-mcp
# Prompts for API key
# Adds to Claude/Cursor config
```

## Go-To-Market

### Target Customers

1. **AI App Builders**
   - Building AI products
   - Need tools without maintenance
   - Will pay for convenience

2. **Agencies**
   - Building client apps
   - Need flexible tool generation
   - Bill it to clients

3. **Internal Tools Teams**
   - Need quick capabilities
   - Don't want to maintain
   - Have budget

### Marketing Channels

1. **Show, Don't Tell**
   - Tweet working examples daily
   - "Built QR generator in 5 seconds"
   - "Password checker, no code"
   - Screen recordings

2. **Build in Public**
   - Share inbox.dog usage
   - "We use anytool for X in inbox.dog"
   - Real metrics, real savings

3. **MCP Directory**
   - List in official MCP directory
   - "One tool that generates any tool"
   - Unique positioning

4. **Developer Communities**
   - Indie Hackers
   - Hacker News (Show HN)
   - Reddit r/SideProject
   - Twitter dev community

### Positioning

**Bad:** "AI code generation platform"  
**Good:** "Never build another specialized tool again"

**Pitch:**
> Need a QR code generator? UUID maker? Password checker?
> Stop building and maintaining dozens of specialized tools.
> Describe it, use it. One API that generates any tool on demand.
> First request: 15s. Cached: 50ms. $19/mo for 1,000 tools.

## Technical Architecture

### Infrastructure

```
┌─────────────────────────────────────────────────┐
│ anytool-api.coey.dev                            │
│ ├─ Cloudflare Workers (Main API)               │
│ ├─ R2 (Cache compiled tools)                    │
│ ├─ Durable Objects (History, Compiler)         │
│ ├─ Container (Bun compiler)                     │
│ └─ KV (API keys, rate limits)                   │
└─────────────────────────────────────────────────┘
            │
            ├─ OpenAI API (code generation)
            ├─ Stripe (billing)
            └─ Your analytics DB
```

### Data Flow

```
User Request
  → API Key Verification (KV lookup)
  → Rate Limit Check (KV)
  → Tool Generation/Execution (existing v2 logic)
  → Usage Tracking (for billing)
  → Response
```

### Database Schema

```typescript
// KV: API Keys
interface ApiKey {
  userId: string
  plan: 'hobby' | 'pro' | 'business'
  createdAt: number
  rateLimit: { requests: number, window: string }
}

// KV: Users
interface User {
  id: string
  email: string
  plan: string
  stripeCustomerId: string
  createdAt: number
}

// D1 or external: Usage tracking
interface Usage {
  userId: string
  timestamp: number
  toolHash: string
  cached: boolean
  responseTime: number
}
```

## Implementation Timeline

### Week 1-2: Dogfood
- [ ] Deploy v2 to anytool-api.coey.dev
- [ ] Integrate into inbox.dog
- [ ] Track what works/breaks
- [ ] Optimize based on real usage

### Week 3: Auth & Multi-tenant
- [ ] Add API key middleware
- [ ] User management (KV)
- [ ] Rate limiting
- [ ] Usage tracking
- [ ] Admin dashboard (see usage)

### Week 4: Billing
- [ ] Stripe integration
- [ ] Pricing page
- [ ] Checkout flow
- [ ] Usage-based alerts
- [ ] Invoice generation

### Week 5: MCP Server
- [ ] Build MCP server
- [ ] Test with Claude Desktop
- [ ] Package for npm
- [ ] Documentation

### Week 6: Launch
- [ ] Landing page
- [ ] Documentation site
- [ ] Sign up flow
- [ ] Launch tweet
- [ ] Show HN post

## Financial Model

### Costs (Monthly)

```
Fixed:
- Cloudflare Workers: $5 (paid plan)
- R2 Storage: $5 (100GB cache)
- Domain: $1
- Stripe: $0 (pay per transaction)
Total Fixed: ~$11/mo

Variable (per 1,000 executions):
- OpenAI (4o-mini): $1-5 (depending on cache hit rate)
- Compute: $0.50
Total Variable: $1.50 - $5.50 per 1,000 executions
```

### Revenue (Monthly)

```
10 hobby customers:     10 × $19  = $190
5 pro customers:         5 × $99  = $495
2 business customers:    2 × $299 = $598

Total: $1,283/mo
Costs: ~$100/mo (including variable)
Profit: ~$1,180/mo
Margin: 92%
```

### Break-Even

```
Fixed costs: $11/mo
Need: 1 hobby customer ($19/mo)
Break-even: Day 1 with first customer
```

### Scale Economics

```
100 customers (avg $50/mo):
Revenue: $5,000/mo
Costs: $500/mo (10% cost ratio improves with scale)
Profit: $4,500/mo
Margin: 90%

1,000 customers:
Revenue: $50,000/mo
Costs: $3,000/mo (6% cost ratio)
Profit: $47,000/mo
Margin: 94%
```

## Why This Beats Open Source

### Open Source Reality
- 100 GitHub stars
- 10 people actually use it
- 5 support issues per week
- $0 revenue
- Competing against free

### Paid Service Reality
- 10 paying customers = $200/mo
- One deployment
- No support (it works or it doesn't)
- $200/mo > $0/mo
- Competing on convenience, not price

## The Pitch to Customers

### Problem
Building AI apps requires dozens of specialized tools: UUID generators, QR codes, password checkers, data parsers, format converters, etc.

Each one takes:
- 2-4 hours to build
- Testing and debugging
- Dependency management
- Ongoing maintenance
- Context window space (for MCP tools)

### Solution
One API that generates any tool on demand.

```typescript
const result = await anytool.generate({
  prompt: 'Create a QR code generator',
  input: 'https://myapp.com'
})
// Returns QR code, cached for future use
```

### Benefits
- **Fast:** 15s first time, 50ms cached
- **Cheap:** $19/mo vs building yourself
- **Reliable:** 99.9% uptime
- **Fresh:** Always uses latest packages
- **Simple:** One API key, one endpoint

### Comparison

| Approach | Cost | Time | Maintenance |
|----------|------|------|-------------|
| Build yourself | $50/mo infra | 40+ hours | Ongoing |
| Use anytool | $19/mo | 5 minutes | Zero |

## Next Steps

1. **This Week:** Integrate into inbox.dog, dogfood it
2. **Week 2:** Add auth middleware, API keys
3. **Week 3:** Add Stripe, pricing page
4. **Week 4:** Build MCP server
5. **Week 5:** Launch

## Success Metrics

### Year 1 Goals
- 50 paying customers ($2,500/mo recurring)
- 95%+ cache hit rate (lower costs)
- 99.9% uptime
- Break-even by month 2

### Year 2 Goals
- 500 customers ($25,000/mo recurring)
- Enterprise tier ($999/mo)
- API partnerships
- Maybe open source the old version (v1) for marketing

## The Bottom Line

**Open Source:**
- Spend months building
- Give it away free
- Support burden
- No revenue
- Race to bottom

**Paid Service:**
- Build once
- Dogfood in inbox.dog
- Charge $19/mo
- $1,000+/mo in 6 months
- No support burden (it works)
- Scale economics improve

**You're solving a real problem. Charge for it.**

This is the pragmatic path.

