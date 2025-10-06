---
title: Mistral AI · Cloudflare AI Gateway docs
description: Mistral AI helps you build quickly with Mistral's advanced AI models.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/mistral/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/mistral/index.md
---

[Mistral AI](https://mistral.ai) helps you build quickly with Mistral's advanced AI models.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/mistral
```

## Prerequisites

When making requests to the Mistral AI, you will need:

* AI Gateway Account ID
* AI Gateway gateway name
* Mistral AI API token
* Mistral AI model name

## URL structure

Your new base URL will use the data above in this structure: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/mistral/`.

Then you can append the endpoint you want to hit, for example: `v1/chat/completions`

So your final URL will come together as: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/mistral/v1/chat/completions`.

## Examples

### cURL

```bash
curl -X POST https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/mistral/v1/chat/completions \
 --header 'content-type: application/json' \
 --header 'Authorization: Bearer MISTRAL_TOKEN' \
 --data '{
    "model": "mistral-large-latest",
    "messages": [
        {
            "role": "user",
            "content": "What is Cloudflare?"
        }
    ]
}'
```

### Use `@mistralai/mistralai` package with JavaScript

If you are using the `@mistralai/mistralai` package, you can set your endpoint like this:

```js
import { Mistral } from "@mistralai/mistralai";


const client = new Mistral({
  apiKey: MISTRAL_TOKEN,
  serverURL: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/mistral`,
});


await client.chat.create({
  model: "mistral-large-latest",
  messages: [
    {
      role: "user",
      content: "What is Cloudflare?",
    },
  ],
});
```

## OpenAI-Compatible Endpoint

You can also use the [OpenAI-compatible endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) (`/ai-gateway/usage/chat-completion/`) to access Mistral models using the OpenAI API schema. To do so, send your requests to:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Specify:

```json
{
"model": "mistral/{model}"
}
```
