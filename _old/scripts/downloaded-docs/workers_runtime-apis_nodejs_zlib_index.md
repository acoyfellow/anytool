---
title: zlib · Cloudflare Workers docs
description: >-
  The node:zlib module provides compression functionality implemented using
  Gzip, Deflate/Inflate, and Brotli.

  To access it:
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/zlib/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/zlib/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

The node:zlib module provides compression functionality implemented using Gzip, Deflate/Inflate, and Brotli. To access it:

```js
import zlib from "node:zlib";
```

The full `node:zlib` API is documented in the [Node.js documentation for `node:zlib`](https://nodejs.org/api/zlib.html).
