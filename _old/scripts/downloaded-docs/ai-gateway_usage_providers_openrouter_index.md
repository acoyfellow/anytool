---
title: OpenRouter · Cloudflare AI Gateway docs
description: OpenRouter is a platform that provides a unified interface for
  accessing and using large language models (LLMs).
lastUpdated: 2025-09-23T18:25:13.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/openrouter/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/openrouter/index.md
---

[OpenRouter](https://openrouter.ai/) is a platform that provides a unified interface for accessing and using large language models (LLMs).

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openrouter
```

## URL structure

When making requests to [OpenRouter](https://openrouter.ai/), replace `https://openrouter.ai/api/v1/chat/completions` in the URL you are currently using with `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openrouter/chat/completions`.

## Prerequisites

When making requests to OpenRouter, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active OpenRouter API token or a token from the original model provider.
* The name of the OpenRouter model you want to use.

## Examples

### cURL

```bash
curl -X POST https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openrouter/v1/chat/completions \
 --header 'content-type: application/json' \
 --header 'Authorization: Bearer OPENROUTER_TOKEN' \
 --data '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "What is Cloudflare?"
        }
    ]
}'
```

### Use OpenAI SDK with JavaScript

If you are using the OpenAI SDK with JavaScript, you can set your endpoint like this:

```js
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: env.OPENROUTER_TOKEN,
  baseURL:
    "https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY/openrouter",
});


try {
  const chatCompletion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [{ role: "user", content: "What is Cloudflare?" }],
  });


  const response = chatCompletion.choices[0].message;


  return new Response(JSON.stringify(response));
} catch (e) {
  return new Response(e);
}
```
