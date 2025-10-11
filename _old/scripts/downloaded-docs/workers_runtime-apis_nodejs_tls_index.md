---
title: tls · Cloudflare Workers docs
description: |-
  You can use node:tls to create secure connections to
  external services using TLS (Transport Layer Security).
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/tls/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

You can use [`node:tls`](https://nodejs.org/api/tls.html) to create secure connections to external services using [TLS](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security) (Transport Layer Security).

```js
import { connect } from "node:tls";


// ... in a request handler ...
const connectionOptions = { key: env.KEY, cert: env.CERT };
const socket = connect(url, connectionOptions, () => {
  if (socket.authorized) {
    console.log("Connection authorized");
  }
});


socket.on("data", (data) => {
  console.log(data);
});


socket.on("end", () => {
  console.log("server ends connection");
});
```

The following APIs are available:

* [`connect`](https://nodejs.org/api/tls.html#tlsconnectoptions-callback)
* [`TLSSocket`](https://nodejs.org/api/tls.html#class-tlstlssocket)
* [`checkServerIdentity`](https://nodejs.org/api/tls.html#tlscheckserveridentityhostname-cert)
* [`createSecureContext`](https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions)

All other APIs, including [`tls.Server`](https://nodejs.org/api/tls.html#class-tlsserver) and [`tls.createServer`](https://nodejs.org/api/tls.html#tlscreateserveroptions-secureconnectionlistener), are not supported and will throw a `Not implemented` error when called.

The full `node:tls` API is documented in the [Node.js documentation for `node:tls`](https://nodejs.org/api/tls.html).
