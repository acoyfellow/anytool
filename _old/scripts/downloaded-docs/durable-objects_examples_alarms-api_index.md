---
title: Use the Alarms API · Cloudflare Durable Objects docs
description: Use the Durable Objects Alarms API to batch requests to a Durable Object.
lastUpdated: 2025-09-16T13:44:50.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/examples/alarms-api/
  md: https://developers.cloudflare.com/durable-objects/examples/alarms-api/index.md
---

This example implements an `alarm()` handler that allows batching of requests to a single Durable Object.

When a request is received and no alarm is set, it sets an alarm for 10 seconds in the future. The `alarm()` handler processes all requests received within that 10-second window.

If no new requests are received, no further alarms will be set until the next request arrives.

```js
import { DurableObject } from "cloudflare:workers";


// Worker
export default {
  async fetch(request, env) {
    return await env.BATCHER.getByName("foo").fetch(request);
  },
};


const SECONDS = 10;


// Durable Object
export class Batcher extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.storage = ctx.storage;
    this.ctx.blockConcurrencyWhile(async () => {
      let vals = await this.storage.list({ reverse: true, limit: 1 });
      this.count = vals.size == 0 ? 0 : parseInt(vals.keys().next().value);
    });
  }


  async fetch(request) {
    this.count++;


    // If there is no alarm currently set, set one for 10 seconds from now
    // Any further POSTs in the next 10 seconds will be part of this batch.
    let currentAlarm = await this.storage.getAlarm();
    if (currentAlarm == null) {
      this.storage.setAlarm(Date.now() + 1000 * SECONDS);
    }


    // Add the request to the batch.
    await this.storage.put(this.count, await request.text());
    return new Response(JSON.stringify({ queued: this.count }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }


  async alarm() {
    let vals = await this.storage.list();
    await fetch("http://example.com/some-upstream-service", {
      method: "POST",
      body: Array.from(vals.values()),
    });
    await this.storage.deleteAll();
    this.count = 0;
  }
}
```

The `alarm()` handler will be called once every 10 seconds. If an unexpected error terminates the Durable Object, the `alarm()` handler will be re-instantiated on another machine. Following a short delay, the `alarm()` handler will run from the beginning on the other machine.

Finally, configure your Wrangler file to include a Durable Object [binding](https://developers.cloudflare.com/durable-objects/get-started/#4-configure-durable-object-bindings) and [migration](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/) based on the namespace and class name chosen previously.

* wrangler.jsonc

  ```jsonc
  {
    "name": "durable-object-alarm",
    "main": "src/index.ts",
    "durable_objects": {
      "bindings": [
        {
          "name": "BATCHER",
          "class_name": "Batcher"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "Batcher"
        ]
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "durable-object-alarm"
  main = "src/index.ts"


  [[durable_objects.bindings]]
  name = "BATCHER"
  class_name = "Batcher"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = ["Batcher"]
  ```
