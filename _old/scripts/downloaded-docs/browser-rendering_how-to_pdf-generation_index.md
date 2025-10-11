---
title: Generate PDFs Using HTML and CSS · Cloudflare Browser Rendering docs
description: As seen in this Workers bindings guide, Browser Rendering can be
  used to generate screenshots for any given URL. Alongside screenshots, you can
  also generate full PDF documents for a given webpage, and can also provide the
  webpage markup and style ourselves.
lastUpdated: 2025-09-30T16:36:58.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/how-to/pdf-generation/
  md: https://developers.cloudflare.com/browser-rendering/how-to/pdf-generation/index.md
---

As seen in [this Workers bindings guide](https://developers.cloudflare.com/browser-rendering/workers-bindings/screenshots/), Browser Rendering can be used to generate screenshots for any given URL. Alongside screenshots, you can also generate full PDF documents for a given webpage, and can also provide the webpage markup and style ourselves.

You can generate PDFs with Browser Rendering in two ways:

* **[REST API](https://developers.cloudflare.com/browser-rendering/rest-api/)**: Use the the [/pdf endpoint](https://developers.cloudflare.com/browser-rendering/rest-api/pdf-endpoint/). This is ideal if you don't need to customize rendering behavior.
* **[Workers Bindings](https://developers.cloudflare.com/browser-rendering/workers-bindings/)**: Use [Puppeteer](https://developers.cloudflare.com/browser-rendering/platform/puppeteer/) or [Playwright](https://developers.cloudflare.com/browser-rendering/platform/playwright/) with Workers Bindings for additional control and customization.

Choose the method that best fits your use case.

The following example shows you how to generate a PDF using [Puppeteer](https://developers.cloudflare.com/browser-rendering/platform/puppeteer/).

## Prerequisites

1. Use the `create-cloudflare` CLI to generate a new Hello World Cloudflare Worker script:

* npm

  ```sh
  npm create cloudflare@latest -- browser-worker
  ```

* yarn

  ```sh
  yarn create cloudflare browser-worker
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest browser-worker
  ```

1. Install `@cloudflare/puppeteer`, which allows you to control the Browser Rendering instance:

* npm

  ```sh
  npm i -D @cloudflare/puppeteer
  ```

* yarn

  ```sh
  yarn add -D @cloudflare/puppeteer
  ```

* pnpm

  ```sh
  pnpm add -D @cloudflare/puppeteer
  ```

1. Add your Browser Rendering binding to your new Wrangler configuration:

* wrangler.jsonc

  ```jsonc
  {
    "browser": {
      "binding": "BROWSER"
    }
  }
  ```

* wrangler.toml

  ```toml
  browser = { binding = "BROWSER" }
  ```

Use real headless browser during local development

To interact with a real headless browser during local development, set `"remote" : true` in the Browser binding configuration. Learn more in our [remote bindings documentation](https://developers.cloudflare.com/workers/development-testing/#remote-bindings).

1. Replace the contents of `src/index.ts` (or `src/index.js` for JavaScript projects) with the following skeleton script:

```ts
import puppeteer from "@cloudflare/puppeteer";


const generateDocument = (name: string) => {};


export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    let name = searchParams.get("name");


    if (!name) {
      return new Response("Please provide a name using the ?name= parameter");
    }


    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();


    // Step 1: Define HTML and CSS
    const document = generateDocument(name);


    // Step 2: Send HTML and CSS to our browser
    await page.setContent(document);


    // Step 3: Generate and return PDF


    return new Response();
  },
};
```

## 1. Define HTML and CSS

Rather than using Browser Rendering to navigate to a user-provided URL, manually generate a webpage, then provide that webpage to the Browser Rendering instance. This allows you to render any design you want.

Note

You can generate your HTML or CSS using any method you like. This example uses string interpolation, but the method is also fully compatible with web frameworks capable of rendering HTML on Workers such as React, Remix, and Vue.

For this example, we are going to take in user-provided content (via a '?name=' parameter), and have that name output in the final PDF document.

To start, fill out your `generateDocument` function with the following:

```ts
const generateDocument = (name: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      html,
      body,
      #container {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        font-family: Baskerville, Georgia, Times, serif;
        background-color: #f7f1dc;
      }
      strong {
        color: #5c594f;
        font-size: 128px;
        margin: 32px 0 48px 0;
      }
      em {
        font-size: 24px;
      }
      #container {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    </style>
  </head>


  <body>
    <div id="container">
      <em>This is to certify that</em>
      <strong>${name}</strong>
      <em>has rendered a PDF using Cloudflare Workers</em>
    </div>
  </body>
</html>
`;
};
```

This example HTML document should render a beige background imitating a certificate showing that the user-provided name has successfully rendered a PDF using Cloudflare Workers.

Note

It is usually best to avoid directly interpolating user-provided content into an image or PDF renderer in production applications. To render contents like an invoice, it would be best to validate the data input and fetch the data yourself using tools like [D1](https://developers.cloudflare.com/d1/) or [Workers KV](https://developers.cloudflare.com/kv/).

## 2. Load HTML and CSS Into Browser

Now that you have your fully styled HTML document, you can take the contents and send it to your browser instance. Create an empty page to store this document as follows:

```ts
const browser = await puppeteer.launch(env.BROWSER);
const page = await browser.newPage();
```

The [`page.setContent()`](https://github.com/cloudflare/puppeteer/blob/main/docs/api/puppeteer.page.setcontent.md) function can then be used to set the page's HTML contents from a string, so you can pass in your created document directly like so:

```ts
await page.setContent(document);
```

## 3. Generate and Return PDF

With your Browser Rendering instance now rendering your provided HTML and CSS, you can use the [`page.pdf()`](https://github.com/cloudflare/puppeteer/blob/main/docs/api/puppeteer.page.pdf.md) command to generate a PDF file and return it to the client.

```ts
let pdf = page.pdf({ printBackground: true });
```

The `page.pdf()` call supports a [number of options](https://github.com/cloudflare/puppeteer/blob/main/docs/api/puppeteer.pdfoptions.md), including setting the dimensions of the generated PDF to a specific paper size, setting specific margins, and allowing fully-transparent backgrounds. For now, you are only overriding the `printBackground` option to allow your `body` background styles to show up.

Now that you have your PDF data, return it to the client in the `Response` with an `application/pdf` content type:

```ts
return new Response(pdf, {
  headers: {
    "content-type": "application/pdf",
  },
});
```

## Conclusion

The full Worker script now looks as follows:

```ts
import puppeteer from "@cloudflare/puppeteer";


const generateDocument = (name: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
    html, body, #container {
    width: 100%;
      height: 100%;
    margin: 0;
    }
      body {
        font-family: Baskerville, Georgia, Times, serif;
        background-color: #f7f1dc;
      }
      strong {
        color: #5c594f;
    font-size: 128px;
    margin: 32px 0 48px 0;
      }
    em {
    font-size: 24px;
    }
      #container {
    flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
    text-align: center
      }
    </style>
  </head>


  <body>
    <div id="container">
    <em>This is to certify that</em>
    <strong>${name}</strong>
    <em>has rendered a PDF using Cloudflare Workers</em>
  </div>
  </body>
</html>
`;
};


export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    let name = searchParams.get("name");


    if (!name) {
      return new Response("Please provide a name using the ?name= parameter");
    }


    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();


    // Step 1: Define HTML and CSS
    const document = generateDocument(name);


    // // Step 2: Send HTML and CSS to our browser
    await page.setContent(document);


    // // Step 3: Generate and return PDF
    const pdf = await page.pdf({ printBackground: true });


    // Close browser since we no longer need it
    await browser.close();


    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
      },
    });
  },
};
```

You can run this script to test it via:

* npm

  ```sh
  npx wrangler dev
  ```

* yarn

  ```sh
  yarn wrangler dev
  ```

* pnpm

  ```sh
  pnpm wrangler dev
  ```

With your script now running, you can pass in a `?name` parameter to the local URL (such as `http://localhost:8787/?name=Harley`) and should see the following:

![A screenshot of a generated PDF, with the author's name shown in a mock certificate.](https://developers.cloudflare.com/_astro/pdf-generation.Diel53Hp_F2F5w.webp)

***

Dynamically generating PDF documents solves a number of common use-cases, from invoicing customers to archiving documents to creating dynamic certificates (as seen in the simple example here).
