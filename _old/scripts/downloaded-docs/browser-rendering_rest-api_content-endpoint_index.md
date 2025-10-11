---
title: /content - Fetch HTML · Cloudflare Browser Rendering docs
description: The /content endpoint instructs the browser to navigate to a
  website and capture the fully rendered HTML of a page, including the head
  section, after JavaScript execution. This is ideal for capturing content from
  JavaScript-heavy or interactive websites.
lastUpdated: 2025-09-11T17:11:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/rest-api/content-endpoint/
  md: https://developers.cloudflare.com/browser-rendering/rest-api/content-endpoint/index.md
---

The `/content` endpoint instructs the browser to navigate to a website and capture the fully rendered HTML of a page, including the `head` section, after JavaScript execution. This is ideal for capturing content from JavaScript-heavy or interactive websites.

## Basic usage

* curl

  Go to `https://developers.cloudflare.com/` and return the rendered HTML.

  ```bash
  curl -X 'POST' 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/content' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer <apiToken>' \
    -d '{"url": "https://developers.cloudflare.com/"}'
  ```

* TypeScript SDK

  ```typescript
  import Cloudflare from "cloudflare";


  const client = new Cloudflare({
    apiToken: process.env["CLOUDFLARE_API_TOKEN"],
  });


  const content = await client.browserRendering.content.create({
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"],
    url: "https://developers.cloudflare.com/",
  });


  console.log(content);
  ```

## Advanced usage

Navigate to `https://cloudflare.com/` but block images and stylesheets from loading. Undesired requests can be blocked by resource type (`rejectResourceTypes`) or by using a regex pattern (`rejectRequestPattern`). The opposite can also be done, only allow requests that match `allowRequestPattern` or `allowResourceTypes`.

```bash
curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/content' \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{
      "url": "https://cloudflare.com/",
      "rejectResourceTypes": ["image"],
      "rejectRequestPattern": ["/^.*\\.(css)"]
    }'
```

Many more options exist, like setting HTTP headers using `setExtraHTTPHeaders`, setting `cookies`, and using `gotoOptions` to control page load behaviour - check the endpoint [reference](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/content/methods/create/) for all available parameters.

### Set a custom user agent

You can change the user agent at the page level by passing `userAgent` as a top-level parameter in the JSON body. This is useful if the target website serves different content based on the user agent.

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.
