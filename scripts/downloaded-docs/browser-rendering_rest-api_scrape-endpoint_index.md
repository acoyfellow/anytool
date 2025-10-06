---
title: /scrape - Scrape HTML elements · Cloudflare Browser Rendering docs
description: The /scrape endpoint extracts structured data from specific
  elements on a webpage, returning details such as element dimensions and inner
  HTML.
lastUpdated: 2025-09-11T17:11:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/rest-api/scrape-endpoint/
  md: https://developers.cloudflare.com/browser-rendering/rest-api/scrape-endpoint/index.md
---

The `/scrape` endpoint extracts structured data from specific elements on a webpage, returning details such as element dimensions and inner HTML.

## Basic usage

* curl

  Go to `https://example.com` and extract metadata from all `h1` and `a` elements in the DOM.

  ```bash
  curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-rendering/scrape' \
    -H 'Authorization: Bearer <apiToken>' \
    -H 'Content-Type: application/json' \
    -d '{
    "url": "https://example.com/",
    "elements": [{
      "selector": "h1"
    },
    {
      "selector": "a"
    }]
  }'
  ```

  ```json
  {
    "success": true,
    "result": [
      {
        "results": [
          {
            "attributes": [],
            "height": 39,
            "html": "Example Domain",
            "left": 100,
            "text": "Example Domain",
            "top": 133.4375,
            "width": 600
          }
        ],
        "selector": "h1"
      },
      {
        "results": [
          {
            "attributes": [
              { "name": "href", "value": "https://www.iana.org/domains/example" }
            ],
            "height": 20,
            "html": "More information...",
            "left": 100,
            "text": "More information...",
            "top": 249.875,
            "width": 142
          }
        ],
        "selector": "a"
      }
    ]
  }
  ```

* TypeScript SDK

  ```typescript
  import Cloudflare from "cloudflare";


  const client = new Cloudflare({
    apiToken: process.env["CLOUDFLARE_API_TOKEN"],
  });


  const scrapes = await client.browserRendering.scrape.create({
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"],
    elements: [
          { selector: "h1" },
          { selector: "a" }
      ]
  });


  console.log(scrapes);
  ```

Many more options exist, like setting HTTP credentials using `authenticate`, setting `cookies`, and using `gotoOptions` to control page load behaviour - check the endpoint [reference](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/scrape/methods/create/) for all available parameters.

### Response fields

* `results` *(array of objects)* - Contains extracted data for each selector.

  * `selector` *(string)* - The CSS selector used.

  * `results` *(array of objects)* - List of extracted elements matching the selector.

    * `text` *(string)* - Inner text of the element.
    * `html` *(string)* - Inner HTML of the element.
    * `attributes` *(array of objects)* - List of extracted attributes such as `href` for links.
    * `height`, `width`, `top`, `left` *(number)* - Position and dimensions of the element.

## Advanced Usage

### Set a custom user agent

You can change the user agent at the page level by passing `userAgent` as a top-level parameter in the JSON body. This is useful if the target website serves different content based on the user agent.

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.
