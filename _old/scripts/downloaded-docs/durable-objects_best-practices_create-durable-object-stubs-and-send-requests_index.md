---
title: Invoke methods · Cloudflare Durable Objects docs
description: All new projects and existing projects with a compatibility date
  greater than or equal to 2024-04-03 should prefer to invoke Remote Procedure
  Call (RPC) methods defined on a Durable Object class.
lastUpdated: 2025-09-23T20:48:09.000Z
chatbotDeprioritize: false
tags: RPC
source_url:
  html: https://developers.cloudflare.com/durable-objects/best-practices/create-durable-object-stubs-and-send-requests/
  md: https://developers.cloudflare.com/durable-objects/best-practices/create-durable-object-stubs-and-send-requests/index.md
---

## Invoking methods on a Durable Object

All new projects and existing projects with a compatibility date greater than or equal to [`2024-04-03`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#durable-object-stubs-and-service-bindings-support-rpc) should prefer to invoke [Remote Procedure Call (RPC)](https://developers.cloudflare.com/workers/runtime-apis/rpc/) methods defined on a Durable Object class.

Projects requiring HTTP request/response flows or legacy projects can continue to invoke the `fetch()` handler on the Durable Object class.

### Invoke RPC methods

By writing a Durable Object class which inherits from the built-in type `DurableObject`, public methods on the Durable Objects class are exposed as [RPC methods](https://developers.cloudflare.com/workers/runtime-apis/rpc/), which you can call using a [DurableObjectStub](https://developers.cloudflare.com/durable-objects/api/stub) from a Worker.

All RPC calls are [asynchronous](https://developers.cloudflare.com/workers/runtime-apis/rpc/lifecycle/), accept and return [serializable types](https://developers.cloudflare.com/workers/runtime-apis/rpc/), and [propagate exceptions](https://developers.cloudflare.com/workers/runtime-apis/rpc/error-handling/) to the caller without a stack trace. Refer to [Workers RPC](https://developers.cloudflare.com/workers/runtime-apis/rpc/) for complete details.

* JavaScript

  ```js
  import { DurableObject } from "cloudflare:workers";


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx, env) {
      super(ctx, env);
    }


    async sayHello() {
      return "Hello, World!";
    }
  }


  // Worker
  export default {
    async fetch(request, env) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Methods on the Durable Object are invoked via the stub
      const rpcResponse = await stub.sayHello();


      return new Response(rpcResponse);
    },
  };
  ```

* TypeScript

  ```ts
  import { DurableObject } from "cloudflare:workers";


  export interface Env {
    MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
  }


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
    }


    async sayHello(): Promise<string> {
      return "Hello, World!";
    }
  }


  // Worker
  export default {
    async fetch(request, env) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Methods on the Durable Object are invoked via the stub
      const rpcResponse = await stub.sayHello();


      return new Response(rpcResponse);
    },
  } satisfies ExportedHandler<Env>;
  ```

Note

With RPC, the `DurableObject` superclass defines `ctx` and `env` as class properties. What was previously called `state` is now called `ctx` when you extend the `DurableObject` class. The name `ctx` is adopted rather than `state` for the `DurableObjectState` interface to be consistent between `DurableObject` and `WorkerEntrypoint` objects.

Refer to [Build a Counter](https://developers.cloudflare.com/durable-objects/examples/build-a-counter/) for a complete example.

### Invoking the `fetch` handler

If your project is stuck on a compatibility date before [`2024-04-03`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#durable-object-stubs-and-service-bindings-support-rpc), or has the need to send a [`Request`](https://developers.cloudflare.com/workers/runtime-apis/request/) object and return a `Response` object, then you should send requests to a Durable Object via the fetch handler.

* JavaScript

  ```js
  import { DurableObject } from "cloudflare:workers";


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx, env) {
      super(ctx, env);
    }


    async fetch(request) {
      return new Response("Hello, World!");
    }
  }


  // Worker
  export default {
    async fetch(request, env) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Methods on the Durable Object are invoked via the stub
      const response = await stub.fetch(request);


      return response;
    },
  };
  ```

* TypeScript

  ```ts
  import { DurableObject } from "cloudflare:workers";


  export interface Env {
    MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
  }


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
    }


    async fetch(request: Request): Promise<Response> {
      return new Response("Hello, World!");
    }
  }


  // Worker
  export default {
    async fetch(request, env) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Methods on the Durable Object are invoked via the stub
      const response = await stub.fetch(request);


      return response;
    },
  } satisfies ExportedHandler<Env>;
  ```

The `URL` associated with the [`Request`](https://developers.cloudflare.com/workers/runtime-apis/request/) object passed to the `fetch()` handler of your Durable Object must be a well-formed URL, but does not have to be a publicly-resolvable hostname.

Without RPC, customers frequently construct requests which corresponded to private methods on the Durable Object and dispatch requests from the `fetch` handler. RPC is obviously more ergonomic in this example.

* JavaScript

  ```js
  import { DurableObject } from "cloudflare:workers";


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
    }


    private hello(name) {
      return new Response(`Hello, ${name}!`);
    }


    private goodbye(name) {
      return new Response(`Goodbye, ${name}!`);
    }


    async fetch(request) {
      const url = new URL(request.url);
      let name = url.searchParams.get("name");
      if (!name) {
        name = "World";
      }


      switch (url.pathname) {
        case "/hello":
          return this.hello(name);
        case "/goodbye":
          return this.goodbye(name);
        default:
          return new Response("Bad Request", { status: 400 });
      }
    }
  }


  // Worker
  export default {
    async fetch(_request, env, _ctx) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Invoke the fetch handler on the Durable Object stub
      let response = await stub.fetch("http://do/hello?name=World");


      return response;
    },
  };
  ```

* TypeScript

  ```ts
  import { DurableObject } from "cloudflare:workers";


  export interface Env {
    MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
  }


  // Durable Object
  export class MyDurableObject extends DurableObject {
    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
    }


    private hello(name: string) {
      return new Response(`Hello, ${name}!`);
    }


    private goodbye(name: string) {
      return new Response(`Goodbye, ${name}!`);
    }


    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url);
      let name = url.searchParams.get("name");
      if (!name) {
        name = "World";
      }


      switch (url.pathname) {
        case "/hello":
          return this.hello(name);
        case "/goodbye":
          return this.goodbye(name);
        default:
          return new Response("Bad Request", { status: 400 });
      }
    }
  }


  // Worker
  export default {
    async fetch(_request, env, _ctx) {
      // A stub is a client used to invoke methods on the Durable Object
      const stub = env.MY_DURABLE_OBJECT.getByName("foo");


      // Invoke the fetch handler on the Durable Object stub
      let response = await stub.fetch("http://do/hello?name=World");


      return response;
    },
  } satisfies ExportedHandler<Env>;
  ```
