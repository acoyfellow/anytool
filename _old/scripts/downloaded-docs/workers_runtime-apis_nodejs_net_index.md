---
title: net · Cloudflare Workers docs
description: >-
  You can use node:net to create a direct connection to servers via a TCP
  sockets

  with net.Socket.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/net/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/net/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

You can use [`node:net`](https://nodejs.org/api/net.html) to create a direct connection to servers via a TCP sockets with [`net.Socket`](https://nodejs.org/api/net.html#class-netsocket).

These functions use [`connect`](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/#connect) functionality from the built-in `cloudflare:sockets` module.

* JavaScript

  ```js
  import net from "node:net";


  const exampleIP = "127.0.0.1";


  export default {
    async fetch(req) {
      const socket = new net.Socket();
      socket.connect(4000, exampleIP, function () {
        console.log("Connected");
      });


      socket.write("Hello, Server!");
      socket.end();


      return new Response("Wrote to server", { status: 200 });
    },
  };
  ```

* TypeScript

  ```ts
  import net from "node:net";


  const exampleIP = "127.0.0.1";


  export default {
    async fetch(req): Promise<Response> {
      const socket = new net.Socket();
      socket.connect(4000, exampleIP, function () {
        console.log("Connected");
      });


      socket.write("Hello, Server!");
      socket.end();


      return new Response("Wrote to server", { status: 200 });


  },
  } satisfies ExportedHandler;
  ```

Additionally, other APIs such as [`net.BlockList`](https://nodejs.org/api/net.html#class-netblocklist) and [`net.SocketAddress`](https://nodejs.org/api/net.html#class-netsocketaddress) are available.

Note that the [`net.Server`](https://nodejs.org/api/net.html#class-netserver) class is not supported by Workers.

The full `node:net` API is documented in the [Node.js documentation for `node:net`](https://nodejs.org/api/net.html).

```plaintext
```
