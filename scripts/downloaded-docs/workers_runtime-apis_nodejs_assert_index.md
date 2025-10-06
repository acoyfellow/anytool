---
title: assert · Cloudflare Workers docs
description: The node:assert module in Node.js provides a number of useful
  assertions that are useful when building tests.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/assert/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/assert/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

The [`node:assert`](https://nodejs.org/docs/latest/api/assert.html) module in Node.js provides a number of useful assertions that are useful when building tests.

```js
import { strictEqual, deepStrictEqual, ok, doesNotReject } from "node:assert";


strictEqual(1, 1); // ok!
strictEqual(1, "1"); // fails! throws AssertionError


deepStrictEqual({ a: { b: 1 } }, { a: { b: 1 } }); // ok!
deepStrictEqual({ a: { b: 1 } }, { a: { b: 2 } }); // fails! throws AssertionError


ok(true); // ok!
ok(false); // fails! throws AssertionError


await doesNotReject(async () => {}); // ok!
await doesNotReject(async () => {
  throw new Error("boom");
}); // fails! throws AssertionError
```

Note

In the Workers implementation of `assert`, all assertions run in, what Node.js calls, the strict assertion mode. In strict assertion mode, non-strict methods behave like their corresponding strict methods. For example, `deepEqual()` will behave like `deepStrictEqual()`.

Refer to the [Node.js documentation for `assert`](https://nodejs.org/dist/latest-v19.x/docs/api/assert.html) for more information.
