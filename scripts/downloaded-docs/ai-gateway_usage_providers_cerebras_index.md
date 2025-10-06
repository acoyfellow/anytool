---
title: Cerebras · Cloudflare AI Gateway docs
description: Cerebras offers developers a low-latency solution for AI model inference.
lastUpdated: 2025-08-27T13:32:22.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/cerebras/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/cerebras/index.md
---

[Cerebras](https://inference-docs.cerebras.ai/) offers developers a low-latency solution for AI model inference.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/cerebras
```

## Prerequisites

When making requests to Cerebras, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active Cerebras API token.
* The name of the Cerebras model you want to use.

## Examples

### cURL

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/cerebras/chat/completions \
 --header 'content-type: application/json' \
 --header 'Authorization: Bearer CEREBRAS_TOKEN' \
 --data '{
    "model": "llama3.1-8b",
    "messages": [
        {
            "role": "user",
            "content": "What is Cloudflare?"
        }
    ]
}'
```

## OpenAI-Compatible Endpoint

You can also use the [OpenAI-compatible endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) (`/ai-gateway/usage/chat-completion/`) to access Cerebras models using the OpenAI API schema. To do so, send your requests to:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Specify:

```json
{
"model": "cerebras/{model}"
}
```
