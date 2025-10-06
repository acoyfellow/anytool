---
title: Billing and Limitations · Cloudflare Workers docs
description: Billing, troubleshooting, and limitations for Static assets on Workers
lastUpdated: 2025-06-20T19:49:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
  md: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/index.md
---

## Billing

Requests to a project with static assets can either return static assets or invoke the Worker script, depending on if the request [matches a static asset or not](https://developers.cloudflare.com/workers/static-assets/routing/).

* Requests to static assets are free and unlimited. Requests to the Worker script (for example, in the case of SSR content) are billed according to Workers pricing. Refer to [pricing](https://developers.cloudflare.com/workers/platform/pricing/#example-2) for an example.
* There is no additional cost for storing Assets.
* **Important note for free tier users**: When using [`run_worker_first`](https://developers.cloudflare.com/workers/static-assets/binding/#run_worker_first), requests matching the specified patterns will always invoke your Worker script. If you exceed your free tier request limits, these requests will receive a 429 (Too Many Requests) response instead of falling back to static asset serving. Negative patterns (patterns beginning with `!/`) will continue to serve assets correctly, as requests are directed to assets, without invoking your Worker script.

## Limitations

See the [Platform Limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets)

## Troubleshooting

* `assets.bucket is a required field` — if you see this error, you need to update Wrangler to at least `3.78.10` or later. `bucket` is not a required field.
