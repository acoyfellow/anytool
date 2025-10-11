---
title: Unified Billing · Cloudflare AI Gateway docs
description: Use the Cloudflare billing to pay for and authenticate your inference requests.
lastUpdated: 2025-08-27T13:32:22.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/unified-billing/
  md: https://developers.cloudflare.com/ai-gateway/features/unified-billing/index.md
---

Warning

Unified Billing is in closed beta. Request for access.

Unified Billing allows users to connect to various AI providers (e.g. OpenAI, Anthropic) and receive a single Cloudflare bill. To use Unified Billing, users must purchase and load credits into their Cloudflare account, via the Dashboard, which can then be spent via the AI Gateway.

### Load credits

* Navigate to [AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) on Cloudflare dashboard
* The "Credits Available" card on the top right shows how many AI gateway credits you have on your account currently.
* Click "Manage" to navigate to the new billing page
* If you don't have a payment method already on your account, you will be prompted to "Add a payment method to purchase credits" on top of page.
* Once you have a card added, you will be able to do a credit top up on your account by clicking "Top-up credits", and then adding the required amount on the next popup.

### Auto-top up

* Navigate to [AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) on Cloudflare dashboard
* Click "Manage" on the "Credits Available" card on the top right to navigate to the new billing page
* Click the "Setup auto top-up credits" option on the dashboard, and set up a threshold and a recharge amount for auto topup.

When your balance falls below the given threshold, we will automatically apply the auto topup on your account.

### Using Unified Billing

#### Pre-requisites

* Ensure your gateway is [authenticated](https://developers.cloudflare.com/ai-gateway/configuration/authentication/).

Call any supported provider without passing any API Key. The request will automatically use Cloudflare's key and deduct credits from your account.

Example with Unified API:

```bash
curl -X POST https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions \
  --header 'cf-aig-authorization: Bearer {CLOUDFLARE_TOKEN}' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "google-ai-studio/gemini-2.5-pro",
    "messages": [
      {
        "role": "user",
        "content": "What is Cloudflare?"
      }
    ]
  }'
```

### Spend limit

Set spend limits to prevent unexpected charges on your loaded credits. You can define daily, weekly, or monthly limits. When a limit is reached, the AI Gateway automatically stops processing requests until the period resets or you increase the limit.

### Supported Providers

* [OpenAI](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/)
* [Anthropic](https://developers.cloudflare.com/ai-gateway/usage/providers/anthropic/)
* [Google AI Studio](https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/)
* [xAI](https://developers.cloudflare.com/ai-gateway/usage/providers/grok/)
* [Groq](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/)
