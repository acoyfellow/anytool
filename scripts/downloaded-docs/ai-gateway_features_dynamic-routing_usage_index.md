---
title: Using a dynamic route · Cloudflare AI Gateway docs
lastUpdated: 2025-09-16T08:15:06.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/usage/
  md: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/usage/index.md
---

Warning

Ensure your gateway has [authentication](https://developers.cloudflare.com/ai-gateway/configuration/authentication/) turned, on and you have your upstream providers keys stored with [BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/).

## Examples

### OpenAI SDK

```js
import OpenAI from "openai";


const cloudflareToken = "CF_AIG_TOKEN";
const accountId = "{account_id}";
const gatewayId = "{gateway_id}";
const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat`;


const openai = new OpenAI({
  apiKey: cloudflareToken,
  baseURL,
});


try {
  const model = "dynamic/<your-dynamic-route-name>";
  const messages = [{ role: "user", content: "What is a neuron?" }];
  const chatCompletion = await openai.chat.completions.create({
    model,
    messages,
  });
  const response = chatCompletion.choices[0].message;
  console.log(response);
} catch (e) {
  console.error(e);
}
```

### Fetch

```bash
curl -X POST https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions \
  --header 'cf-aig-authorization: Bearer {CF_AIG_TOKEN}' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "dynamic/gemini-2.0-flash",
    "messages": [
      {
        "role": "user",
        "content": "What is Cloudflare?"
      }
    ]
  }'
```

### Workers

```ts
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request: Request, env: Env) {
    const response = await env.AI.gateway("dfD").run({
      provider: "compat",
      endpoint: "chat/completion",
      headers: {},
      query: {
        model: "dynamic/support",
        messages: [
          {
            role: "user",
            content: "What is Cloudflare?",
          },
        ],
      },
    });
    return Response(response);
  },
};
```
