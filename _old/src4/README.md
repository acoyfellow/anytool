# Anytool v4 - Pragmatic Dogfooding Version

Simple, single-file approach for dogfooding in inbox.dog, then scaling to paid B2B service.

## Architecture

**One file, one purpose:** `worker.tsx` - complete tool generation API

**Key features:**
- No auth complexity (one hardcoded API key for dogfooding)
- R2 AI Search for live CF Workers docs (no hardcoded prompts)
- Simple client for inbox.dog integration
- Caching via R2
- Same compilation pipeline as v2

## Setup

### 1. Deploy the Service

```bash
# Deploy to your subdomain for dogfooding
wrangler deploy src4/worker.tsx --name anytool-dogfood
# → https://anytool-dogfood.your-domain.workers.dev
```

### 2. Populate R2 with CF Docs

```typescript
// Run once to scrape and store CF Workers documentation
import { scrapeCFDocs } from './docs-scraper.ts';
await scrapeCFDocs(env.TOOL_CACHE, env.AI_SEARCH);
```

### 3. Use in inbox.dog

```typescript
// inbox.dog/src/lib/anytool.ts
import { AnytoolClient } from './anytool-client';

export const anytool = new AnytoolClient({
  endpoint: 'https://anytool-dogfood.your-domain.workers.dev',
  apiKey: 'anytool-internal-dogfood-key-2024'
});

// Generate & use a tool:
// It will be created & cached, then used.
const toolCall = await anytool.run({
  prompt: 'Extract intent from email subject, return JSON with {intent, priority}',
  input: 'RE: URGENT - Budget Meeting Tomorrow',
  forceRegenerate: true // optional
});

// how to use it as a tool in ai sdk
const result = await ai.runTool(toolCall);
```

## Dogfooding Strategy

### Week 1: Basic Integration
```typescript
// Start with simple tools in inbox.dog
const qr = await anytool.generate({
  prompt: 'Generate QR code SVG',
  input: 'https://inbox.dog/verify/abc123'
});

const summary = await anytool.generate({
  prompt: 'Summarize email in one sentence',
  input: emailBody
});
```

### Week 2-3: Expand Usage
- Email intent extraction
- Contact parsing from signatures
- Date parsing for calendar events
- Content validation
- Format conversions

### Track Everything
- Which tools get used most
- Cache hit rates (should be 60-80%)
- Response times
- Cost per generation
- Time saved vs building manually

## API

### Generate Tool
```bash
curl -X POST https://anytool-dogfood.your-domain.workers.dev/api/tool \
  -H "X-API-Key: anytool-internal-dogfood-key-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a UUID generator",
    "input": ""
  }'
```

### Health Check
```bash
curl https://anytool-dogfood.your-domain.workers.dev/health
```

### Clear Cache (dev only)
```bash
curl -X DELETE https://anytool-dogfood.your-domain.workers.dev/api/cache \
  -H "X-API-Key: anytool-internal-dogfood-key-2024"
```

## Key Differences from v3

❌ **Removed complexity:**
- No complex class hierarchies
- No event systems
- No configuration objects
- No TypeScript interfaces everywhere
- No 15+ files across 6 directories

✅ **Kept simplicity:**
- One main file you can scan entirely
- Hardcoded API key for dogfooding
- R2 AI Search replaces hardcoded docs
- Same compilation + execution logic
- Ready for inbox.dog integration

## Scaling to Paid Service

### Phase 1: Dogfood (Week 1-2)
Use this exact setup in inbox.dog. Track metrics.

### Phase 2: Add Auth (Week 3)
```typescript
// Add simple API key middleware
app.use("/api/*", async (c, next) => {
  const apiKey = c.req.header('x-api-key');
  const user = await validateApiKey(apiKey, c.env); // KV lookup
  c.set('user', user);
  await next();
});
```

### Phase 3: Add Billing (Week 4)
```typescript
// Add usage tracking + Stripe
await trackUsage(user.id, hash, c.env);
const usage = await checkQuota(user.id, c.env);
if (usage.exceeded) return c.json({ error: 'Quota exceeded' }, 429);
```

### Phase 4: Launch (Week 5)
- Landing page
- Documentation
- Sign up flow
- Show HN post

## Costs & Pricing

**Your costs (dogfooding):**
- CF Workers: $5/mo
- R2 Storage: $5/mo
- OpenAI API: $10-50/mo (depending on usage)

**Customer pricing:**
- Hobby: $19/mo (1k tools)
- Pro: $99/mo (10k tools)
- Business: $299/mo (100k tools)

**Target:** $1,000/mo recurring in 3 months

## The Story

> "We built inbox.dog and kept needing specialized tools.
> UUID generation, QR codes, email parsing, date conversion...
>
> Each tool took 2-3 days to build right.
>
> So we built anytool: describe any tool, use it instantly.
>
> We went from days to hours. We use it dozens of times daily.
>
> Now you can too."

This is the dogfooding story that sells.