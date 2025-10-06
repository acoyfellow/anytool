---
title: Setting Cron Triggers · Cloudflare Workers docs
description: Set a Cron Trigger for your Worker.
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
tags: Middleware,JavaScript,TypeScript
source_url:
  html: https://developers.cloudflare.com/workers/examples/cron-trigger/
  md: https://developers.cloudflare.com/workers/examples/cron-trigger/index.md
---

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/cron-trigger)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

* JavaScript

  ```js
  export default {
    async scheduled(controller, env, ctx) {
      console.log("cron processed");
    },
  };
  ```

* TypeScript

  ```ts
  interface Env {}
  export default {
    async scheduled(
      controller: ScheduledController,
      env: Env,
      ctx: ExecutionContext,
    ) {
      console.log("cron processed");
    },
  };
  ```

* Python

  ```python
  from workers import handler


  @handler
  async def on_scheduled(controller, env, ctx):
    print("cron processed")
  ```

* Hono

  ```ts
  import { Hono } from 'hono';


  interface Env {}


  // Create Hono app
  const app = new Hono<{ Bindings: Env }>();


  // Regular routes for normal HTTP requests
  app.get('/', (c) => c.text('Hello World!'));


  // Export both the app and a scheduled function
  export default {
    // The Hono app handles regular HTTP requests
    fetch: app.fetch,


    // The scheduled function handles Cron triggers
    async scheduled(
      controller: ScheduledController,
      env: Env,
      ctx: ExecutionContext,
    ) {
      console.log("cron processed");


      // You could also perform actions like:
      // - Fetching data from external APIs
      // - Updating KV or Durable Object storage
      // - Running maintenance tasks
      // - Sending notifications
    },
  };
  ```

## Set Cron Triggers in Wrangler

Refer to [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) for more information on how to add a Cron Trigger.

If you are deploying with Wrangler, set the cron syntax (once per hour as shown below) by adding this to your Wrangler file:

* wrangler.jsonc

  ```jsonc
  {
    "name": "worker",
    "triggers": {
      "crons": [
        "0 * * * *"
      ]
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "worker"


  # ...


  [triggers]
  crons = ["0 * * * *"]
  ```

You also can set a different Cron Trigger for each [environment](https://developers.cloudflare.com/workers/wrangler/environments/) in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). You need to put the `[triggers]` table under your chosen environment. For example:

* wrangler.jsonc

  ```jsonc
  {
    "env": {
      "dev": {
        "triggers": {
          "crons": [
            "0 * * * *"
          ]
        }
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  [env.dev.triggers]
  crons = ["0 * * * *"]
  ```

## Test Cron Triggers using Wrangler

The recommended way of testing Cron Triggers is using Wrangler.

Cron Triggers can be tested using Wrangler by passing in the `--test-scheduled` flag to [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev). This will expose a `/__scheduled` (or `/cdn-cgi/handler/scheduled` for Python Workers) route which can be used to test using a HTTP request. To simulate different cron patterns, a `cron` query parameter can be passed in.

```sh
npx wrangler dev --test-scheduled


curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"


curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*" # Python Workers
```
