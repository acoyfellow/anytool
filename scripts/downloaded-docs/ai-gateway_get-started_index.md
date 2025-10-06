---
title: Getting started · Cloudflare AI Gateway docs
description: In this guide, you will learn how to create and use your first AI Gateway.
lastUpdated: 2025-08-27T13:32:22.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/get-started/
  md: https://developers.cloudflare.com/ai-gateway/get-started/index.md
---

In this guide, you will learn how to create and use your first AI Gateway.

* Dashboard

  [Create a Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway#create)

  1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
  2. Go to **AI** > **AI Gateway**.
  3. Select **Create Gateway**.
  4. Enter your **Gateway name**. Note: Gateway name has a 64 character limit.
  5. Select **Create**.

* API

  To set up an AI Gateway using the API:

  1. [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the following permissions:

     * `AI Gateway - Read`
     * `AI Gateway - Edit`

  2. Get your [Account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).

  3. Using that API token and Account ID, send a [`POST` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/) to the Cloudflare API.

### Authenticated gateway

When you enable authentication on gateway each request is required to include a valid cloudflare token, adding an extra layer of security. We recommend using an authenticated gateway when storing logs to prevent unauthorized access and protect against invalid requests that can inflate log storage usage and make it harder to find the data you need. [Learn more](https://developers.cloudflare.com/ai-gateway/configuration/authentication/).

## Provider Authentication

Authenticate with your upstream provider using one of the following options:

* **Unified Billing:** Use the AI Gateway billing to pay for and authenticate your inference requests. Refer to [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/).
* **BYOK (Store Keys):** Store your credentials in Cloudflare, and AI Gateway will include them at runtime. Refer to [BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/).
* **Request headers:** Include your provider key in the request headers as you normally would (for example, `Authorization: Bearer <PROVIDER_API_KEY>`).

## Integration Options

### Unified API (OpenAI-Compatible) Endpoint

recommended

The easiest way to get started with AI Gateway is through our OpenAI-compatible `/chat/completions` endpoint. This allows you to use existing OpenAI SDKs and tools with minimal code changes while gaining access to multiple AI providers.

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

**Key benefits:**

* Drop-in replacement for OpenAI API
* Works with existing OpenAI SDKs and other OpenAI compliant clients
* Switch between providers by changing the `model` parameter
* Dynamic Routing - Define complex routing scenarios requiring conditional logic, conduct A/B tests, set rate / budget limits, etc

#### Example:

```js
import OpenAI from "openai";


const client = new OpenAI({
  apiKey: "YOUR_PROVIDER_API_KEY",
  baseURL:
    "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat",
});


// Use different providers by changing the model parameter
const response = await client.chat.completions.create({
  model: "google-ai-studio/gemini-2.0-flash", // or "openai/gpt-4o", "anthropic/claude-3-haiku"
  messages: [{ role: "user", content: "Hello, world!" }],
});
```

Refer to [Unified API](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) to learn more about OpenAI compatibility.

### Provider-specific endpoints

For direct integration with specific AI providers, use dedicated endpoints that maintain the original provider's API schema while adding AI Gateway features.

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/{provider}
```

**Available providers:**

* [OpenAI](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/) - GPT models and embeddings
* [Anthropic](https://developers.cloudflare.com/ai-gateway/usage/providers/anthropic/) - Claude models
* [Google AI Studio](https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/) - Gemini models
* [Workers AI](https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/) - Cloudflare's inference platform
* [AWS Bedrock](https://developers.cloudflare.com/ai-gateway/usage/providers/bedrock/) - Amazon's managed AI service
* [Azure OpenAI](https://developers.cloudflare.com/ai-gateway/usage/providers/azureopenai/) - Microsoft's OpenAI service
* [and more...](https://developers.cloudflare.com/ai-gateway/usage/providers/)

## Next steps

* Learn more about [caching](https://developers.cloudflare.com/ai-gateway/features/caching/) for faster requests and cost savings and [rate limiting](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/) to control how your application scales.
* Explore how to specify model or provider [fallbacks, ratelimits, A/B tests](https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/) for resiliency.
* Learn how to use low-cost, open source models on [Workers AI](https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/) - our AI inference service.
