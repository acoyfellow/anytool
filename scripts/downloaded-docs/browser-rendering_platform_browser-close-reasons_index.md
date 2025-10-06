---
title: Browser close reasons · Cloudflare Browser Rendering docs
description: A browser session may close for a variety of reasons, occasionally
  due to connection errors or errors in the headless browser instance. As a best
  practice, wrap puppeteer.connect or puppeteer.launch in a try/catch statement.
lastUpdated: 2025-09-09T17:28:31.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/platform/browser-close-reasons/
  md: https://developers.cloudflare.com/browser-rendering/platform/browser-close-reasons/index.md
---

A browser session may close for a variety of reasons, occasionally due to connection errors or errors in the headless browser instance. As a best practice, wrap `puppeteer.connect` or `puppeteer.launch` in a [`try/catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) statement.

To find the reason that a browser closed:

1. In the Cloudflare dashboard, go to the **Browser Rendering** page.

   [Go to **Browser Rendering**](https://dash.cloudflare.com/?to=/:account/workers/browser-rendering)

2. Select the **Logs** tab.

Browser Rendering sessions are billed based on [usage](https://developers.cloudflare.com/browser-rendering/platform/pricing/). We do not charge for sessions that error due to underlying Browser Rendering infrastructure.

| Reasons a session may end |
| - |
| User opens and closes browser normally. |
| Browser is idle for 60 seconds. |
| Chromium instance crashes. |
| Error connecting with the client, server, or Worker. |
| Browser session is evicted. |
