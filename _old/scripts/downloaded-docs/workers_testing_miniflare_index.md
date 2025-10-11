---
title: Miniflare · Cloudflare Workers docs
description: >-
  Miniflare is a simulator for developing and testing

  Cloudflare Workers. It's written in

  TypeScript, and runs your code in a sandbox implementing Workers' runtime
  APIs.
lastUpdated: 2025-04-10T20:52:52.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/
  md: https://developers.cloudflare.com/workers/testing/miniflare/index.md
---

Warning

This documentation describes the Miniflare API, which is only relevant for advanced use cases. Instead, most users should use [Wrangler](https://developers.cloudflare.com/workers/wrangler) to build, run & deploy their Workers locally

**Miniflare** is a simulator for developing and testing [**Cloudflare Workers**](https://workers.cloudflare.com/). It's written in TypeScript, and runs your code in a sandbox implementing Workers' runtime APIs.

* 🎉 **Fun:** develop Workers easily with detailed logging, file watching and pretty error pages supporting source maps.
* 🔋 **Full-featured:** supports most Workers features, including KV, Durable Objects, WebSockets, modules and more.
* ⚡ **Fully-local:** test and develop Workers without an Internet connection. Reload code on change quickly.

[Get Started](https://developers.cloudflare.com/workers/testing/miniflare/get-started)

[GitHub](https://github.com/cloudflare/workers-sdk/tree/main/packages/miniflare)

[NPM](https://npmjs.com/package/miniflare)

***

These docs primarily cover Miniflare specific things. For more information on runtime APIs, refer to the [Cloudflare Workers docs](https://developers.cloudflare.com/workers).

If you find something that doesn't behave as it does in the production Workers environment (and this difference isn't documented), or something's wrong in these docs, please [open a GitHub issue](https://github.com/cloudflare/workers-sdk/issues/new/choose).

* [Get Started](https://developers.cloudflare.com/workers/testing/miniflare/get-started/)
* [Writing tests ](https://developers.cloudflare.com/workers/testing/miniflare/writing-tests/): Write integration tests against Workers using Miniflare.
* [Core](https://developers.cloudflare.com/workers/testing/miniflare/core/)
* [Developing](https://developers.cloudflare.com/workers/testing/miniflare/developing/)
* [Migrations ](https://developers.cloudflare.com/workers/testing/miniflare/migrations/): Review migration guides for specific versions of Miniflare.
* [Storage](https://developers.cloudflare.com/workers/testing/miniflare/storage/)
