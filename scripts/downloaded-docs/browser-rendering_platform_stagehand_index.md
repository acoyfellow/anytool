---
title: Stagehand · Cloudflare Browser Rendering docs
description: Deploy a Stagehand server that uses Browser Rendering to provide
  browser automation capabilities to your agents.
lastUpdated: 2025-09-30T17:22:00.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/platform/stagehand/
  md: https://developers.cloudflare.com/browser-rendering/platform/stagehand/index.md
---

[Stagehand](https://www.stagehand.dev/) is an open-source, AI-powered browser automation library. Stagehand lets you combine code with natural-language instructions powered by AI, eliminating the need to dictate exact steps or specify selectors. With Stagehand, your agents are more resilient to website changes and easier to maintain, helping you build more reliably and flexibly.

This guide shows you how to deploy a [Worker](https://developers.cloudflare.com/workers/) that uses Stagehand, Browser Rendering, and [Workers AI](https://developers.cloudflare.com/workers-ai/) to automate a web task.

## Use Stagehand in a Worker with Workers AI

In this example, you will use Stagehand to search for a movie on this [example movie directory](https://demo.playwright.dev/movies), extract its details (title, year, rating, duration, and genre), and return the information along with a screenshot of the webpage.

See a video of this example

![Stagehand video](https://developers.cloudflare.com/images/browser-rendering/speedystagehand.gif) Output: ![Stagehand example result](https://developers.cloudflare.com/_astro/stagehand-example.CsX-7-FC_Z1kwtEO.webp)

If instead you want to skip the steps and get started right away, select **Deploy to Cloudflare** below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/playwright/tree/main/packages/playwright-cloudflare/examples/stagehand)

After you deploy, you can interact with the Worker using this URL pattern:

```plaintext
https://<your-worker>.workers.dev
```

### 1. Set up your project

Install the necessary dependencies:

```bash
npm ci
```

### 2. Configure your Worker

Update your wrangler configuration file to include the bindings for Browser Rendering and [Workers AI](https://developers.cloudflare.com/workers-ai/):

* wrangler.jsonc

  ```jsonc
    {
      "name": "stagehand-example",
      "main": "src/index.ts",
      "compatibility_flags": ["nodejs_compat"],
      "compatibility_date": "2025-09-17",
      "observability": {
        "enabled": true
      },
      "browser": {
        "binding": "BROWSER"
      },
      "ai": {
        "binding": "AI"
      }
    }
  ```

* wrangler.toml

  ```toml
  name = "stagehand-example"
  main = "src/index.ts"
  compatibility_flags = [ "nodejs_compat" ]
  compatibility_date = "2025-09-17"


  [observability]
  enabled = true


  [browser]
  binding = "BROWSER"


  [ai]
  binding = "AI"
  ```

If you are using the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), you need to include the following [alias](https://vite.dev/config/shared-options.html#resolve-alias) in `vite.config.ts`:

```ts
export default defineConfig({
  // ...
  resolve: {
    alias: {
      'playwright': '@cloudflare/playwright',
    },
  },
});
```

If you are not using the Cloudflare Vite plugin, you need to include the following [module alias](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing) to the wrangler configuration:

```jsonc
{
  // ...
  "alias": {
    "playwright": "@cloudflare/playwright"
  }
}
```

### 3. Write the Worker code

Copy [workersAIClient.ts](https://github.com/cloudflare/playwright/blob/main/packages/playwright-cloudflare/examples/stagehand/src/worker/workersAIClient.ts) to your project.

Then, in your Worker code, import the `workersAIClient.ts` file and use it to configure a new `Stagehand` instance:

```ts
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import { endpointURLString } from "@cloudflare/playwright";
import { WorkersAIClient } from "./workersAIClient";


export default {
  async fetch(request: Request, env: Env) {
    if (new URL(request.url).pathname !== "/")
      return new Response("Not found", { status: 404 });


    const stagehand = new Stagehand({
      env: "LOCAL",
      localBrowserLaunchOptions: { cdpUrl: endpointURLString(env.BROWSER) },
      llmClient: new WorkersAIClient(env.AI),
      verbose: 1,
    });


    await stagehand.init();
    const page = stagehand.page;


    await page.goto('https://demo.playwright.dev/movies');


    // if search is a multi-step action, stagehand will return an array of actions it needs to act on
    const actions = await page.observe('Search for "Furiosa"');
    for (const action of actions)
      await page.act(action);


    await page.act('Click the search result');


    // normal playwright functions work as expected
    await page.waitForSelector('.info-wrapper .cast');


    let movieInfo = await page.extract({
      instruction: 'Extract movie information',
      schema: z.object({
        title: z.string(),
        year: z.number(),
        rating: z.number(),
        genres: z.array(z.string()),
        duration: z.number().describe("Duration in minutes"),
      }),
    });


    await stagehand.close();


    return Response.json(movieInfo);
  },
};
```

### 4. Build the project

```bash
npm run build
```

### 5. Deploy to Cloudflare Workers

After you deploy, you can interact with the Worker using this URL pattern:

```plaintext
https://<your-worker>.workers.dev
```

```bash
npm run deploy
```

## Use Cloudflare AI Gateway with Workers AI

[AI Gateway](https://developers.cloudflare.com/ai-gateway/) is a service that adds observability to your AI applications. By routing your requests through AI Gateway, you can monitor and debug your AI applications.

To use AI Gateway with a third-party model, first create a gateway in the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/ai-gateway). In this example, we've named the gateway `stagehand-example-gateway`.

```typescript
const stagehand = new Stagehand({
        env: "LOCAL",
        localBrowserLaunchOptions: { cdpUrl },
        llmClient: new WorkersAIClient(env.AI, {
          gateway: {
            id: "stagehand-example-gateway"
          }
        }),
      });
```

## Use a third-party model

If you want to use a model outside of Workers AI, you can configure Stagehand to use models from supported [third-party providers](https://docs.stagehand.dev/configuration/models#supported-providers), including OpenAI and Anthropic, by providing your own credentials.

In this example, you will configure Stagehand to use [OpenAI](https://openai.com/). You will need an OpenAI API key. Cloudflare recommends storing your API key as a [secret](https://developers.cloudflare.com/workers/configuration/secrets/).

```bash
  npx wrangler secret put OPENAI_API_KEY
```

Then, configure Stagehand with your provider, model, and API key.

```typescript
const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: { cdpUrl: endpointURLString(env.BROWSER) },
  modelName: "openai/gpt-4.1",
  modelClientOptions: {
    apiKey: env.OPENAI_API_KEY,
  },
});
```

## Use Cloudflare AI Gateway with a third-party model

[AI Gateway](https://developers.cloudflare.com/ai-gateway/) is a service that adds observability to your AI applications. By routing your requests through AI Gateway, you can monitor and debug your AI applications.

To use AI Gateway, first create a gateway in the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/ai-gateway). In this example, we are using [OpenAI with AI Gateway](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/). Make sure to add the `baseURL` as shown below, with your own Account ID and Gateway ID.

```typescript
const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: { cdpUrl: endpointURLString(env.BROWSER) },
  modelName: "openai/gpt-4.1",
  modelClientOptions: {
    baseURL: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai`,
  },
});
```

## Stagehand API

For the full list of Stagehand methods and capabilities, refer to the official [Stagehand API documentation](https://docs.stagehand.dev/first-steps/introduction).
