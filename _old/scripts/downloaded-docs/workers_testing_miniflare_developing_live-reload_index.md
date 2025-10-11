---
title: ⚡️ Live Reload · Cloudflare Workers docs
description: |-
  Miniflare automatically refreshes your browser when your Worker script
  changes when liveReload is set to true.
lastUpdated: 2024-12-18T20:15:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/developing/live-reload/
  md: https://developers.cloudflare.com/workers/testing/miniflare/developing/live-reload/index.md
---

Miniflare automatically refreshes your browser when your Worker script changes when `liveReload` is set to `true`.

```js
const mf = new Miniflare({
  liveReload: true,
});
```

Miniflare will only inject the `<script>` tag required for live-reload at the end of responses with the `Content-Type` header set to `text/html`:

```js
export default {
  fetch() {
    const body = `
      <!DOCTYPE html>
      <html>
      <body>
        <p>Try update me!</p>
      </body>
      </html>
    `;


    return new Response(body, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
```
