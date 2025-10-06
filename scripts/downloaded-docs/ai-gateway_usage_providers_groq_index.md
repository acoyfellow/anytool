---
title: Groq · Cloudflare AI Gateway docs
description: Groq delivers high-speed processing and low-latency performance.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/groq/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/groq/index.md
---

[Groq](https://groq.com/) delivers high-speed processing and low-latency performance.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/groq
```

## URL structure

When making requests to [Groq](https://groq.com/), replace `https://api.groq.com/openai/v1` in the URL you're currently using with `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/groq`.

## Prerequisites

When making requests to Groq, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active Groq API token.
* The name of the Groq model you want to use.

## Examples

### cURL

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/groq/chat/completions \
  --header 'Authorization: Bearer {groq_api_key}' \
  --header 'Content-Type: application/json' \
  --data '{
    "messages": [
      {
        "role": "user",
        "content": "What is Cloudflare?"
      }
    ],
    "model": "llama3-8b-8192"
}'
```

### Use Groq SDK with JavaScript

If using the [`groq-sdk`](https://www.npmjs.com/package/groq-sdk), set your endpoint like this:

```js
import Groq from "groq-sdk";


const apiKey = env.GROQ_API_KEY;
const accountId = "{account_id}";
const gatewayId = "{gateway_id}";
const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/groq`;


const groq = new Groq({
  apiKey,
  baseURL,
});


const messages = [{ role: "user", content: "What is Cloudflare?" }];
const model = "llama3-8b-8192";


const chatCompletion = await groq.chat.completions.create({
  messages,
  model,
});
```

## OpenAI-Compatible Endpoint

You can also use the [OpenAI-compatible endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) (`/ai-gateway/usage/chat-completion/`) to access Groq models using the OpenAI API schema. To do so, send your requests to:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Specify:

```json
{
"model": "groq/{model}"
}
```
