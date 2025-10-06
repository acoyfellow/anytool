---
title: Build a counter · Cloudflare Durable Objects docs
description: Build a counter using Durable Objects and Workers with RPC methods.
lastUpdated: 2025-08-21T12:34:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/examples/build-a-counter/
  md: https://developers.cloudflare.com/durable-objects/examples/build-a-counter/index.md
---

This example shows how to build a counter using Durable Objects and Workers with [RPC methods](https://developers.cloudflare.com/workers/runtime-apis/rpc) that can print, increment, and decrement a `name` provided by the URL query string parameter, for example, `?name=A`.

* JavaScript

  ```js
  import { DurableObject } from "cloudflare:workers";


  // Worker
  export default {
    async fetch(request, env) {
      let url = new URL(request.url);
      let name = url.searchParams.get("name");
      if (!name) {
        return new Response(
          "Select a Durable Object to contact by using" +
            " the `name` URL query string parameter, for example, ?name=A",
        );
      }


      // A stub is a client Object used to send messages to the Durable Object.
      let stub = env.COUNTERS.getByName(name);


      // Send a request to the Durable Object using RPC methods, then await its response.
      let count = null;
      switch (url.pathname) {
        case "/increment":
          count = await stub.increment();
          break;
        case "/decrement":
          count = await stub.decrement();
          break;
        case "/":
          // Serves the current value.
          count = await stub.getCounterValue();
          break;
        default:
          return new Response("Not found", { status: 404 });
      }


      return new Response(`Durable Object '${name}' count: ${count}`);
    },
  };


  // Durable Object
  export class Counter extends DurableObject {
    async getCounterValue() {
      let value = (await this.ctx.storage.get("value")) || 0;
      return value;
    }


    async increment(amount = 1) {
      let value = (await this.ctx.storage.get("value")) || 0;
      value += amount;
      // You do not have to worry about a concurrent request having modified the value in storage.
      // "input gates" will automatically protect against unwanted concurrency.
      // Read-modify-write is safe.
      await this.ctx.storage.put("value", value);
      return value;
    }


    async decrement(amount = 1) {
      let value = (await this.ctx.storage.get("value")) || 0;
      value -= amount;
      await this.ctx.storage.put("value", value);
      return value;
    }
  }
  ```

* TypeScript

  ```ts
  import { DurableObject } from "cloudflare:workers";


  export interface Env {
    COUNTERS: DurableObjectNamespace<Counter>;
  }


  // Worker
  export default {
    async fetch(request, env) {
      let url = new URL(request.url);
      let name = url.searchParams.get("name");
      if (!name) {
        return new Response(
          "Select a Durable Object to contact by using" +
            " the `name` URL query string parameter, for example, ?name=A",
        );
      }


      // A stub is a client Object used to send messages to the Durable Object.
      let stub = env.COUNTERS.get(name);


      let count = null;
      switch (url.pathname) {
        case "/increment":
          count = await stub.increment();
          break;
        case "/decrement":
          count = await stub.decrement();
          break;
        case "/":
          // Serves the current value.
          count = await stub.getCounterValue();
          break;
        default:
          return new Response("Not found", { status: 404 });
      }


      return new Response(`Durable Object '${name}' count: ${count}`);
    },
  } satisfies ExportedHandler<Env>;


  // Durable Object
  export class Counter extends DurableObject {
    async getCounterValue() {
      let value = (await this.ctx.storage.get("value")) || 0;
      return value;
    }


    async increment(amount = 1) {
      let value: number = (await this.ctx.storage.get("value")) || 0;
      value += amount;
      // You do not have to worry about a concurrent request having modified the value in storage.
      // "input gates" will automatically protect against unwanted concurrency.
      // Read-modify-write is safe.
      await this.ctx.storage.put("value", value);
      return value;
    }


    async decrement(amount = 1) {
      let value: number = (await this.ctx.storage.get("value")) || 0;
      value -= amount;
      await this.ctx.storage.put("value", value);
      return value;
    }
  }
  ```

Finally, configure your Wrangler file to include a Durable Object [binding](https://developers.cloudflare.com/durable-objects/get-started/#4-configure-durable-object-bindings) and [migration](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/) based on the namespace and class name chosen previously.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-counter",
    "main": "src/index.ts",
    "durable_objects": {
      "bindings": [
        {
          "name": "COUNTERS",
          "class_name": "Counter"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "Counter"
        ]
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "my-counter"
  main = "src/index.ts"


  [[durable_objects.bindings]]
  name = "COUNTERS"
  class_name = "Counter"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = ["Counter"]
  ```

### Related resources

* [Workers RPC](https://developers.cloudflare.com/workers/runtime-apis/rpc/)
* [Durable Objects: Easy, Fast, Correct — Choose three](https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/).
