---
title: Create a dynamic dispatch Worker · Cloudflare for Platforms docs
description: A dynamic dispatch Worker is a specialized routing Worker that
  directs incoming requests to the appropriate user Workers in your dispatch
  namespace. Instead of using Workers Routes, dispatch Workers let you
  programmatically control request routing through code.
lastUpdated: 2025-08-19T13:57:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/dynamic-dispatch/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/dynamic-dispatch/index.md
---

A [dynamic dispatch Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dynamic-dispatch-worker) is a specialized routing Worker that directs incoming requests to the appropriate user Workers in your dispatch namespace. Instead of using [Workers Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/), dispatch Workers let you programmatically control request routing through code.

![Figure 1: Workers for Platforms: Main Flow](https://developers.cloudflare.com/_astro/programmable-platforms-1.BCCEhzLr_Z2oGmWd.svg)

#### Why use a dynamic dispatch Worker?

* **Scale**: Allows you to route requests to millions of hostnames to different Workers, without defining [Workers Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/) configuration for each one

* **Custom routing logic**: Write code to determine exactly how requests should be routed. For example:

  * Store hostname-to-Worker mappings in [Workers KV](https://developers.cloudflare.com/kv/) and look them up dynamically
  * Route requests based on subdomain, path, headers, or other request properties
  * Use [custom metadata](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/custom-metadata/) attached to [custom hostnames](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/) for routing decisions

### Configure the dispatch namespace binding

To allow your dynamic dispatch Worker to dynamically route requests to Workers in a namespace, you need to configure a dispatch namespace [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/). This binding enables your dynamic dispatch Worker to call any user Worker within that namespace using `env.dispatcher.get()`.

* wrangler.jsonc

  ```jsonc
  {
    "dispatch_namespaces": [
      {
        "binding": "DISPATCHER",
        "namespace": "my-dispatch-namespace"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[dispatch_namespaces]]
  binding = "DISPATCHER"
  namespace = "my-dispatch-namespace"
  ```

Once the binding is configured, your dynamic dispatch Worker can route requests to any Worker in the namespace. Below are common routing patterns you can implement in your dispatcher.

### Routing examples

![Figure 2: Workers for Platforms: Main Flow](https://developers.cloudflare.com/_astro/programmable-platforms-2.DGAT6ZDR_ZG0FdN.svg)

#### KV-Based Routing

Store the routing mappings in [Workers KV](https://developers.cloudflare.com/kv/). This allows you to modify your routing logic without requiring you to change or redeploy the dynamic dispatch Worker.

```js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);


      // Use hostname, path, or any combination as the routing key
      const routingKey = url.hostname;


      // Lookup user Worker name from KV store
      const userWorkerName = await env.USER_ROUTING.get(routingKey);


      if (!userWorkerName) {
        return new Response('Route not configured', { status: 404 });
      }


      // Optional: Cache the KV lookup result
      const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith('Worker not found')) {
        return new Response('', { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  }
};
```

#### Subdomain-Based Routing

Route subdomains to the corresponding Worker. For example, `my-customer.example.com` will route to the Worker named `my-customer` in the dispatch namespace.

```js
export default {
  async fetch(request, env) {
    try {
      // Extract user Worker name from subdomain
      // Example: customer1.example.com -> customer1
      const url = new URL(request.url);
      const userWorkerName = url.hostname.split('.')[0];


      // Get user Worker from dispatch namespace
      const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith('Worker not found')) {
        // User Worker doesn't exist in dispatch namespace
        return new Response('', { status: 404 });
      }
      // Could be any other exception from fetch() or from the dispatched Worker
      return new Response(e.message, { status: 500 });
    }
  }
};
```

#### Path-Based routing

Route URL paths to the corresponding Worker. For example, `example.com/customer-1` will route to the Worker named `customer-1` in the dispatch namespace.

```js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(Boolean);


      if (pathParts.length === 0) {
        return new Response('Invalid path', { status: 400 });
      }


      // example.com/customer-1 -> routes to 'customer-1' worker
      const userWorkerName = pathParts[0];


      const userWorker = env.DISPATCHER.get(userWorkerName);
      return await userWorker.fetch(request);
    } catch (e) {
      if (e.message.startsWith('Worker not found')) {
        return new Response('', { status: 404 });
      }
      return new Response(e.message, { status: 500 });
    }
  }
};
```
