---
title: Playwright · Cloudflare Browser Rendering docs
description: Learn how to use Playwright with Cloudflare Workers for browser
  automation. Access Playwright API, manage sessions, and optimize browser
  rendering.
lastUpdated: 2025-09-30T17:37:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/platform/playwright/
  md: https://developers.cloudflare.com/browser-rendering/platform/playwright/index.md
---

[Playwright](https://playwright.dev/) is an open-source package developed by Microsoft that can do browser automation tasks; it is commonly used to write frontend tests, create screenshots, or crawl pages.

The Workers team forked a [version of Playwright](https://github.com/cloudflare/playwright) that was modified to be compatible with [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Browser Rendering](https://developers.cloudflare.com/browser-rendering/).

Our version is open sourced and can be found in [Cloudflare's fork of Playwright](https://github.com/cloudflare/playwright). The npm package can be installed from [npmjs](https://www.npmjs.com/) as [@cloudflare/playwright](https://www.npmjs.com/package/@cloudflare/playwright):

* npm

  ```sh
  npm i -D @cloudflare/playwright
  ```

* yarn

  ```sh
  yarn add -D @cloudflare/playwright
  ```

* pnpm

  ```sh
  pnpm add -D @cloudflare/playwright
  ```

Note

The current version of the Playwright is [**v1.55.0**](https://github.com/cloudflare/playwright/pull/67).

## Use Playwright in a Worker

In this [example](https://github.com/cloudflare/playwright/tree/main/packages/playwright-cloudflare/examples/todomvc), you will run Playwright tests in a Cloudflare Worker using the [todomvc](https://demo.playwright.dev/todomvc) application.

If you want to skip the steps and get started quickly, select **Deploy to Cloudflare** below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/playwright/tree/main/packages/playwright-cloudflare/examples/todomvc)

Make sure you have the [browser binding](https://developers.cloudflare.com/browser-rendering/platform/wrangler/#bindings) configured in your `wrangler.toml` file:

Note

To use the latest version of `@cloudflare/playwright`, your Worker configuration must include the `nodejs_compat` compatibility flag and a `compatibility_date` of 2025-09-15 or later. This change is necessary because the library's functionality requires the native `node.fs` API.

* wrangler.jsonc

  ```jsonc
  {
    "name": "cloudflare-playwright-example",
    "main": "src/index.ts",
    "workers_dev": true,
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "compatibility_date": "2025-09-17",
    "upload_source_maps": true,
    "browser": {
      "binding": "MYBROWSER"
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "cloudflare-playwright-example"
  main = "src/index.ts"
  workers_dev = true
  compatibility_flags = ["nodejs_compat"]
  compatibility_date = "2025-09-17"
  upload_source_maps = true


  [browser]
  binding = "MYBROWSER"
  ```

Install the npm package:

* npm

  ```sh
  npm i -D @cloudflare/playwright
  ```

* yarn

  ```sh
  yarn add -D @cloudflare/playwright
  ```

* pnpm

  ```sh
  pnpm add -D @cloudflare/playwright
  ```

Let's look at some examples of how to use Playwright:

### Take a screenshot

Using browser automation to take screenshots of web pages is a common use case. This script tells the browser to navigate to <https://demo.playwright.dev/todomvc>, create some items, take a screenshot of the page, and return the image in the response.

```ts
import { launch } from "@cloudflare/playwright";


export default {
  async fetch(request: Request, env: Env) {
    const browser = await launch(env.MYBROWSER);
    const page = await browser.newPage();


    await page.goto("https://demo.playwright.dev/todomvc");


    const TODO_ITEMS = [
      "buy some cheese",
      "feed the cat",
      "book a doctors appointment",
    ];


    const newTodo = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }


    const img = await page.screenshot();
    await browser.close();


    return new Response(img, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  },
};
```

### Trace

A Playwright trace is a detailed log of your workflow execution that captures information like user clicks and navigation actions, screenshots of the page, and any console messages generated and used for debugging. Developers can take a `trace.zip` file and either open it [locally](https://playwright.dev/docs/trace-viewer#opening-the-trace) or upload it to the [Playwright Trace Viewer](https://trace.playwright.dev/), a GUI tool that helps you explore the data.

Here's an example of a worker generating a trace file:

```ts
import fs from "fs";
import { launch } from "@cloudflare/playwright";


export default {
  async fetch(request: Request, env: Env) {
    const browser = await launch(env.MYBROWSER);
    const page = await browser.newPage();


    // Start tracing before navigating to the page
    await page.context().tracing.start({ screenshots: true, snapshots: true });


    await page.goto("https://demo.playwright.dev/todomvc");


    const TODO_ITEMS = [
      "buy some cheese",
      "feed the cat",
      "book a doctors appointment",
    ];


    const newTodo = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }


    // Stop tracing and save the trace to a zip file
    await page.context().tracing.stop({ path: "trace.zip" });
    await browser.close();
    const file = await fs.promises.readFile("trace.zip");


    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
      },
    });
  },
};
```

### Assertions

One of the most common use cases for using Playwright is software testing. Playwright includes test assertion features in its APIs; refer to [Assertions](https://playwright.dev/docs/test-assertions) in the Playwright documentation for details. Here's an example of a Worker doing `expect()` test assertions of the [todomvc](https://demo.playwright.dev/todomvc) demo page:

```ts
import { launch } from "@cloudflare/playwright";
import { expect } from "@cloudflare/playwright/test";


export default {
  async fetch(request: Request, env: Env) {
    const browser = await launch(env.MYBROWSER);
    const page = await browser.newPage();


    await page.goto("https://demo.playwright.dev/todomvc");


    const TODO_ITEMS = [
      "buy some cheese",
      "feed the cat",
      "book a doctors appointment",
    ];


    const newTodo = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }


    await expect(page.getByTestId("todo-title")).toHaveCount(TODO_ITEMS.length);


    await Promise.all(
      TODO_ITEMS.map((value, index) =>
        expect(page.getByTestId("todo-title").nth(index)).toHaveText(value),
      ),
    );
  },
};
```

### Storage state

Playwright supports [storage state](https://playwright.dev/docs/api/class-browsercontext#browsercontext-storage-state) to obtain and persist cookies and other storage data. In this example, you will use storage state to persist cookies and other storage data in [Workers KV](https://developers.cloudflare.com/kv).

First, ensure you have a KV namespace. You can create a new one with:

```bash
npx wrangler kv namespace create KV
```

Then, add the KV namespace to your `wrangler.toml` file:

* wrangler.jsonc

  ```jsonc
  {
    "name": "storage-state-examples",
    "main": "src/index.ts",
    "compatibility_flags": ["nodejs_compat"],
    "compatibility_date": "2025-09-17",
    "browser": {
      "binding": "MYBROWSER"
    },
    "kv_namespaces": [
      {
        "binding": "KV",
        "id": "<YOUR-KV-NAMESPACE-ID>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "storage-state-examples"
  main = "src/index.ts"
  compatibility_flags = [ "nodejs_compat" ]
  compatibility_date = "2025-09-17"


  [browser]
  binding = "MYBROWSER"


  [[kv_namespaces]]
  binding = "KV"
  id = "<YOUR-KV-NAMESPACE-ID>"
  ```

Now, you can use the storage state to persist cookies and other storage data in KV:

```ts
// gets persisted storage state from KV or undefined if it does not exist
const storageStateJson = await env.KV.get('storageState');
const storageState = storageStateJson ? await JSON.parse(storageStateJson) as BrowserContextOptions['storageState'] : undefined;


await using browser = await launch(env.MYBROWSER);
// creates a new context with storage state persisted in KV
await using context = await browser.newContext({ storageState });


await using page = await context.newPage();


// do some actions on the page that may update client-side storage


// gets updated storage state: cookies, localStorage, and IndexedDB
const updatedStorageState = await context.storageState({ indexedDB: true });


// persists updated storage state in KV
await env.KV.put('storageState', JSON.stringify(updatedStorageState));
```

### Keep Alive

If users omit the `browser.close()` statement, the browser instance will stay open, ready to be connected to again and [re-used](https://developers.cloudflare.com/browser-rendering/workers-bindings/reuse-sessions/) but it will, by default, close automatically after 1 minute of inactivity. Users can optionally extend this idle time up to 10 minutes, by using the `keep_alive` option, set in milliseconds:

```js
const browser = await playwright.launch(env.MYBROWSER, { keep_alive: 600000 });
```

Using the above, the browser will stay open for up to 10 minutes, even if inactive.

### Session Reuse

The best way to improve the performance of your browser rendering Worker is to reuse sessions by keeping the browser open after you've finished with it, and connecting to that session each time you have a new request. Playwright handles [`browser.close`](https://playwright.dev/docs/api/class-browser#browser-close) differently from Puppeteer. In Playwright, if the browser was obtained using a `connect` session, the session will disconnect. If the browser was obtained using a `launch` session, the session will close.

```js
import { env } from "cloudflare:workers";
import { acquire, connect } from "@cloudflare/playwright";


async function reuseSameSession() {
  // acquires a new session
  const { sessionId } = await acquire(env.BROWSER);


  for (let i = 0; i < 5; i++) {
    // connects to the session that was previously acquired
    const browser = await connect(env.BROWSER, sessionId);


    // ...


    // this will disconnect the browser from the session, but the session will be kept alive
    await browser.close();
  }
}
```

### Set a custom user agent

To specify a custom user agent in Playwright, set it in the options when creating a new browser context with `browser.newContext()`. All pages subsequently created from this context will use the new user agent. This is useful if the target website serves different content based on the user agent.

```js
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
});
```

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.

## Session management

In order to facilitate browser session management, we have extended the Playwright API with new methods:

### List open sessions

`playwright.sessions()` lists the current running sessions. It will return an output similar to this:

```json
[
  {
    "connectionId": "2a2246fa-e234-4dc1-8433-87e6cee80145",
    "connectionStartTime": 1711621704607,
    "sessionId": "478f4d7d-e943-40f6-a414-837d3736a1dc",
    "startTime": 1711621703708
  },
  {
    "sessionId": "565e05fb-4d2a-402b-869b-5b65b1381db7",
    "startTime": 1711621703808
  }
]
```

Notice that the session `478f4d7d-e943-40f6-a414-837d3736a1dc` has an active worker connection (`connectionId=2a2246fa-e234-4dc1-8433-87e6cee80145`), while session `565e05fb-4d2a-402b-869b-5b65b1381db7` is free. While a connection is active, no other workers may connect to that session.

### List recent sessions

`playwright.history()` lists recent sessions, both open and closed. It is useful to get a sense of your current usage.

```json
[
  {
    "closeReason": 2,
    "closeReasonText": "BrowserIdle",
    "endTime": 1711621769485,
    "sessionId": "478f4d7d-e943-40f6-a414-837d3736a1dc",
    "startTime": 1711621703708
  },
  {
    "closeReason": 1,
    "closeReasonText": "NormalClosure",
    "endTime": 1711123501771,
    "sessionId": "2be00a21-9fb6-4bb2-9861-8cd48e40e771",
    "startTime": 1711123430918
  }
]
```

Session `2be00a21-9fb6-4bb2-9861-8cd48e40e771` was closed explicitly with `browser.close()` by the client, while session `478f4d7d-e943-40f6-a414-837d3736a1dc` was closed due to reaching the maximum idle time (check [limits](https://developers.cloudflare.com/browser-rendering/platform/limits/)).

You should also be able to access this information in the dashboard, albeit with a slight delay.

### Active limits

`playwright.limits()` lists your active limits:

```json
{
  "activeSessions": [
    { "id": "478f4d7d-e943-40f6-a414-837d3736a1dc" },
    { "id": "565e05fb-4d2a-402b-869b-5b65b1381db7" }
  ],
  "allowedBrowserAcquisitions": 1,
  "maxConcurrentSessions": 2,
  "timeUntilNextAllowedBrowserAcquisition": 0
}
```

* `activeSessions` lists the IDs of the current open sessions
* `maxConcurrentSessions` defines how many browsers can be open at the same time
* `allowedBrowserAcquisitions` specifies if a new browser session can be opened according to the rate [limits](https://developers.cloudflare.com/browser-rendering/platform/limits/) in place
* `timeUntilNextAllowedBrowserAcquisition` defines the waiting period before a new browser can be launched.

## Playwright API

The full Playwright API can be found at the [Playwright API documentation](https://playwright.dev/docs/api/class-playwright).

The following capabilities are not yet fully supported, but we’re actively working on them:

* [Playwright Test](https://playwright.dev/docs/test-configuration) except [Assertions](https://playwright.dev/docs/test-assertions)
* [Components](https://playwright.dev/docs/test-components)
* [Firefox](https://playwright.dev/docs/api/class-playwright#playwright-firefox), [Android](https://playwright.dev/docs/api/class-android) and [Electron](https://playwright.dev/docs/api/class-electron), as well as different versions of Chrome
* [Videos](https://playwright.dev/docs/next/videos)

This is **not an exhaustive list** — expect rapid changes as we work toward broader parity with the original feature set. You can also check [latest test results](https://playwright-full-test-report.pages.dev/) for a granular up to date list of the features that are fully supported.
