---
title: Limits · Cloudflare Browser Rendering docs
description: Learn about the limits associated with Browser Rendering.
lastUpdated: 2025-09-25T08:29:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/platform/limits/
  md: https://developers.cloudflare.com/browser-rendering/platform/limits/index.md
---

Available on Free and Paid plans

## Workers Free

Users on the [Workers Free plan](https://developers.cloudflare.com/workers/platform/pricing/) are limited to **10 minutes of browser rendering usage per day**.

To increase this limit, you will need to [upgrade to a Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing).

| Feature | Limit |
| - | - |
| Concurrent browsers per account (Workers Bindings only) | 3 per account |
| New browser instances per minute (Workers Bindings only) | 3 per minute |
| Browser timeout | 60 seconds |
| Total requests per min (REST API only) | 6 per minute [1](#user-content-fn-1) |

Note on browser timeout

By default, a browser will time out if it does not get any [devtools](https://chromedevtools.github.io/devtools-protocol/) command for 60 seconds, freeing one instance. Users can optionally increase this by using the [`keep_alive` option](https://developers.cloudflare.com/browser-rendering/platform/puppeteer/#keep-alive). `browser.close()` releases the browser instance.

## Workers Paid

Higher limit requests

The limits for Browser Rendering will continue to be raised over time. In the meantime, Cloudflare will grant [requests for higher limits](https://forms.gle/CdueDKvb26mTaepa9) on a case-by-case basis if a need for a higher limit can be clearly demonstrated.

| Feature | Limit |
| - | - |
| Concurrent browsers per account (Workers Bindings only) | 30 per account [1](#user-content-fn-1) [2](#user-content-fn-2) |
| New browser instances per minute (Workers Bindings only) | 30 per minute [1](#user-content-fn-1) [2](#user-content-fn-2) |
| Browser timeout | 60 seconds |
| Total requests per min (REST API only) | 180 per minute [1](#user-content-fn-1) [2](#user-content-fn-2) |

Note on browser timeout

By default, a browser will time out if it does not get any [devtools](https://chromedevtools.github.io/devtools-protocol/) command for 60 seconds, freeing one instance. Users can optionally increase this by using the [`keep_alive` option](https://developers.cloudflare.com/browser-rendering/platform/puppeteer/#keep-alive). `browser.close()` releases the browser instance.

## Note on concurrency

While the limits above define the maximum number of concurrent browser sessions per account, in practice you may not need to hit these limits. Browser sessions close automatically—by default, after 60 seconds of inactivity or upon task completion—so if each session finishes its work before a new request comes in, the effective concurrency is lower. This means that most workflows do not require very high concurrent browser limits.

## FAQ

### I upgraded from the Workers Free plan, but I'm still hitting the 10-minute per day limit. What should I do?

If you recently upgraded to the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) but still encounter the 10-minute per day limit, redeploy your Worker to ensure your usage is correctly associated with the new plan.

### How can I manage concurrency and session isolation with Browser Rendering?

If you are hitting concurrency [limits](https://developers.cloudflare.com/browser-rendering/platform/limits/#workers-paid), or want to optimize concurrent browser usage with the [Workers Binding method](https://developers.cloudflare.com/browser-rendering/workers-bindings/), here are a few tips:

* Optimize with tabs or shared browsers: Instead of launching a new browser for each task, consider opening multiple tabs or running multiple actions within the same browser instance.
* [Reuse sessions](https://developers.cloudflare.com/browser-rendering/workers-bindings/reuse-sessions/): You can optimize your setup and decrease startup time by reusing sessions instead of launching a new browser every time. If you are concerned about maintaining test isolation (for example, for tests that depend on a clean environment), we recommend using [incognito browser contexts](https://pptr.dev/api/puppeteer.browser.createbrowsercontext), which isolate cookies and cache with other sessions.

If you are still running into concurrency limits you can [request a higher limit](https://forms.gle/CdueDKvb26mTaepa9).

### Can I increase the browser timeout?

By default, a browser instance will time out after 60 seconds of inactivity. If you want to keep the browser open longer, you can use the [`keep_alive` option](https://developers.cloudflare.com/browser-rendering/platform/puppeteer/#keep-alive) which allows you to extend the timeout to up to 10 minutes.

### Is there a maximum session duration?

There is no fixed maximum lifetime for a browser session as long as it remains active. By default, a browser will close after one minute of inactivity, but you can [extend this inactivity window](#can-i-increase-the-browser-timeout). Sessions will also be closed when Browser Rendering rolls out a new release.

## Footnotes

1. Rate limits are enforced with a fixed **per-second fill rate**. For example, a limit of 60 requests per minute translates to **1 request per second**. This means you cannot send all 60 requests at once; the API expects them to be spread evenly over the minute. If your account has a custom higher limit, it will also be enforced as a per-second rate. [↩](#user-content-fnref-1) [↩2](#user-content-fnref-1-2) [↩3](#user-content-fnref-1-3) [↩4](#user-content-fnref-1-4)

2. Contact our team to request increases to this limit. [↩](#user-content-fnref-2) [↩2](#user-content-fnref-2-2) [↩3](#user-content-fnref-2-3)
