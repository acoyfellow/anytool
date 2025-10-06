# Integrating Anytool into inbox.dog

## The Dogfooding Plan

Use anytool in inbox.dog to prove it works, then sell it.

## Potential Use Cases in inbox.dog

### 1. Email Content Processing

```typescript
// Parse email subjects for intent
const result = await anytool.generate({
  prompt: 'Extract intent and priority from email subject lines, return JSON with {intent, priority, category}',
  input: 'RE: URGENT - Q4 Budget Review Tomorrow'
})
// → { intent: 'meeting_request', priority: 'high', category: 'finance' }

// Generate email summaries
const summary = await anytool.generate({
  prompt: 'Summarize email content in one sentence',
  input: emailBody
})

// Extract action items
const actions = await anytool.generate({
  prompt: 'Extract action items from email, return JSON array of {task, deadline, assignee}',
  input: emailBody
})
```

### 2. Data Transformation

```typescript
// Parse various date formats
const date = await anytool.generate({
  prompt: 'Parse any date format and return ISO 8601 string',
  input: 'next Tuesday at 3pm'
})

// Convert email to different formats
const markdown = await anytool.generate({
  prompt: 'Convert HTML email to clean markdown',
  input: htmlEmail
})

// Extract structured data
const contacts = await anytool.generate({
  prompt: 'Extract contact information (email, phone, name) from email signature, return JSON',
  input: emailSignature
})
```

### 3. Content Generation

```typescript
// Auto-reply suggestions
const reply = await anytool.generate({
  prompt: 'Generate professional email reply suggestions based on context',
  input: originalEmail
})

// Email templates
const template = await anytool.generate({
  prompt: 'Generate email template for meeting confirmation with variables for {name, date, time, location}',
  input: 'meeting_confirmation'
})

// Subject line suggestions
const subjects = await anytool.generate({
  prompt: 'Generate 3 professional email subject line options based on content',
  input: emailDraft
})
```

### 4. Validation & Processing

```typescript
// Validate email addresses
const validation = await anytool.generate({
  prompt: 'Validate email address format and check for common typos, suggest correction if invalid',
  input: 'user@gmial.com'
})
// → { valid: false, suggestion: 'user@gmail.com' }

// Check for spam indicators
const spam = await anytool.generate({
  prompt: 'Analyze text for spam indicators, return spam score 0-100 and reasons',
  input: emailContent
})

// Detect language
const lang = await anytool.generate({
  prompt: 'Detect language of text, return ISO 639-1 code',
  input: emailContent
})
```

### 5. Smart Features

```typescript
// Calendar event extraction
const events = await anytool.generate({
  prompt: 'Extract calendar events from email, return JSON with {title, date, time, location, attendees}',
  input: emailBody
})

// Link shortening
const shortUrl = await anytool.generate({
  prompt: 'Generate short hash for URL (6 characters, alphanumeric)',
  input: longUrl
})

// Generate QR codes for tracking
const qr = await anytool.generate({
  prompt: 'Generate QR code SVG for email tracking pixel',
  input: trackingUrl
})
```

## Implementation Example

```typescript
// inbox.dog/src/lib/anytool.ts
import { AnytoolClient } from './anytool/client'

export const anytool = new AnytoolClient({
  endpoint: 'https://anytool-api.coey.dev',
  apiKey: process.env.ANYTOOL_API_KEY
})

// Typed helper for common operations
export async function extractEmailIntent(subject: string) {
  const result = await anytool.generate({
    prompt: 'Extract intent from email subject, return JSON with {intent, priority}',
    input: subject
  })
  return JSON.parse(result.output)
}

export async function summarizeEmail(body: string) {
  const result = await anytool.generate({
    prompt: 'Summarize email in one sentence',
    input: body
  })
  return result.output
}
```

```typescript
// inbox.dog/src/routes/api/emails/[id]/+server.ts
import { anytool, extractEmailIntent, summarizeEmail } from '$lib/anytool'

export async function POST({ params, request }) {
  const { subject, body } = await request.json()
  
  // Process email with anytool
  const [intent, summary] = await Promise.all([
    extractEmailIntent(subject),
    summarizeEmail(body)
  ])
  
  // Save to database
  await db.emails.update(params.id, {
    intent: intent.intent,
    priority: intent.priority,
    summary: summary
  })
  
  return json({ intent, summary })
}
```

## Benefits for inbox.dog

### Speed
- Don't build each feature from scratch
- 15s to generate, 50ms cached
- Ship features faster

### Flexibility
- Change prompts without code changes
- A/B test different approaches
- Iterate based on user feedback

### Cost
- Pay per use, not per feature
- Benefit from caching (60-80% hit rate)
- $19/mo vs building everything

### Maintenance
- No dependencies to update
- No security patches
- Just works

## Tracking & Optimization

```typescript
// Track which tools you use most
const usageMetrics = {
  'email_intent_extraction': 1250,  // uses/month
  'email_summarization': 890,
  'date_parsing': 450,
  'contact_extraction': 320,
  'spam_detection': 180
}

// These get cached, so cost decreases over time
// First month: $50 in generation costs
// Second month: $15 (80% cache hit rate)
// Third month: $10 (85% cache hit rate)
```

## Migration Path

### Phase 1: Augment Existing Features
- Add anytool alongside current code
- Compare outputs
- Use anytool when it's better

### Phase 2: Replace Simple Tools
- Remove custom UUID generators
- Remove custom date parsers
- Remove custom validators
- Use anytool

### Phase 3: New Features Only via Anytool
- Ship faster
- Less code to maintain
- Focus on inbox.dog core features

## Example: Smart Email Categorization

**Before (code you'd write):**
```typescript
// 200+ lines of categorization logic
// Rules for different email types
// Edge cases everywhere
// Brittle, hard to change
```

**After (with anytool):**
```typescript
const category = await anytool.generate({
  prompt: 'Categorize email into: work, personal, newsletter, promotional, social, other. Return JSON with {category, confidence}',
  input: email.subject + '\n\n' + email.body
})
```

**Result:**
- 200 lines → 3 lines
- Easy to change prompt
- More accurate (AI vs rules)
- Cached after first use

## Proving the Value

Track metrics in inbox.dog:

```typescript
// Before anytool (hypothetical)
const metrics = {
  timeToShipFeature: '2-3 days',
  linesOfCodePerFeature: '200-500',
  maintenanceBurden: 'high',
  cost: '$50/mo in dev time'
}

// After anytool
const metrics = {
  timeToShipFeature: '1-2 hours',
  linesOfCodePerFeature: '5-20',
  maintenanceBurden: 'zero',
  cost: '$19/mo'
}
```

## The Story for Marketing

> "We built inbox.dog and kept hitting the same problem: 
> we needed specialized tools for email processing.
> 
> UUID generation, QR codes, date parsing, format conversion,
> content extraction, spam detection...
> 
> Each one took 2-3 days to build right.
> 
> So we built anytool: one API that generates any tool on demand.
> Now when we need a tool, we describe it and use it.
> 
> We went from 2-3 days per feature to 1-2 hours.
> We use it dozens of times daily in inbox.dog.
> 
> And you can too."

This is the dogfooding story that sells.

## Next Steps

1. **Today:** Deploy anytool to anytool-api.coey.dev
2. **This Week:** Integrate into inbox.dog for one feature
3. **Week 2:** Expand to 3-5 features
4. **Week 3:** Track metrics (usage, costs, time saved)
5. **Week 4:** Add billing, open to customers

You're not selling theory. You're selling a tool you use daily.

