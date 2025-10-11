---
title: Frequently asked questions about Cloudflare Browser Rendering ·
  Cloudflare Browser Rendering docs
description: Below you will find answers to our most commonly asked questions
  about Browser Rendering.
lastUpdated: 2025-09-30T16:36:58.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/faq/
  md: https://developers.cloudflare.com/browser-rendering/faq/index.md
---

Below you will find answers to our most commonly asked questions about Browser Rendering.

For pricing questions, visit the [pricing FAQ](https://developers.cloudflare.com/browser-rendering/platform/pricing/#faq). For usage limits questions, visit the [limits FAQ](https://developers.cloudflare.com/browser-rendering/platform/limits/#faq). If you cannot find the answer you are looking for, join us on [Discord](https://discord.cloudflare.com).

***

## Getting started & Development

### Does local development support all Browser Rendering features?

Not yet. Local development currently has the following limitation(s):

* Requests larger than 1 MB are not supported.

Use real headless browser during local development

To interact with a real headless browser during local development, set `"remote" : true` in the Browser binding configuration. Learn more in our [remote bindings documentation](https://developers.cloudflare.com/workers/development-testing/#remote-bindings).

### Will Browser Rendering bypass Cloudflare's Bot Protection?

No, Browser Rendering requests are always identified as bots by Cloudflare and do not bypass Bot Protection.

If you are attempting to scan your **own zone** and need Browser Rendering to access areas protected by Cloudflare’s Bot Protection, you can create a [WAF skip rule](https://developers.cloudflare.com/waf/custom-rules/skip/) to bypass the bot protection using a header or a custom user agent.

### Does Browser Rendering rotate IP addresses for outbound requests?

No. Browser Rendering requests originate from Cloudflare's global network and you cannot configure per-request IP rotation. All rendering traffic comes from Cloudflare IP ranges and requests include [automatic headers](https://developers.cloudflare.com/browser-rendering/reference/automatic-request-headers/), such as `cf-biso-request-id` and `cf-biso-devtools` so origin servers can identify them.

### Is there a limit to how many requests a single browser session can handle?

There is no fixed limit on the number of requests per browser session. A single browser can handle multiple requests as long as it stays within available compute and memory limits.

### How can I manage concurrency and session isolation with Browser Rendering?

If you are hitting concurrency [limits](https://developers.cloudflare.com/browser-rendering/platform/limits/#workers-paid), or want to optimize concurrent browser usage with the [Workers Binding method](https://developers.cloudflare.com/browser-rendering/workers-bindings/), here are a few tips:

* Optimize with tabs or shared browsers: Instead of launching a new browser for each task, consider opening multiple tabs or running multiple actions within the same browser instance.
* [Reuse sessions](https://developers.cloudflare.com/browser-rendering/workers-bindings/reuse-sessions/): You can optimize your setup and decrease startup time by reusing sessions instead of launching a new browser every time. If you are concerned about maintaining test isolation (for example, for tests that depend on a clean environment), we recommend using [incognito browser contexts](https://pptr.dev/api/puppeteer.browser.createbrowsercontext), which isolate cookies and cache with other sessions.

If you are still running into concurrency limits you can [request a higher limit](https://forms.gle/CdueDKvb26mTaepa9).

***

## Errors & Troubleshooting

### I see `Cannot read properties of undefined (reading 'fetch')` when using Browser Rendering. How do I fix this?

This error typically occurs because your Puppeteer launch is not receiving the Browser binding. To resolve: Pass your Browser binding into `puppeteer.launch`.

### Why can't I use an XPath selector when using Browser Rendering with Puppeteer?

Currently it is not possible to use Xpath to select elements since this poses a security risk to Workers.

As an alternative, try to use a css selector or `page.evaluate`. For example:

```ts
const innerHtml = await page.evaluate(() => {
  return (
    // @ts-ignore this runs on browser context
    new XPathEvaluator()
      .createExpression("/html/body/div/h1")
      // @ts-ignore this runs on browser context
      .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue
      .innerHTML
  );
});
```

Note

Keep in mind that `page.evaluate` can only return primitive types like strings, numbers, etc. Returning an `HTMLElement` will not work.

### Why is my screenshot blurry?

It may be because you increased the height and width of the viewport. To fix this, increase the value of the `deviceScaleFactor` (default is 1).

### I see `Error processing the request: Unable to create new browser: code: 429: message: Browser time limit exceeded for today`. How do I fix it?

This error indicates you have hit the daily browser-instance limit on the Workers Free plan. [Free-plan accounts are capped at free plan limit is 10 minutes of browser use a day](https://developers.cloudflare.com/browser-rendering/platform/limits/#workers-free) once you exceed those, further creation attempts return a 429 until the next UTC day.

To resolve: [Upgrade to a Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) which allows for more than 10 minutes of usage a day and has higher [limits](https://developers.cloudflare.com/browser-rendering/platform/limits/#workers-paid). If you recently upgraded but still see this error, try redeploying your Worker to ensure your usage is correctly associated with your new plan.
