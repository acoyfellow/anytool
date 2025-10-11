---
title: Google AI Studio · Cloudflare AI Gateway docs
description: Google AI Studio helps you build quickly with Google Gemini models.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/index.md
---

[Google AI Studio](https://ai.google.dev/aistudio) helps you build quickly with Google Gemini models.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-ai-studio
```

## Prerequisites

When making requests to Google AI Studio, you will need:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active Google AI Studio API token.
* The name of the Google AI Studio model you want to use.

## URL structure

Your new base URL will use the data above in this structure: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-ai-studio/`.

Then you can append the endpoint you want to hit, for example: `v1/models/{model}:{generative_ai_rest_resource}`

So your final URL will come together as: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-ai-studio/v1/models/{model}:{generative_ai_rest_resource}`.

## Examples

### cURL

```bash
curl "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/google-ai-studio/v1/models/gemini-1.0-pro:generateContent" \
 --header 'content-type: application/json' \
 --header 'x-goog-api-key: {google_studio_api_key}' \
 --data '{
      "contents": [
          {
            "role":"user",
            "parts": [
              {"text":"What is Cloudflare?"}
            ]
          }
        ]
      }'
```

### Use `@google/generative-ai` with JavaScript

If you are using the `@google/generative-ai` package, you can set your endpoint like this:

```js
import { GoogleGenerativeAI } from "@google/generative-ai";


const api_token = env.GOOGLE_AI_STUDIO_TOKEN;
const account_id = "";
const gateway_name = "";


const genAI = new GoogleGenerativeAI(api_token);
const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  {
    baseUrl: `https://gateway.ai.cloudflare.com/v1/${account_id}/${gateway_name}/google-ai-studio`,
  },
);


await model.generateContent(["What is Cloudflare?"]);
```

## OpenAI-Compatible Endpoint

You can also use the [OpenAI-compatible endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) (`/ai-gateway/usage/chat-completion/`) to access Google AI Studio models using the OpenAI API schema. To do so, send your requests to:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Specify:

```json
{
"model": "google-ai-studio/{model}"
}
```
