---
title: AsyncLocalStorage · Cloudflare Workers docs
description: Cloudflare Workers provides an implementation of a subset of the
  Node.js AsyncLocalStorage API for creating in-memory stores that remain
  coherent through asynchronous operations.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/index.md
---

## Background

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

Cloudflare Workers provides an implementation of a subset of the Node.js [`AsyncLocalStorage`](https://nodejs.org/dist/latest-v18.x/docs/api/async_context.html#class-asynclocalstorage) API for creating in-memory stores that remain coherent through asynchronous operations.

## Constructor

```js
import { AsyncLocalStorage } from "node:async_hooks";


const asyncLocalStorage = new AsyncLocalStorage();
```

* `new AsyncLocalStorage()` : AsyncLocalStorage
  * Returns a new `AsyncLocalStorage` instance.

## Methods

* `getStore()` : any

  * Returns the current store. If called outside of an asynchronous context initialized by calling `asyncLocalStorage.run()`, it returns `undefined`.

* `run(storeany, callbackfunction, ...argsarguments)` : any

  * Runs a function synchronously within a context and returns its return value. The store is not accessible outside of the callback function. The store is accessible to any asynchronous operations created within the callback. The optional `args` are passed to the callback function. If the callback function throws an error, the error is thrown by `run()` also.

* `exit(callbackfunction, ...argsarguments)` : any

  * Runs a function synchronously outside of a context and returns its return value. This method is equivalent to calling `run()` with the `store` value set to `undefined`.

## Static Methods

* `AsyncLocalStorage.bind(fn)` : function

  * Captures the asynchronous context that is current when `bind()` is called and returns a function that enters that context before calling the passed in function.

* `AsyncLocalStorage.snapshot()` : function

  * Captures the asynchronous context that is current when `snapshot()` is called and returns a function that enters that context before calling a given function.

## Examples

### Fetch Listener

```js
import { AsyncLocalStorage } from 'node:async_hooks';


const asyncLocalStorage = new AsyncLocalStorage();
let idSeq = 0;


export default {
  async fetch(req) {
    return asyncLocalStorage.run(idSeq++, () => {
      // Simulate some async activity...
      await scheduler.wait(1000);
      return new Response(asyncLocalStorage.getStore());
    });
  }
};
```

### Multiple stores

The API supports multiple `AsyncLocalStorage` instances to be used concurrently.

```js
import { AsyncLocalStorage } from 'node:async_hooks';


const als1 = new AsyncLocalStorage();
const als2 = new AsyncLocalStorage();


export default {
  async fetch(req) {
    return als1.run(123, () => {
      return als2.run(321, () => {
        // Simulate some async activity...
        await scheduler.wait(1000);
        return new Response(`${als1.getStore()}-${als2.getStore()}`);
      });
    });
  }
};
```

### Unhandled Rejections

When a `Promise` rejects and the rejection is unhandled, the async context propagates to the `'unhandledrejection'` event handler:

```js
import { AsyncLocalStorage } from "node:async_hooks";


const asyncLocalStorage = new AsyncLocalStorage();
let idSeq = 0;


addEventListener("unhandledrejection", (event) => {
  console.log(asyncLocalStorage.getStore(), "unhandled rejection!");
});


export default {
  async fetch(req) {
    return asyncLocalStorage.run(idSeq++, () => {
      // Cause an unhandled rejection!
      throw new Error("boom");
    });
  },
};
```

### `AsyncLocalStorage.bind()` and `AsyncLocalStorage.snapshot()`

```js
import { AsyncLocalStorage } from "node:async_hooks";


const als = new AsyncLocalStorage();


function foo() {
  console.log(als.getStore());
}
function bar() {
  console.log(als.getStore());
}


const oneFoo = als.run(123, () => AsyncLocalStorage.bind(foo));
oneFoo(); // prints 123


const snapshot = als.run("abc", () => AsyncLocalStorage.snapshot());
snapshot(foo); // prints 'abc'
snapshot(bar); // prints 'abc'
```

```js
import { AsyncLocalStorage } from "node:async_hooks";


const als = new AsyncLocalStorage();


class MyResource {
  #runInAsyncScope = AsyncLocalStorage.snapshot();


  doSomething() {
    this.#runInAsyncScope(() => {
      return als.getStore();
    });
  }
}


const myResource = als.run(123, () => new MyResource());
console.log(myResource.doSomething()); // prints 123
```

## `AsyncResource`

The [`AsyncResource`](https://nodejs.org/dist/latest-v18.x/docs/api/async_context.html#class-asyncresource) class is a component of Node.js' async context tracking API that allows users to create their own async contexts. Objects that extend from `AsyncResource` are capable of propagating the async context in much the same way as promises.

Note that `AsyncLocalStorage.snapshot()` and `AsyncLocalStorage.bind()` provide a better approach. `AsyncResource` is provided solely for backwards compatibility with Node.js.

### Constructor

```js
import { AsyncResource, AsyncLocalStorage } from "node:async_hooks";


const als = new AsyncLocalStorage();


class MyResource extends AsyncResource {
  constructor() {
    // The type string is required by Node.js but unused in Workers.
    super("MyResource");
  }


  doSomething() {
    this.runInAsyncScope(() => {
      return als.getStore();
    });
  }
}


const myResource = als.run(123, () => new MyResource());
console.log(myResource.doSomething()); // prints 123
```

* `new AsyncResource(typestring, optionsAsyncResourceOptions)` : AsyncResource

  * Returns a new `AsyncResource`. Importantly, while the constructor arguments are required in Node.js' implementation of `AsyncResource`, they are not used in Workers.

* `AsyncResource.bind(fnfunction, typestring, thisArgany)`
  * Binds the given function to the current async context.

### Methods

* `asyncResource.bind(fnfunction, thisArgany)`
  * Binds the given function to the async context associated with this `AsyncResource`.
* `asyncResource.runInAsyncScope(fnfunction, thisArgany, ...argsarguments)`
  * Call the provided function with the given arguments in the async context associated with this `AsyncResource`.

## Caveats

* The `AsyncLocalStorage` implementation provided by Workers intentionally omits support for the [`asyncLocalStorage.enterWith()`](https://nodejs.org/dist/latest-v18.x/docs/api/async_context.html#asynclocalstorageenterwithstore) and [`asyncLocalStorage.disable()`](https://nodejs.org/dist/latest-v18.x/docs/api/async_context.html#asynclocalstoragedisable) methods.

* Workers does not implement the full [`async_hooks`](https://nodejs.org/dist/latest-v18.x/docs/api/async_hooks.html) API upon which Node.js' implementation of `AsyncLocalStorage` is built.

* Workers does not implement the ability to create an `AsyncResource` with an explicitly identified trigger context as allowed by Node.js. This means that a new `AsyncResource` will always be bound to the async context in which it was created.

* Thenables (non-Promise objects that expose a `then()` method) are not fully supported when using `AsyncLocalStorage`. When working with thenables, instead use [`AsyncLocalStorage.snapshot()`](https://nodejs.org/api/async_context.html#static-method-asynclocalstoragesnapshot) to capture a snapshot of the current context.
