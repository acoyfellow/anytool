---
title: Local development · Cloudflare for Platforms docs
description: Test changes to your dynamic dispatch Worker by running the dynamic
  dispatch Worker locally but connecting it to User Workers deployed in
  production.
lastUpdated: 2025-07-17T21:59:33.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/developing-with-wrangler/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/developing-with-wrangler/index.md
---

Test changes to your [dynamic dispatch Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dynamic-dispatch-worker) by running the dynamic dispatch Worker locally but connecting it to User Workers deployed in production.

This is helpful when:

* **Testing routing changes** and validating that updates continue to work with deployed User Workers
* **Adding new middleware** like authentication, rate limiting, or logging to the dynamic dispatch Worker
* **Debugging issues** in the dynamic dispatcher that may be impacting deployed User Workers

### How to use remote dispatch namespaces

In the dynamic dispatch Worker's Wrangler file, configure the [dispatch namespace binding](https://developers.cloudflare.com/workers/wrangler/configuration/#dispatch-namespace-bindings-workers-for-platforms) to connect to the remote namespace by setting [`experimental_remote = true`](https://developers.cloudflare.com/workers/development-testing/#remote-bindings):

* wrangler.jsonc

  ```jsonc
  {
    "dispatch_namespaces": [
      {
        "binding": "DISPATCH_NAMESPACE",
        "namespace": "production",
        "experimental_remote": true
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[dispatch_namespaces]]
  binding = "DISPATCH_NAMESPACE"
  namespace = "production"
  experimental_remote = true
  ```

This tells your dispatch Worker that's running locally to connect to the remote `production` namespace. When you run `wrangler dev`, your Dispatch Worker will route requests to the User Workers deployed in that namespace.

For more information about remote bindings during local development, refer to [remote bindings documentation](https://developers.cloudflare.com/workers/development-testing/#remote-bindings).
