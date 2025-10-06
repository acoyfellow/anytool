---
title: External Services · Cloudflare Workers docs
description: Many external services provide libraries and SDKs to interact with
  their APIs. While many Node-compatible libraries work on Workers right out of
  the box, some, which implement fs, http/net, or access the browser window do
  not directly translate to the Workers runtime, which is v8-based.
lastUpdated: 2024-08-20T21:10:02.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/configuration/integrations/external-services/
  md: https://developers.cloudflare.com/workers/configuration/integrations/external-services/index.md
---

Many external services provide libraries and SDKs to interact with their APIs. While many Node-compatible libraries work on Workers right out of the box, some, which implement `fs`, `http/net`, or access the browser `window` do not directly translate to the Workers runtime, which is v8-based.

## Authentication

If your service requires authentication, use Wrangler secrets to securely store your credentials. To do this, create a secret in your Cloudflare Workers project using the following [`wrangler secret`](https://developers.cloudflare.com/workers/wrangler/commands/#secret) command:

```sh
wrangler secret put SECRET_NAME
```

Then, retrieve the secret value in your code using the following code snippet:

```js
const secretValue = env.SECRET_NAME;
```

Then use the secret value to authenticate with the external service. For example, if the external service requires an API key for authentication, include the secret in your library's configuration.

For services that require mTLS authentication, use [mTLS certificates](https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls) to present a client certificate.

Use [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) when communicating with external APIs, which treat your Worker as your core application.
