---
title: Supported fonts · Cloudflare Browser Rendering docs
description: Browser Rendering uses a managed Chromium environment that includes
  a standard set of fonts. When you generate a screenshot or PDF, text is
  rendered using the fonts available in this environment.
lastUpdated: 2025-10-01T22:10:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/reference/supported-fonts/
  md: https://developers.cloudflare.com/browser-rendering/reference/supported-fonts/index.md
---

Browser Rendering uses a managed Chromium environment that includes a standard set of fonts. When you generate a screenshot or PDF, text is rendered using the fonts available in this environment.

If your webpage specifies a font that is not supported yet, Chromium will automatically fall back to a similar supported font. If you would like to use a font that is not currently supported, you can [add a custom font](https://developers.cloudflare.com/browser-rendering/reference/supported-fonts/#use-your-own-custom-font).

## Pre-installed fonts

The following sections list the fonts available in the Browser Rendering environment.

### Generic CSS font family support

The following generic CSS font families are supported:

* `serif`
* `sans-serif`
* `monospace`
* `cursive`
* `fantasy`

### Common system fonts

* Andale Mono
* Arial
* Arial Black
* Comic Sans MS
* Courier
* Courier New
* Georgia
* Helvetica
* Impact
* Lucida Handwriting
* Times
* Times New Roman
* Trebuchet MS
* Verdana
* Webdings

### Open source and extended fonts

* Bitstream Vera (Serif, Sans, Mono)
* Cyberbit
* DejaVu (Serif, Sans, Mono)
* FreeFont (FreeSerif, FreeSans, FreeMono)
* GFS Neohellenic
* Liberation (Serif, Sans, Mono)
* Open Sans
* Roboto

### International fonts

Browser Rendering includes additional font packages for non-Latin scripts and emoji:

* IPAfont Gothic (Japanese)
* Indic fonts (Devanagari, Bengali, Tamil, and others)
* KACST fonts (Arabic)
* Noto CJK (Chinese, Japanese, Korean)
* Noto Color Emoji
* TLWG Thai fonts
* WenQuanYi Zen Hei (Chinese)

## Use your own custom font

If a required font is not pre-installed, you can inject it into the page at render time using `addStyleTag`. This allows you to load fonts from an external URL or embed them directly as a Base64 string.

* JavaScript

  Example with puppeteer and a CDN source:

  ```js
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.addStyleTag({
    content: `
      @font-face {
        font-family: 'CustomFont';
        src: url('https://your-cdn.com/fonts/MyFont.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
      }


      body {
        font-family: 'CustomFont', sans-serif;
      }
    `
  });
  ```

* TypeScript

  Example with puppeteer and a CDN source:

  ```ts
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.addStyleTag({
    content: `
      @font-face {
        font-family: 'CustomFont';
        src: url('https://your-cdn.com/fonts/MyFont.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
      }


      body {
        font-family: 'CustomFont', sans-serif;
      }
    `
  });
  ```

- JavaScript

  Example with playwright and a Base64 encoded data source:

  ```js
  const browser = await playwright.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.addStyleTag({
    content: `
      @font-face {
        font-family: 'CustomFont';
        src: url('data:font/woff2;base64,<BASE64_STRING>') format('woff2');
        font-weight: normal;
        font-style: normal;
      }


      body {
        font-family: 'CustomFont', sans-serif;
      }
    `
  });
  ```

- TypeScript

  Example with playwright and a Base64 encoded data source:

  ```ts
  const browser = await puppeteer.launch(env.MYBROWSER);
  const page = await browser.newPage();
  await page.addStyleTag({
    content: `
      @font-face {
        font-family: 'CustomFont';
        src: url('data:font/woff2;base64,<BASE64_STRING>') format('woff2');
        font-weight: normal;
        font-style: normal;
      }


      body {
        font-family: 'CustomFont', sans-serif;
      }
    `
  });
  ```
