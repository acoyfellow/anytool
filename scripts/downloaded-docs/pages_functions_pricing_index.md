---
title: Pricing · Cloudflare Pages docs
description: Requests to your Functions are billed as Cloudflare Workers
  requests. Workers plans and pricing can be found in the Workers documentation.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/functions/pricing/
  md: https://developers.cloudflare.com/pages/functions/pricing/index.md
---

Requests to your Functions are billed as Cloudflare Workers requests. Workers plans and pricing can be found [in the Workers documentation](https://developers.cloudflare.com/workers/platform/pricing/).

## Paid Plans

Requests to your Pages functions count towards your quota for Workers Paid plans, including requests from your Function to KV or Durable Object bindings.

Pages supports the [Standard usage model](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing-standard-usage-model).

Note

Workers Enterprise accounts are billed based on the usage model specified in their contract. To switch to the Standard usage model, reach out to your Customer Success Manager (CSM). Some Workers Enterprise customers maintain the ability to [change usage models](https://developers.cloudflare.com/workers/platform/pricing/#how-to-switch-usage-models).

### Static asset requests

On both free and paid plans, requests to static assets are free and unlimited. A request is considered static when it does not invoke Functions. Refer to [Functions invocation routes](https://developers.cloudflare.com/pages/functions/routing/#functions-invocation-routes) to learn more about when Functions are invoked.

## Free Plan

Requests to your Pages Functions count towards your quota for the Workers Free plan. For example, you could use 50,000 Functions requests and 50,000 Workers requests to use your full 100,000 daily request usage. The free plan daily request limit resets at midnight UTC.
