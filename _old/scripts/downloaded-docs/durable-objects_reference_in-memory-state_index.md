---
title: In-memory state in a Durable Object · Cloudflare Durable Objects docs
description: In-memory state means that each Durable Object has one active
  instance at any particular time. All requests sent to that Durable Object are
  handled by that same instance. You can store some state in memory.
lastUpdated: 2025-09-24T13:21:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/reference/in-memory-state/
  md: https://developers.cloudflare.com/durable-objects/reference/in-memory-state/index.md
---

In-memory state means that each Durable Object has one active instance at any particular time. All requests sent to that Durable Object are handled by that same instance. You can store some state in memory.

Variables in a Durable Object will maintain state as long as your Durable Object is not evicted from memory.

A common pattern is to initialize a Durable Object from [persistent storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) and set instance variables the first time it is accessed. Since future accesses are routed to the same Durable Object, it is then possible to return any initialized values without making further calls to persistent storage.

```js
import { DurableObject } from "cloudflare:workers";


export class Counter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    // `blockConcurrencyWhile()` ensures no requests are delivered until
    // initialization completes.
    this.ctx.blockConcurrencyWhile(async () => {
      let stored = await this.ctx.storage.get("value");
      // After initialization, future reads do not need to access storage.
      this.value = stored || 0;
    });
  }


  // Handle HTTP requests from clients.
  async fetch(request) {
    // use this.value rather than storage
  }
}
```

A given instance of a Durable Object may share global memory with other instances defined in the same Worker code.

In the example above, using a global variable `value` instead of the instance variable `this.value` would be incorrect. Two different instances of `Counter` will each have their own separate memory for `this.value`, but might share memory for the global variable `value`, leading to unexpected results. Because of this, it is best to avoid global variables.

Built-in caching

The Durable Object's storage has a built-in in-memory cache of its own. If you use `get()` to retrieve a value that was read or written recently, the result will be instantly returned from cache. Instead of writing initialization code like above, you could use `get("value")` whenever you need it, and rely on the built-in cache to make this fast. Refer to the [Build a counter example](https://developers.cloudflare.com/durable-objects/examples/build-a-counter/) to learn more about this approach.

However, in applications with more complex state, explicitly storing state in your Object may be easier than making Storage API calls on every access. Depending on the configuration of your project, write your code in the way that is easiest for you.
