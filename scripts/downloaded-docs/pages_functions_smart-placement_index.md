---
title: Smart Placement · Cloudflare Pages docs
description: By default, Workers and Pages Functions are invoked in a data
  center closest to where the request was received. If you are running back-end
  logic in a Pages Function, it may be more performant to run that Pages
  Function closer to your back-end infrastructure rather than the end user.
  Smart Placement (beta) automatically places your workloads in an optimal
  location that minimizes latency and speeds up your applications.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/functions/smart-placement/
  md: https://developers.cloudflare.com/pages/functions/smart-placement/index.md
---

By default, [Workers](https://developers.cloudflare.com/workers/) and [Pages Functions](https://developers.cloudflare.com/pages/functions/) are invoked in a data center closest to where the request was received. If you are running back-end logic in a Pages Function, it may be more performant to run that Pages Function closer to your back-end infrastructure rather than the end user. Smart Placement (beta) automatically places your workloads in an optimal location that minimizes latency and speeds up your applications.

## Background

Smart Placement applies to Pages Functions and middleware. Normally, assets are always served globally and closest to your users.

Smart Placement on Pages currently has some caveats. While assets are always meant to be served from a location closest to the user, there are two exceptions to this behavior:

1. If using middleware for every request (`functions/_middleware.js`) when Smart Placement is enabled, all assets will be served from a location closest to your back-end infrastructure. This may result in an unexpected increase in latency as a result.

2. When using [`env.ASSETS.fetch`](https://developers.cloudflare.com/pages/functions/advanced-mode/), assets served via the `ASSETS` fetcher from your Pages Function are served from the same location as your Function. This could be the location closest to your back-end infrastructure and not the user.

Note

To understand how Smart Placement works, refer to [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement/).

## Enable Smart Placement (beta)

Smart Placement is available on all plans.

### Enable Smart Placement via the dashboard

To enable Smart Placement via the dashboard:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Pages project.

3. Select **Settings** > **Runtime**.

4. Under **Placement**, choose **Smart**.

5. Send some initial traffic (approximately 20-30 requests) to your Pages Functions. It takes a few minutes after you have sent traffic to your Pages Function for Smart Placement to take effect.

6. View your Pages Function's [request duration metrics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) under Functions Metrics.

## Give feedback on Smart Placement

Smart Placement is in beta. To share your thoughts and experience with Smart Placement, join the [Cloudflare Developer Discord](https://discord.cloudflare.com).
