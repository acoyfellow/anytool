---
title: Developing with multiple Workers · Cloudflare Workers docs
description: Learn how to develop with multiple Workers using different
  approaches and configurations.
lastUpdated: 2025-08-21T14:49:21.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/development-testing/multi-workers/
  md: https://developers.cloudflare.com/workers/development-testing/multi-workers/index.md
---

When building complex applications, you may want to run multiple Workers during development. This guide covers the different approaches for running multiple Workers locally and when to use each approach.

## Single dev command

Note

We recommend this approach as the default for most development workflows as it ensures the best compatibility with bindings.

You can run multiple Workers in a single dev command by passing multiple configuration files to your dev server:

**Using Wrangler**

* npm

  ```sh
  npx wrangler dev -c ./app/wrangler.jsonc -c ./api/wrangler.jsonc
  ```

* yarn

  ```sh
  yarn wrangler dev -c ./app/wrangler.jsonc -c ./api/wrangler.jsonc
  ```

* pnpm

  ```sh
  pnpm wrangler dev -c ./app/wrangler.jsonc -c ./api/wrangler.jsonc
  ```

The first config (`./app/wrangler.jsonc`) is treated as the primary Worker, exposed at `http://localhost:8787`. Additional configs (e.g. `./api/wrangler.jsonc`) run as auxiliary Workers, available via service bindings or tail consumers from the primary Worker.

**Using the Vite plugin**

Configure `auxiliaryWorkers` in your Vite configuration:

```js
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";


export default defineConfig({
  plugins: [
    cloudflare({
      configPath: "./app/wrangler.jsonc",
      auxiliaryWorkers: [
        {
          configPath: "./api/wrangler.jsonc",
        },
      ],
    }),
  ],
});
```

Then run:

* npm

  ```sh
  npx vite dev
  ```

* yarn

  ```sh
  yarn vite dev
  ```

* pnpm

  ```sh
  pnpm vite dev
  ```

**Use this approach when:**

* You want the simplest setup for development
* Workers are part of the same application or codebase
* You need to access a Durable Object namespace from another Worker using `script_name`, or setup Queues where the producer and consumer Workers are seperated.

## Multiple dev commands

You can also run each Worker in a separate dev commands, each with its own terminal and configuration.

* npm

  ```sh
  # Terminal 1
  npx wrangler dev -c ./app/wrangler.jsonc
  ```

* yarn

  ```sh
  # Terminal 1
  yarn wrangler dev -c ./app/wrangler.jsonc
  ```

* pnpm

  ```sh
  # Terminal 1
  pnpm wrangler dev -c ./app/wrangler.jsonc
  ```

- npm

  ```sh
  # Terminal 2
  npx wrangler dev -c ./api/wrangler.jsonc
  ```

- yarn

  ```sh
  # Terminal 2
  yarn wrangler dev -c ./api/wrangler.jsonc
  ```

- pnpm

  ```sh
  # Terminal 2
  pnpm wrangler dev -c ./api/wrangler.jsonc
  ```

These Workers run in different dev commands but can still communicate with each other via service bindings or tail consumers **regardless of whether they are started with `wrangler dev` or `vite dev`**.

Note

You can also combine both approaches — for example, run a group of Workers together through `vite dev` using `auxiliaryWorkers`, while running another Worker separately with `wrangler dev`. This allows you to keep tightly coupled Workers running under a single dev command, while keeping independent or shared Workers in separate ones.

**Use this approach when:**

* You want each Worker to be accessible on its own local URL during development, since only the primary Worker is exposed when using a single dev command
* Each Worker has its own build setup or tooling — for example, one uses Vite with custom plugins while another is a vanilla Wrangler project
* You need the flexibility to run and develop Workers independently without restructuring your project or consolidating configs

This setup is especially useful in larger projects where each team maintains a subset of Workers. Running everything in a single dev command might require significant restructuring or build integration that isn't always practical.
