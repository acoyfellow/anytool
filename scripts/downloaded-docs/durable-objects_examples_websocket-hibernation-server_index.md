---
title: Build a WebSocket server with WebSocket Hibernation · Cloudflare Durable
  Objects docs
description: Build a WebSocket server using WebSocket Hibernation on Durable
  Objects and Workers.
lastUpdated: 2025-08-21T12:34:40.000Z
chatbotDeprioritize: false
tags: WebSockets
source_url:
  html: https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/
  md: https://developers.cloudflare.com/durable-objects/examples/websocket-hibernation-server/index.md
---

This example is similar to the [Build a WebSocket server](https://developers.cloudflare.com/durable-objects/examples/websocket-server/) example, but uses the WebSocket Hibernation API. The WebSocket Hibernation API should be preferred for WebSocket server applications built on Durable Objects, since it significantly decreases duration charge, and provides additional features that pair well with WebSocket applications. For more information, refer to [Use Durable Objects with WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/).

Note

WebSocket Hibernation is unavailable for outgoing WebSocket use cases. Hibernation is only supported when the Durable Object acts as a server. For use cases where outgoing WebSockets are required, refer to [Write a WebSocket client](https://developers.cloudflare.com/workers/examples/websockets/#write-a-websocket-client).

* JavaScript

  ```js
  import { DurableObject } from "cloudflare:workers";


  // Worker
  export default {
    async fetch(request, env, ctx) {
      if (request.url.endsWith("/websocket")) {
        // Expect to receive a WebSocket Upgrade request.
        // If there is one, accept the request and return a WebSocket Response.
        const upgradeHeader = request.headers.get("Upgrade");
        if (!upgradeHeader || upgradeHeader !== "websocket") {
          return new Response("Worker expected Upgrade: websocket", {
            status: 426,
          });
        }


        if (request.method !== "GET") {
          return new Response("Worker expected GET method", {
            status: 400,
          });
        }


        // Since we are hard coding the Durable Object ID by providing the constant name 'foo',
        // all requests to this Worker will be sent to the same Durable Object instance.
        let stub = env.WEBSOCKET_HIBERNATION_SERVER.getByName("foo");


        return stub.fetch(request);
      }


      return new Response(
        `Supported endpoints:
  /websocket: Expects a WebSocket upgrade request`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
          },
        },
      );
    },
  };


  // Durable Object
  export class WebSocketHibernationServer extends DurableObject {
    // Keeps track of all WebSocket connections
    // When the DO hibernates, gets reconstructed in the constructor
    sessions;


    constructor(ctx, env) {
      super(ctx, env);
      this.sessions = new Map();


      // As part of constructing the Durable Object,
      // we wake up any hibernating WebSockets and
      // place them back in the `sessions` map.


      // Get all WebSocket connections from the DO
      this.ctx.getWebSockets().forEach((ws) => {
        let attachment = ws.deserializeAttachment();
        if (attachment) {
          // If we previously attached state to our WebSocket,
          // let's add it to `sessions` map to restore the state of the connection.
          this.sessions.set(ws, { ...attachment });
        }
      });


      // Sets an application level auto response that does not wake hibernated WebSockets.
      this.ctx.setWebSocketAutoResponse(
        new WebSocketRequestResponsePair("ping", "pong"),
      );
    }


    async fetch(request) {
      // Creates two ends of a WebSocket connection.
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);


      // Calling `acceptWebSocket()` informs the runtime that this WebSocket is to begin terminating
      // request within the Durable Object. It has the effect of "accepting" the connection,
      // and allowing the WebSocket to send and receive messages.
      // Unlike `ws.accept()`, `this.ctx.acceptWebSocket(ws)` informs the Workers Runtime that the WebSocket
      // is "hibernatable", so the runtime does not need to pin this Durable Object to memory while
      // the connection is open. During periods of inactivity, the Durable Object can be evicted
      // from memory, but the WebSocket connection will remain open. If at some later point the
      // WebSocket receives a message, the runtime will recreate the Durable Object
      // (run the `constructor`) and deliver the message to the appropriate handler.
      this.ctx.acceptWebSocket(server);


      // Generate a random UUID for the session.
      const id = crypto.randomUUID();


      // Attach the session ID to the WebSocket connection and serialize it.
      // This is necessary to restore the state of the connection when the Durable Object wakes up.
      server.serializeAttachment({ id });


      // Add the WebSocket connection to the map of active sessions.
      this.sessions.set(server, { id });


      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }


    async webSocketMessage(ws, message) {
      // Get the session associated with the WebSocket connection.
      const session = this.sessions.get(ws);


      // Upon receiving a message from the client, the server replies with the same message, the session ID of the connection,
      // and the total number of connections with the "[Durable Object]: " prefix
      ws.send(
        `[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`,
      );


      // Send a message to all WebSocket connections, loop over all the connected WebSockets.
      this.sessions.forEach((attachment, connectedWs) => {
        connectedWs.send(
          `[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`,
        );
      });


      // Send a message to all WebSocket connections except the connection (ws),
      // loop over all the connected WebSockets and filter out the connection (ws).
      this.sessions.forEach((attachment, connectedWs) => {
        if (connectedWs !== ws) {
          connectedWs.send(
            `[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`,
          );
        }
      });
    }


    async webSocketClose(ws, code, reason, wasClean) {
      // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
      ws.close(code, "Durable Object is closing WebSocket");
    }
  }
  ```

* TypeScript

  ```ts
  import { DurableObject } from 'cloudflare:workers';


  // Worker
  export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
      if (request.url.endsWith('/websocket')) {
        // Expect to receive a WebSocket Upgrade request.
        // If there is one, accept the request and return a WebSocket Response.
        const upgradeHeader = request.headers.get('Upgrade');
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
          return new Response('Worker expected Upgrade: websocket', {
            status: 426,
          });
        }


        if (request.method !== 'GET') {
          return new Response('Worker expected GET method', {
            status: 400,
          });
        }


        // Since we are hard coding the Durable Object ID by providing the constant name 'foo',
        // all requests to this Worker will be sent to the same Durable Object instance.
        let stub = env.WEBSOCKET_HIBERNATION_SERVER.getByName("foo");


        return stub.fetch(request);
      }


      return new Response(
        `Supported endpoints:
  /websocket: Expects a WebSocket upgrade request`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
    },
  };


  // Durable Object
  export class WebSocketHibernationServer extends DurableObject {
    // Keeps track of all WebSocket connections
    // When the DO hibernates, gets reconstructed in the constructor
    sessions: Map<WebSocket, { [key: string]: string }>;


    constructor(ctx: DurableObjectState, env: Env) {
      super(ctx, env);
      this.sessions = new Map();


      // As part of constructing the Durable Object,
      // we wake up any hibernating WebSockets and
      // place them back in the `sessions` map.


      // Get all WebSocket connections from the DO
      this.ctx.getWebSockets().forEach((ws) => {
        let attachment = ws.deserializeAttachment();
        if (attachment) {
          // If we previously attached state to our WebSocket,
          // let's add it to `sessions` map to restore the state of the connection.
          this.sessions.set(ws, { ...attachment });
        }
      });


      // Sets an application level auto response that does not wake hibernated WebSockets.
      this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
    }


    async fetch(request: Request): Promise<Response> {
      // Creates two ends of a WebSocket connection.
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);


      // Calling `acceptWebSocket()` informs the runtime that this WebSocket is to begin terminating
      // request within the Durable Object. It has the effect of "accepting" the connection,
      // and allowing the WebSocket to send and receive messages.
      // Unlike `ws.accept()`, `this.ctx.acceptWebSocket(ws)` informs the Workers Runtime that the WebSocket
      // is "hibernatable", so the runtime does not need to pin this Durable Object to memory while
      // the connection is open. During periods of inactivity, the Durable Object can be evicted
      // from memory, but the WebSocket connection will remain open. If at some later point the
      // WebSocket receives a message, the runtime will recreate the Durable Object
      // (run the `constructor`) and deliver the message to the appropriate handler.
      this.ctx.acceptWebSocket(server);


      // Generate a random UUID for the session.
      const id = crypto.randomUUID();


      // Attach the session ID to the WebSocket connection and serialize it.
      // This is necessary to restore the state of the connection when the Durable Object wakes up.
      server.serializeAttachment({ id });


      // Add the WebSocket connection to the map of active sessions.
      this.sessions.set(server, { id });


      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }


    async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
      // Get the session associated with the WebSocket connection.
      const session = this.sessions.get(ws)!;


      // Upon receiving a message from the client, the server replies with the same message, the session ID of the connection,
      // and the total number of connections with the "[Durable Object]: " prefix
      ws.send(`[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`);


      // Send a message to all WebSocket connections, loop over all the connected WebSockets.
      this.sessions.forEach((attachment, connectedWs) => {
        connectedWs.send(`[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`);
      });


      // Send a message to all WebSocket connections except the connection (ws),
      // loop over all the connected WebSockets and filter out the connection (ws).
      this.sessions.forEach((attachment, connectedWs) => {
        if (connectedWs !== ws) {
          connectedWs.send(`[Durable Object] message: ${message}, from: ${session.id}. Total connections: ${this.sessions.size}`);
        }
      });
    }


    async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
      // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
      ws.close(code, 'Durable Object is closing WebSocket');
    }
  }
  ```

Finally, configure your Wrangler file to include a Durable Object [binding](https://developers.cloudflare.com/durable-objects/get-started/#4-configure-durable-object-bindings) and [migration](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/) based on the namespace and class name chosen previously.

* wrangler.jsonc

  ```jsonc
  {
    "name": "websocket-hibernation-server",
    "main": "src/index.ts",
    "durable_objects": {
      "bindings": [
        {
          "name": "WEBSOCKET_HIBERNATION_SERVER",
          "class_name": "WebSocketHibernationServer"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "WebSocketHibernationServer"
        ]
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "websocket-hibernation-server"
  main = "src/index.ts"


  [[durable_objects.bindings]]
  name = "WEBSOCKET_HIBERNATION_SERVER"
  class_name = "WebSocketHibernationServer"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = ["WebSocketHibernationServer"]
  ```

### Related resources

* [Durable Objects: Edge Chat Demo with Hibernation](https://github.com/cloudflare/workers-chat-demo/).
