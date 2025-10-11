---
title: Start from Worker · Cloudflare Workers docs
description: Workers Sites require Wrangler — make sure to use the latest version.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/configuration/sites/start-from-worker/
  md: https://developers.cloudflare.com/workers/configuration/sites/start-from-worker/index.md
---

Use Workers Static Assets Instead

You should use [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) to host full-stack applications instead of Workers Sites. It has been deprecated in Wrangler v4, and the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) does not support Workers Sites. Do not use Workers Sites for new projects.

Workers Sites require [Wrangler](https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler) — make sure to use the [latest version](https://developers.cloudflare.com/workers/wrangler/install-and-update/#update-wrangler).

If you have a pre-existing Worker project, you can use Workers Sites to serve static assets to the Worker.

## Getting started

1. Create a directory that will contain the assets in the root of your project (for example, `./public`)

2. Add configuration to your Wrangler file to point to it.

   * wrangler.jsonc

     ```jsonc
     {
       "site": {
         "bucket": "./public"
       }
     }
     ```

   * wrangler.toml

     ```toml
     [site]
     bucket = "./public" # Add the directory with your static assets!
     ```

3. Install the `@cloudflare/kv-asset-handler` package in your project:

   ```sh
   npm i -D @cloudflare/kv-asset-handler
   ```

4. Import the `getAssetFromKV()` function into your Worker entry point and use it to respond with static assets.

* Module Worker

  ```js
  import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
  import manifestJSON from "__STATIC_CONTENT_MANIFEST";
  const assetManifest = JSON.parse(manifestJSON);


  export default {
    async fetch(request, env, ctx) {
      try {
        // Add logic to decide whether to serve an asset or run your original Worker code
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          },
        );
      } catch (e) {
        let pathname = new URL(request.url).pathname;
        return new Response(`"${pathname}" not found`, {
          status: 404,
          statusText: "not found",
        });
      }
    },
  };
  ```

* Service Worker

  ```js
  import { getAssetFromKV } from "@cloudflare/kv-asset-handler";


  addEventListener("fetch", (event) => {
    event.respondWith(handleEvent(event));
  });


  async function handleEvent(event) {
    try {
      // Add logic to decide whether to serve an asset or run your original Worker code
      return await getAssetFromKV(event);
    } catch (e) {
      let pathname = new URL(event.request.url).pathname;
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: "not found",
      });
    }
  }
  ```

For more information on the configurable options of `getAssetFromKV()` refer to [kv-asset-handler docs](https://github.com/cloudflare/workers-sdk/tree/main/packages/kv-asset-handler).

1. Run `wrangler deploy` or `npx wrangler deploy` as you would normally with your Worker project. Wrangler will automatically upload the assets found in the configured directory.

   ```sh
   npx wrangler deploy
   ```
