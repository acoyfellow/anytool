# AI Search Setup for Anytool

## Overview

AI Search is now wired up in the worker but needs to be configured to index the `anytool-docs` R2 bucket.

## Steps to Complete Setup

### 1. Create AI Search Instance

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **AI** → **AI Search**
3. Click **Create AI Search**
4. Name it: `anytool`
5. Select your R2 bucket: `anytool-docs`

### 2. Configure Data Source

The AI Search instance should automatically detect the markdown files in your R2 bucket. Configure:

- **File Types**: Markdown (.md)
- **Indexing**: Enable automatic indexing
- **Refresh**: Set to periodic (daily or weekly)

### 3. Deploy Worker

Once the documents are uploaded (via the scripts) and AI Search is configured:

```bash
cd src4
wrangler deploy
```

### 4. Set Environment Variables

```bash
wrangler secret put OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

## Current Implementation

The worker now includes:

✅ **AI Search Binding**: Configured in `wrangler.toml`
✅ **Search Integration**: Uses `ai.autorag("anytool-docs").search()`
✅ **Context Enhancement**: Injects relevant docs into tool generation

## How It Works

1. User requests a tool with a prompt
2. Worker searches the R2 bucket for relevant Cloudflare documentation
3. Found documentation is injected into the AI prompt
4. Tool is generated with context-aware knowledge
5. Result includes both the generated tool and relevant documentation context

## Testing

Once deployed, test with:

```bash
curl -X POST http://localhost:8787/api/tool \
  -H "Content-Type: application/json" \
  -H "X-API-Key: anytool-internal-dogfood-key-2024" \
  -d '{"prompt": "Create a tool that parses Cloudflare logs"}'
```

The generated tool should now include relevant information from the Cloudflare documentation.

## Troubleshooting

### AI Search Not Found
- Ensure the AI Search instance is named exactly `anytool`
- Check that the R2 bucket has been indexed
- Verify documents were uploaded successfully

### No Search Results
- Check that documents are in markdown format
- Ensure proper content structure in uploaded files
- Verify AI Search indexing has completed

### Worker Errors
- Check wrangler logs: `wrangler tail`
- Ensure all bindings are properly configured
- Verify OPENAI_API_KEY is set

## Next Steps

1. Complete document upload using the scripts
2. Create and configure AI Search instance
3. Deploy worker
4. Test integration
5. Monitor search quality and adjust as needed