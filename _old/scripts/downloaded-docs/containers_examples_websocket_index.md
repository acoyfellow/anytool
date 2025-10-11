---
title: Websocket to Container · Cloudflare Containers docs
description: Forwarding a Websocket request to a Container
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/examples/websocket/
  md: https://developers.cloudflare.com/containers/examples/websocket/index.md
---

WebSocket requests are automatically forwarded to a container using the default `fetch` method on the `Container` class:

```js
import { Container, getContainer } from "@cloudflare/containers";


export class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "2m";
}


export default {
  async fetch(request, env) {
    // gets default instance and forwards websocket from outside Worker
    return getContainer(env.MY_CONTAINER).fetch(request);
  },
};
```

View a full example in the [Container class repository](https://github.com/cloudflare/containers/tree/main/examples/websocket).
