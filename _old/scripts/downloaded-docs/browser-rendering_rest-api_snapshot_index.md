---
title: /snapshot - Take a webpage snapshot · Cloudflare Browser Rendering docs
description: The /snapshot endpoint captures both the HTML content and a
  screenshot of the webpage in one request. It returns the HTML as a text string
  and the screenshot as a Base64-encoded image.
lastUpdated: 2025-09-11T17:11:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/rest-api/snapshot/
  md: https://developers.cloudflare.com/browser-rendering/rest-api/snapshot/index.md
---

The `/snapshot` endpoint captures both the HTML content and a screenshot of the webpage in one request. It returns the HTML as a text string and the screenshot as a Base64-encoded image.

## Basic usage

* curl

  1. Go to `https://example.com/`.
  2. Inject custom JavaScript.
  3. Capture the rendered HTML.
  4. Take a screenshot.

  ```bash
  curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/snapshot' \
    -H 'Authorization: Bearer <apiToken>' \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "https://example.com/",
      "addScriptTag": [
        { "content": "document.body.innerHTML = \"Snapshot Page\";" }
      ]
    }'
  ```

  ```json
  {
    "success": true,
    "result": {
      "screenshot": "Base64EncodedScreenshotString",
      "content": "<html>...</html>"
    }
  }
  ```

* TypeScript SDK

  ```typescript
  import Cloudflare from "cloudflare";


  const client = new Cloudflare({
    apiToken: process.env["CLOUDFLARE_API_TOKEN"],
  });


  const snapshot = await client.browserRendering.snapshot.create({
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"],
    url: "https://example.com/",
    addScriptTag: [
          { content: "document.body.innerHTML = \"Snapshot Page\";" }
      ]
  });


  console.log(snapshot.content);
  ```

## Advanced usage

The `html` property in the JSON payload, it sets the html to `<html><body>Advanced Snapshot</body></html>` then does the following steps:

1. Disable JavaScript.
2. Sets the screenshot to `fullPage`.
3. Changes the page size `(viewport)`.
4. Waits up to `30000ms` or until the `DOMContentLoaded` event fires.
5. Returns the rendered HTML content and a base-64 encoded screenshot of the page.

```bash
curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/snapshot' \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{
    "html": "<html><body>Advanced Snapshot</body></html>",
    "setJavaScriptEnabled": false,
    "screenshotOptions": {
       "fullPage": true
    },
    "viewport": {
      "width": 1200,
      "height": 800
    },
    "gotoOptions": {
      "waitUntil": "domcontentloaded",
      "timeout": 30000
    }
  }'
```

```json
{
  "success": true,
  "result": {
    "screenshot": "AdvancedBase64Screenshot",
    "content": "<html><body>Advanced Snapshot</body></html>"
  }
}
```

### Set a custom user agent

You can change the user agent at the page level by passing `userAgent` as a top-level parameter in the JSON body. This is useful if the target website serves different content based on the user agent.

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.

Many more options exist, like setting HTTP credentials using `authenticate`, setting `cookies`, and using `gotoOptions` to control page load behaviour - check the endpoint [reference](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/snapshot/) for all available parameters.
