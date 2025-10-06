---
title: 📦 KV · Cloudflare Workers docs
description: "Specify KV namespaces to add to your environment as follows:"
lastUpdated: 2024-12-18T20:15:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/storage/kv/
  md: https://developers.cloudflare.com/workers/testing/miniflare/storage/kv/index.md
---

* [KV Reference](https://developers.cloudflare.com/kv/api/)

## Namespaces

Specify KV namespaces to add to your environment as follows:

```js
const mf = new Miniflare({
  kvNamespaces: ["TEST_NAMESPACE1", "TEST_NAMESPACE2"],
});
```

You can now access KV namespaces in your workers:

```js
export default {
  async fetch(request, env) {
    return new Response(await env.TEST_NAMESPACE1.get("key"));
  },
};
```

Miniflare supports all KV operations and data types.

## Manipulating Outside Workers

For testing, it can be useful to put/get data from KV outside a worker. You can do this with the `getKVNamespace` method:

```js
import { Miniflare } from "miniflare";


const mf = new Miniflare({
  modules: true,
  script: `
  export default {
    async fetch(request, env, ctx) {
      const value = parseInt(await env.TEST_NAMESPACE.get("count")) + 1;
      await env.TEST_NAMESPACE.put("count", value.toString());
      return new Response(value.toString());
    },
  }
  `,
  kvNamespaces: ["TEST_NAMESPACE"],
});


const ns = await mf.getKVNamespace("TEST_NAMESPACE");
await ns.put("count", "1");


const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text()); // 2
console.log(await ns.get("count")); // 2
```
