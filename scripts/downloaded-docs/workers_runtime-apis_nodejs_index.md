---
title: Node.js compatibility · Cloudflare Workers docs
description: Node.js APIs available in Cloudflare Workers
lastUpdated: 2025-09-15T18:31:29.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/index.md
---

When you write a Worker, you may need to import packages from [npm](https://www.npmjs.com/). Many npm packages rely on APIs from the [Node.js runtime](https://nodejs.org/en/about), and will not work unless these Node.js APIs are available.

Cloudflare Workers provides a subset of Node.js APIs in two forms:

1. As built-in APIs provided by the Workers Runtime
2. As polyfill shim implementations that [Wrangler](https://developers.cloudflare.com/workers/wrangler/) adds to your Worker's code, allowing it to import the module, but calling API methods will throw errors.

## Get Started

To enable built-in Node.js APIs and add polyfills, add the `nodejs_compat` compatibility flag to your [wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), and ensure that your Worker's [compatibility date](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

* wrangler.jsonc

  ```jsonc
  {
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "compatibility_date": "2024-09-23"
  }
  ```

* wrangler.toml

  ```toml
  compatibility_flags = [ "nodejs_compat" ]
  compatibility_date = "2024-09-23"
  ```

## Supported Node.js APIs

The runtime APIs from Node.js listed below as "🟢 supported" are currently natively supported in the Workers Runtime.

[Deprecated or experimental APIs from Node.js](https://nodejs.org/docs/latest/api/documentation.html#stability-index), and APIs that do not fit in a serverless context, are not included as part of the list below:

| API Name | Natively supported by the Workers Runtime |
| - | - |
| [Assertion testing](https://developers.cloudflare.com/workers/runtime-apis/nodejs/assert/) | 🟢 supported |
| [Asynchronous context tracking](https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/) | 🟢 supported |
| [Buffer](https://developers.cloudflare.com/workers/runtime-apis/nodejs/buffer/) | 🟢 supported |
| Console | 🟢 supported |
| [Crypto](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/) | 🟢 supported |
| [Debugger](https://developers.cloudflare.com/workers/observability/dev-tools/) | 🟢 supported via [Chrome Dev Tools integration](https://developers.cloudflare.com/workers/observability/dev-tools/) |
| [Diagnostics Channel](https://developers.cloudflare.com/workers/runtime-apis/nodejs/diagnostics-channel/) | 🟢 supported |
| [DNS](https://developers.cloudflare.com/workers/runtime-apis/nodejs/dns/) | 🟢 supported |
| Errors | 🟢 supported |
| Events | 🟢 supported |
| File system | ⚪ coming soon |
| Globals | 🟢 supported |
| [HTTP](https://developers.cloudflare.com/workers/runtime-apis/nodejs/http/) | 🟢 supported |
| HTTP/2 | ⚪ not yet supported |
| [HTTPS](https://developers.cloudflare.com/workers/runtime-apis/nodejs/https/) | 🟢 supported |
| Inspector | 🟢 supported via [Chrome Dev Tools integration](https://developers.cloudflare.com/workers/observability/dev-tools/) |
| [Net](https://developers.cloudflare.com/workers/runtime-apis/nodejs/net/) | 🟢 supported |
| OS | ⚪ not yet supported |
| [Path](https://developers.cloudflare.com/workers/runtime-apis/nodejs/path/) | 🟢 supported |
| Performance hooks | 🟡 partially supported |
| [Process](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/) | 🟢 supported |
| Query strings | 🟢 supported |
| [Stream](https://developers.cloudflare.com/workers/runtime-apis/nodejs/streams/) | 🟢 supported |
| [String decoder](https://developers.cloudflare.com/workers/runtime-apis/nodejs/string-decoder/) | 🟢 supported |
| [Timers](https://developers.cloudflare.com/workers/runtime-apis/nodejs/timers/) | 🟢 supported |
| [TLS/SSL](https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/) | 🟡 partially supported |
| UDP/datagram | ⚪ not yet supported |
| [URL](https://developers.cloudflare.com/workers/runtime-apis/nodejs/url/) | 🟢 supported |
| [Utilities](https://developers.cloudflare.com/workers/runtime-apis/nodejs/util/) | 🟢 supported |
| Web Crypto API | 🟢 supported |
| Web Streams API | 🟢 supported |
| [Zlib](https://developers.cloudflare.com/workers/runtime-apis/nodejs/zlib/) | 🟢 supported |

Unless otherwise specified, native implementations of Node.js APIs in Workers are intended to match the implementation in the [Current release of Node.js](https://github.com/nodejs/release#release-schedule).

If an API you wish to use is missing and you want to suggest that Workers support it, please add a post or comment in the [Node.js APIs discussions category](https://github.com/cloudflare/workerd/discussions/categories/node-js-apis) on GitHub.

### Node.js API Polyfills

Node.js APIs that are not yet supported in the Workers runtime are polyfilled via [Wrangler](https://developers.cloudflare.com/workers/wrangler/), which uses [unenv](https://github.com/unjs/unenv). If the `nodejs_compat` [compatibility flag](https://developers.cloudflare.com/workers/configuration/compatibility-flags/) is enabled, and your Worker's [compatibility date](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) is 2024-09-23 or later, Wrangler will automatically inject polyfills into your Worker's code.

Adding polyfills maximizes compatibility with existing npm packages by providing modules with mocked methods. Calling these mocked methods will either noop or will throw an error with a message like:

```plaintext
[unenv] <method name> is not implemented yet!
```

This allows you to import packages that use these Node.js modules, even if certain methods are not supported.

## Enable only AsyncLocalStorage

If you need to enable only the Node.js `AsyncLocalStorage` API, you can enable the `nodejs_als` compatibility flag:

* wrangler.jsonc

  ```jsonc
  {
    "compatibility_flags": [
      "nodejs_als"
    ]
  }
  ```

* wrangler.toml

  ```toml
  compatibility_flags = [ "nodejs_als" ]
  ```
