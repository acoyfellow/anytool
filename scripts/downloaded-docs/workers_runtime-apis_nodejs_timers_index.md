---
title: timers · Cloudflare Workers docs
description: Use node:timers APIs to schedule functions to be executed later.
lastUpdated: 2025-09-05T13:56:13.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/timers/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/timers/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

Use [`node:timers`](https://nodejs.org/api/timers.html) APIs to schedule functions to be executed later.

This includes [`setTimeout`](https://nodejs.org/api/timers.html#settimeoutcallback-delay-args) for calling a function after a delay, [`setInterval`](https://nodejs.org/api/timers.html#clearintervaltimeout) for calling a function repeatedly, and [`setImmediate`](https://nodejs.org/api/timers.html#setimmediatecallback-args) for calling a function in the next iteration of the event loop.

* JavaScript

  ```js
  import timers from "node:timers";


  export default {
    async fetch() {
      console.log("first");
      const { promise: promise1, resolve: resolve1 } = Promise.withResolvers();
      const { promise: promise2, resolve: resolve2 } = Promise.withResolvers();
      timers.setTimeout(() => {
        console.log("last");
        resolve1();
      }, 10);


      timers.setTimeout(() => {
        console.log("next");
        resolve2();
      });


      await Promise.all([promise1, promise2]);


      return new Response("ok");
    },
  };
  ```

* TypeScript

  ```ts
  import timers from "node:timers";


  export default {
    async fetch(): Promise<Response> {
      console.log("first");
      const { promise: promise1, resolve: resolve1 } = Promise.withResolvers<void>();
      const { promise: promise2, resolve: resolve2 } = Promise.withResolvers<void>();
      timers.setTimeout(() => {
        console.log("last");
        resolve1();
      }, 10);


      timers.setTimeout(() => {
        console.log("next");
        resolve2();
      });


      await Promise.all([promise1, promise2]);


      return new Response("ok");
    }
  } satisfies ExportedHandler<Env>;
  ```

Note

Due to [security-based restrictions on timers](https://developers.cloudflare.com/workers/reference/security-model/#step-1-disallow-timers-and-multi-threading) in Workers, timers are limited to returning the time of the last I/O. This means that while setTimeout, setInterval, and setImmediate will defer your function execution until after other events have run, they will not delay them for the full time specified.

Note

When called from a global level (on [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)), functions such as `clearTimeout` and `setTimeout` will respect web standards rather than Node.js-specific functionality. For complete Node.js compatibility, you must call functions from the `node:timers` module.

The full `node:timers` API is documented in the [Node.js documentation for `node:timers`](https://nodejs.org/api/timers.html).
