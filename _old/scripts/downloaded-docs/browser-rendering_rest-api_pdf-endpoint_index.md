---
title: /pdf - Render PDF · Cloudflare Browser Rendering docs
description: The /pdf endpoint instructs the browser to generate a PDF of a
  webpage or custom HTML using Cloudflare's headless browser rendering service.
lastUpdated: 2025-09-11T17:11:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/rest-api/pdf-endpoint/
  md: https://developers.cloudflare.com/browser-rendering/rest-api/pdf-endpoint/index.md
---

The `/pdf` endpoint instructs the browser to generate a PDF of a webpage or custom HTML using Cloudflare's headless browser rendering service.

## Endpoint

```txt
https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/pdf
```

## Required fields

You must provide either `url` or `html`:

* `url` (string)
* `html` (string)

## Common use cases

* Capture a PDF of a webpage
* Generate PDFs, such as invoices, licenses, reports, and certificates, directly from HTML

## Basic usage

### Convert a URL to PDF

* curl

  Navigate to `https://example.com/` and inject custom CSS and an external stylesheet. Then return the rendered page as a PDF.

  ```bash
  curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/pdf' \
    -H 'Authorization: Bearer <apiToken>' \
    -H 'Content-Type: application/json' \
    -d '{
      "url": "https://example.com/",
      "addStyleTag": [
        { "content": "body { font-family: Arial; }" }
      ]
    }' \
    --output "output.pdf"
  ```

* TypeScript SDK

  ```typescript
  import Cloudflare from "cloudflare";


  const client = new Cloudflare({
    apiToken: process.env["CLOUDFLARE_API_TOKEN"],
  });


  const pdf = await client.browserRendering.pdf.create({
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"],
    url: "https://example.com/",
      addStyleTag: [
          { content: "body { font-family: Arial; }" }
      ]
  });


  console.log(pdf);


  const content = await pdf.blob();
  console.log(content);
  ```

### Convert custom HTML to PDF

If you have raw HTML you want to generate a PDF from, use the `html` option. You can still apply custom styles using the `addStyleTag` parameter.

```bash
curl -X POST https://api.cloudflare.com/client/v4/accounts/<acccountID>/browser-rendering/pdf \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{
  "html": "<html><body>Advanced Snapshot</body></html>",
  "addStyleTag": [
      { "content": "body { font-family: Arial; }" },
      { "url": "https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" }
    ]
}' \
  --output "invoice.pdf"
```

## Advanced usage

Looking for more parameters?

Visit the [Browser Rendering PDF API reference](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/pdf/methods/create/) for all available parameters, such as setting HTTP credentials using `authenticate`, setting `cookies`, and customizing load behavior using `gotoOptions`.

### Advanced page load with custom headers and viewport

Navigate to `https://example.com`, setting additional HTTP headers and configuring the page size (viewport). The PDF generation will wait until there are no more than two network connections for at least 500 ms, or until the maximum timeout of 4500 ms is reached, before rendering.

The `goToOptions` parameter exposes most of [Puppeteer's API](https://pptr.dev/api/puppeteer.gotooptions).

```bash
curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/pdf' \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://example.com/",
    "setExtraHTTPHeaders": {
      "X-Custom-Header": "value"
    },
    "viewport": {
      "width": 1200,
      "height": 800
    },
    "gotoOptions": {
      "waitUntil": "networkidle2",
      "timeout": 45000
    }
  }' \
  --output "advanced-output.pdf"
```

### Blocking images and styles when generating a PDF

The options `rejectResourceTypes` and `rejectRequestPattern` can be used to block requests during rendering. The opposite can also be done, *only* allow certain requests using `allowResourceTypes` and `allowRequestPattern`.

```bash
curl -X POST https://api.cloudflare.com/client/v4/accounts/<acccountID>/browser-rendering/pdf \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://cloudflare.com/",
  "rejectResourceTypes": ["image"],
  "rejectRequestPattern": ["/^.*\\.(css)"]
}' \
  --output "cloudflare.pdf"
```

### Set a custom user agent

You can change the user agent at the page level by passing `userAgent` as a top-level parameter in the JSON body. This is useful if the target website serves different content based on the user agent.

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.
