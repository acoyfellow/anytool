---
title: Durable Object in-memory state · Cloudflare Durable Objects docs
description: Create a Durable Object that stores the last location it was
  accessed from in-memory.
lastUpdated: 2025-09-24T13:21:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/examples/durable-object-in-memory-state/
  md: https://developers.cloudflare.com/durable-objects/examples/durable-object-in-memory-state/index.md
---

This example shows you how Durable Objects are stateful, meaning in-memory state can be retained between requests. After a brief period of inactivity, the Durable Object will be evicted, and all in-memory state will be lost. The next request will reconstruct the object, but instead of showing the city of the previous request, it will display a message indicating that the object has been reinitialized. If you need your applications state to survive eviction, write the state to storage by using the [Storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/), or by storing your data elsewhere.

```js
import { DurableObject } from "cloudflare:workers";


// Worker
export default {
  async fetch(request, env) {
    return await handleRequest(request, env);
  },
};


async function handleRequest(request, env) {
  let stub = env.LOCATION.getByName("A");
  // Forward the request to the remote Durable Object.
  let resp = await stub.fetch(request);
  // Return the response to the client.
  return new Response(await resp.text());
}


// Durable Object
export class Location extends DurableObject {
  constructor(state, env) {
    super(state, env);
    // Upon construction, you do not have a location to provide.
    // This value will be updated as people access the Durable Object.
    // When the Durable Object is evicted from memory, this will be reset.
    this.location = null;
  }


  // Handle HTTP requests from clients.
  async fetch(request) {
    let response = null;


    if (this.location == null) {
      response = new String(`
This is the first request, you called the constructor, so this.location was null.
You will set this.location to be your city: (${request.cf.city}). Try reloading the page.`);
    } else {
      response = new String(`
The Durable Object was already loaded and running because it recently handled a request.


Previous Location: ${this.location}
New Location: ${request.cf.city}`);
    }


    // You set the new location to be the new city.
    this.location = request.cf.city;
    console.log(response);
    return new Response(response);
  }
}
```

Finally, configure your Wrangler file to include a Durable Object [binding](https://developers.cloudflare.com/durable-objects/get-started/#4-configure-durable-object-bindings) and [migration](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/) based on the namespace and class name chosen previously.

* wrangler.jsonc

  ```jsonc
  {
    "name": "durable-object-in-memory-state",
    "main": "src/index.ts",
    "durable_objects": {
      "bindings": [
        {
          "name": "LOCATION",
          "class_name": "Location"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "Location"
        ]
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "durable-object-in-memory-state"
  main = "src/index.ts"


  [[durable_objects.bindings]]
  name = "LOCATION"
  class_name = "Location"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = ["Location"]
  ```
