---
title: KV namespaces · Cloudflare Workers KV docs
description: A KV namespace is a key-value database replicated to Cloudflare’s
  global network.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/kv/concepts/kv-namespaces/
  md: https://developers.cloudflare.com/kv/concepts/kv-namespaces/index.md
---

A KV namespace is a key-value database replicated to Cloudflare’s global network.

Bind your KV namespaces through Wrangler or via the Cloudflare dashboard.

Note

KV namespace IDs are public and bound to your account.

## Bind your KV namespace through Wrangler

To bind KV namespaces to your Worker, assign an array of the below object to the `kv_namespaces` key.

* `binding` string required

  * The binding name used to refer to the KV namespace.

* `id` string required

  * The ID of the KV namespace.

* `preview_id` string optional

  * The ID of the KV namespace used during `wrangler dev`.

Example:

* wrangler.jsonc

  ```jsonc
  {
    "kv_namespaces": [
      {
        "binding": "<TEST_NAMESPACE>",
        "id": "<TEST_ID>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  kv_namespaces = [
    { binding = "<TEST_NAMESPACE>", id = "<TEST_ID>" }
  ]
  ```

## Bind your KV namespace via the dashboard

To bind the namespace to your Worker in the Cloudflare dashboard:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your **Worker**.

3. Select **Settings** > **Bindings**.

4. Select **Add**.

5. Select **KV Namespace**.

6. Enter your desired variable name (the name of the binding).

7. Select the KV namespace you wish to bind the Worker to.

8. Select **Deploy**.
