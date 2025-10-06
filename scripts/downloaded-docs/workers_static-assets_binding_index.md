---
title: Configuration and Bindings · Cloudflare Workers docs
description: Details on how to configure Workers static assets and its binding.
lastUpdated: 2025-09-23T20:48:09.000Z
chatbotDeprioritize: false
tags: Bindings
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/binding/
  md: https://developers.cloudflare.com/workers/static-assets/binding/index.md
---

Configuring a Worker with assets requires specifying a [directory](https://developers.cloudflare.com/workers/static-assets/binding/#directory) and, optionally, an [assets binding](https://developers.cloudflare.com/workers/static-assets/binding/), in your Worker's Wrangler file. The [assets binding](https://developers.cloudflare.com/workers/static-assets/binding/) allows you to dynamically fetch assets from within your Worker script (e.g. `env.ASSETS.fetch()`), similarly to how you might with a make a `fetch()` call with a [Service binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/http/).

Only one collection of static assets can be configured in each Worker.

## `directory`

The folder of static assets to be served. For many frameworks, this is the `./public/`, `./dist/`, or `./build/` folder.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "compatibility_date": "2024-09-19",
    "assets": {
      "directory": "./public/"
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"
  compatibility_date = "2024-09-19"
  assets = { directory = "./public/" }
  ```

### Ignoring assets

Sometime there are files in the asset directory that should not be uploaded.

In this case, create a `.assetsignore` file in the root of the assets directory. This file takes the same format as `.gitignore`.

Wrangler will not upload asset files that match lines in this file.

**Example**

You are migrating from a Pages project where the assets directory is `dist`. You do not want to upload the server-side Worker code nor Pages configuration files as public client-side assets. Add the following `.assetsignore` file:

```txt
_worker.js
_redirects
_headers
```

Now Wrangler will not upload these files as client-side assets when deploying the Worker.

## `run_worker_first`

Controls whether to invoke the Worker script regardless of a request which would have otherwise matched an asset. `run_worker_first = false` (default) will serve any static asset matching a request, while `run_worker_first = true` will unconditionally [invoke your Worker script](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/#run-your-worker-script-first).

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "compatibility_date": "2024-09-19",
    "main": "src/index.ts",
    "assets": {
      "directory": "./public/",
      "binding": "ASSETS",
      "run_worker_first": true
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"
  compatibility_date = "2024-09-19"
  main = "src/index.ts"
   # The following configuration unconditionally invokes the Worker script at
   # `src/index.ts`, which can programatically fetch assets via the ASSETS binding
  [assets]
  directory = "./public/"
  binding = "ASSETS"
  run_worker_first = true
  ```

You can also specify `run_worker_first` as an array of route patterns to selectively run the Worker script first only for specific routes.

The array supports glob patterns with `*` for deep matching and negative patterns with `!` prefix.

Negative patterns have precedence over non-negative patterns. The Worker will run first when a non-negative pattern matches and none of the negative pattern matches.

The order in which the patterns are listed is not significant.

`run_worker_first` is often paired with the [`not_found_handling = "single-page-application"` setting](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/#advanced-routing-control):

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-spa-worker",
    "compatibility_date": "2025-10-03",
    "main": "./src/index.ts",
    "assets": {
      "directory": "./dist/",
      "not_found_handling": "single-page-application",
      "binding": "ASSETS",
      "run_worker_first": ["/api/*", "!/api/docs/*"]
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-spa-worker"
  compatibility_date = "2025-10-03"
  main = "./src/index.ts"


  [assets]
  directory = "./dist/"
  not_found_handling = "single-page-application"
  binding = "ASSETS"
  run_worker_first = [ "/api/*", "!/api/docs/*" ]
  ```

In this configuration, requests to `/api/*` routes will invoke the Worker script first, except for `/api/docs/*` which will follow the default asset-first routing behavior.

## `binding`

Configuring the optional [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings) gives you access to the collection of assets from within your Worker script.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "main": "./src/index.js",
    "compatibility_date": "2024-09-19",
    "assets": {
      "directory": "./public/",
      "binding": "ASSETS"
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"
  main = "./src/index.js"
  compatibility_date = "2024-09-19"


  [assets]
  directory = "./public/"
  binding = "ASSETS"
  ```

In the example above, assets would be available through `env.ASSETS`.

### Runtime API Reference

#### `fetch()`

**Parameters**

* `request: Request | URL | string` Pass a [Request object](https://developers.cloudflare.com/workers/runtime-apis/request/), URL object, or URL string. Requests made through this method have `html_handling` and `not_found_handling` configuration applied to them.

**Response**

* `Promise<Response>` Returns a static asset response for the given request.

**Example**

Your dynamic code can make new, or forward incoming requests to your project's static assets using the assets binding. For example, `env.ASSETS.fetch(request)`, `env.ASSETS.fetch(new URL('https://assets.local/my-file'))` or `env.ASSETS.fetch('https://assets.local/my-file')`.

Take the following example that configures a Worker script to return a response under all requests headed for `/api/`. Otherwise, the Worker script will pass the incoming request through to the asset binding. In this case, because a Worker script is only invoked when the requested route has not matched any static assets, this will always evaluate [`not_found_handling`](https://developers.cloudflare.com/workers/static-assets/#routing-behavior) behavior.

* JavaScript

  ```js
  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/")) {
        // TODO: Add your custom /api/* logic here.
        return new Response("Ok");
      }
      // Passes the incoming request through to the assets binding.
      // No asset matched this request, so this will evaluate `not_found_handling` behavior.
      return env.ASSETS.fetch(request);
    },
  };
  ```

* TypeScript

  ```ts
  interface Env {
    ASSETS: Fetcher;
  }


  export default {
    async fetch(request, env): Promise<Response> {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/")) {
        // TODO: Add your custom /api/* logic here.
        return new Response("Ok");
      }
      // Passes the incoming request through to the assets binding.
      // No asset matched this request, so this will evaluate `not_found_handling` behavior.
      return env.ASSETS.fetch(request);
    },
  } satisfies ExportedHandler<Env>;
  ```

## Routing configuration

For the various static asset routing configuration options, refer to [Routing](https://developers.cloudflare.com/workers/static-assets/routing/).

## Smart Placement

[Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement/) can be used to place a Worker's code close to your back-end infrastructure. Smart Placement will only have an effect if you specified a `main`, pointing to your Worker code.

### Smart Placement with Worker Code First

If you desire to run your [Worker code ahead of assets](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/#run-your-worker-script-first) by setting `run_worker_first=true`, all requests must first travel to your Smart-Placed Worker. As a result, you may experience increased latency for asset requests.

Use Smart Placement with `run_worker_first=true` when you need to integrate with other backend services, authenticate requests before serving any assets, or if your want to make modifications to your assets before serving them.

If you want some assets served as quickly as possible to the user, but others to be served behind a smart-placed Worker, considering splitting your app into multiple Workers and [using service bindings to connect them](https://developers.cloudflare.com/workers/configuration/smart-placement/#best-practices).

### Smart Placement with Assets First

Enabling Smart Placement with `run_worker_first=false` (or not specifying it) lets you serve assets from as close as possible to your users, but moves your Worker logic to run most efficiently (such as near a database).

Use Smart Placement with `run_worker_first=false` (or not specifying it) when prioritizing fast asset delivery.

This will not impact the [default routing behavior](https://developers.cloudflare.com/workers/static-assets/#routing-behavior).
