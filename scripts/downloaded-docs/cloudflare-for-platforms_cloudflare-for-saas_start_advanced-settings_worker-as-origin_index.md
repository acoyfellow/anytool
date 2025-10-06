---
title: Workers as your fallback origin · Cloudflare for Platforms docs
description: Learn how to use a Worker as the fallback origin for your SaaS zone.
lastUpdated: 2024-10-14T07:10:31.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/index.md
---

If you are building your application on [Cloudflare Workers](https://developers.cloudflare.com/workers/), you can use a Worker as the origin for your SaaS zone (also known as your fallback origin).

1. In your SaaS zone, [create and set a fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#1-create-fallback-origin). Ensure the fallback origin only has an [originless DNS record](https://developers.cloudflare.com/dns/troubleshooting/faq/#what-ip-should-i-use-for-parked-domain--redirect-only--originless-setup):

   * **Example**: `service.example.com AAAA 100::`

2. In that same zone, navigate to **Workers Routes**.

3. Click **Add route**.

4. Decide whether you want traffic bound for your SaaS zone (`example.com`) to go to that Worker:

   * If *yes*, set the following values:

     * **Route**: `*/*` (routes everything — including custom hostnames — to the Worker).
     * **Worker**: Select the Worker used for your SaaS application.

   * If *no*, set the following values:

     * **Route**: `*.<zonename>.com/*` (only routes custom hostname traffic to the Worker)
     * **Worker**: **None**

5. Click **Save**.
