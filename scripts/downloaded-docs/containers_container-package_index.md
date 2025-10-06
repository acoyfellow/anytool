---
title: Container Package · Cloudflare Containers docs
description: >-
  When writing code that interacts with a container instance, you can either use
  a

  Durable Object directly or use the Container class

  importable from @cloudflare/containers.
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/container-package/
  md: https://developers.cloudflare.com/containers/container-package/index.md
---

When writing code that interacts with a container instance, you can either use a [Durable Object directly](https://developers.cloudflare.com/containers/platform-details/durable-object-methods) or use the [`Container` class](https://github.com/cloudflare/containers) importable from [`@cloudflare/containers`](https://www.npmjs.com/package/@cloudflare/containers).

We recommend using the `Container` class for most use cases.

* npm

  ```sh
  npm i @cloudflare/containers
  ```

* yarn

  ```sh
  yarn add @cloudflare/containers
  ```

* pnpm

  ```sh
  pnpm add @cloudflare/containers
  ```

Then, you can define a class that extends `Container`, and use it in your Worker:

```javascript
import { Container } from "@cloudflare/containers";


class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "5m";
}


export default {
  async fetch(request, env) {
    // gets default instance and forwards request from outside Worker
    return env.MY_CONTAINER.getByName("hello").fetch(request);
  },
};
```

The `Container` class extends `DurableObject` so all [Durable Object](https://developers.cloudflare.com/durable-objects) functionality is available. It also provides additional functionality and a nice interface for common container behaviors, such as:

* sleeping instances after an inactivity timeout
* making requests to specific ports
* running status hooks on startup, stop, or error
* awaiting specific ports before making requests
* setting environment variables and secrets

See the [Containers GitHub repo](https://github.com/cloudflare/containers) for more details and the complete API.
