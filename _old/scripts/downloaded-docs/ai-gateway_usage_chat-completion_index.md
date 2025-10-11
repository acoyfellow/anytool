---
title: Unified API (OpenAI compat) · Cloudflare AI Gateway docs
description: Cloudflare's AI Gateway offers an OpenAI-compatible
  /chat/completions endpoint, enabling integration with multiple AI providers
  using a single URL. This feature simplifies the integration process, allowing
  for seamless switching between different models without significant code
  modifications.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
tags: AI
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/chat-completion/
  md: https://developers.cloudflare.com/ai-gateway/usage/chat-completion/index.md
---

Cloudflare's AI Gateway offers an OpenAI-compatible `/chat/completions` endpoint, enabling integration with multiple AI providers using a single URL. This feature simplifies the integration process, allowing for seamless switching between different models without significant code modifications.

## Endpoint URL

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Replace `{account_id}` and `{gateway_id}` with your Cloudflare account and gateway IDs.

## Parameters

Switch providers by changing the `model` and `apiKey` parameters.

Specify the model using `{provider}/{model}` format. For example:

* `openai/gpt-4o-mini`
* `google-ai-studio/gemini-2.0-flash`
* `anthropic/claude-3-haiku`

## Examples

### OpenAI SDK

```js
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: "YOUR_PROVIDER_API_KEY", // Provider API key
  // NOTE: the OpenAI client automatically adds /chat/completions to the end of the URL, you should not add it yourself.
  baseURL:
    "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat",
});


const response = await client.chat.completions.create({
  model: "google-ai-studio/gemini-2.0-flash",
  messages: [{ role: "user", content: "What is Cloudflare?" }],
});


console.log(response.choices[0].message.content);
```

### cURL

```bash
curl -X POST https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions \
  --header 'Authorization: Bearer {GOOGLE_GENERATIVE_AI_API_KEY}' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "google-ai-studio/gemini-2.0-flash",
    "messages": [
      {
        "role": "user",
        "content": "What is Cloudflare?"
      }
    ]
  }'
```

## Supported Providers

The OpenAI-compatible endpoint supports models from the following providers:

* [Anthropic](https://developers.cloudflare.com/ai-gateway/usage/providers/anthropic/)
* [OpenAI](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/)
* [Groq](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/)
* [Mistral](https://developers.cloudflare.com/ai-gateway/usage/providers/mistral/)
* [Cohere](https://developers.cloudflare.com/ai-gateway/usage/providers/cohere/)
* [Perplexity](https://developers.cloudflare.com/ai-gateway/usage/providers/perplexity/)
* [Workers AI](https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/)
* [Google-AI-Studio](https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/)
* [Grok](https://developers.cloudflare.com/ai-gateway/usage/providers/grok/)
* [DeepSeek](https://developers.cloudflare.com/ai-gateway/usage/providers/deepseek/)
* [Cerebras](https://developers.cloudflare.com/ai-gateway/usage/providers/cerebras/)
