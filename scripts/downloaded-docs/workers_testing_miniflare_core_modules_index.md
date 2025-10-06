---
title: 📚 Modules · Cloudflare Workers docs
description: "Miniflare supports both the traditional service-worker and the
  newer modules formats for writing workers. To use the modules format, enable
  it with:"
lastUpdated: 2024-12-18T20:15:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/core/modules/
  md: https://developers.cloudflare.com/workers/testing/miniflare/core/modules/index.md
---

* [Modules Reference](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/)

## Enabling Modules

Miniflare supports both the traditional `service-worker` and the newer `modules` formats for writing workers. To use the `modules` format, enable it with:

```js
const mf = new Miniflare({
  modules: true,
});
```

You can then use `modules` worker scripts like the following:

```js
export default {
  async fetch(request, env, ctx) {
    // - `request` is the incoming `Request` instance
    // - `env` contains bindings, KV namespaces, Durable Objects, etc
    // - `ctx` contains `waitUntil` and `passThroughOnException` methods
    return new Response("Hello Miniflare!");
  },
  async scheduled(controller, env, ctx) {
    // - `controller` contains `scheduledTime` and `cron` properties
    // - `env` contains bindings, KV namespaces, Durable Objects, etc
    // - `ctx` contains the `waitUntil` method
    console.log("Doing something scheduled...");
  },
};
```

String scripts via the `script` option are supported using the `modules` format, but you cannot import other modules using them. You must use a script file via the `scriptPath` option for this.

## Module Rules

Miniflare supports all module types: `ESModule`, `CommonJS`, `Text`, `Data` and `CompiledWasm`. You can specify additional module resolution rules as follows:

```js
const mf = new Miniflare({
  modulesRules: [
    { type: "ESModule", include: ["**/*.js"], fallthrough: true },
    { type: "Text", include: ["**/*.txt"] },
  ],
});
```

### Default Rules

The following rules are automatically added to the end of your modules rules list. You can override them by specifying rules matching the same `globs`:

```js
[
  { type: "ESModule", include: ["**/*.mjs"] },
  { type: "CommonJS", include: ["**/*.js", "**/*.cjs"] },
];
```
