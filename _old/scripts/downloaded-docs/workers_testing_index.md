---
title: Testing · Cloudflare Workers docs
description: The Workers platform has a variety of ways to test your
  applications, depending on your requirements. We recommend using the
  Vitest integration, which allows you to run tests inside the Workers runtime,
  and unit test individual functions within your Worker.
lastUpdated: 2025-08-16T18:06:50.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/
  md: https://developers.cloudflare.com/workers/testing/index.md
---

The Workers platform has a variety of ways to test your applications, depending on your requirements. We recommend using the [Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration), which allows you to run tests *inside* the Workers runtime, and unit test individual functions within your Worker.

[Get started with Vitest](https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/)

## Testing comparison matrix

However, if you don't use Vitest, both [Miniflare's API](https://developers.cloudflare.com/workers/testing/miniflare/writing-tests) and the [`unstable_startWorker()`](https://developers.cloudflare.com/workers/wrangler/api/#unstable_startworker) API provide options for testing your Worker in any testing framework.

| Feature | [Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration) | [`unstable_startWorker()`](https://developers.cloudflare.com/workers/testing/unstable_startworker/) | [Miniflare's API](https://developers.cloudflare.com/workers/testing/miniflare/writing-tests/) |
| - | - | - | - |
| Unit testing | ✅ | ❌ | ❌ |
| Integration testing | ✅ | ✅ | ✅ |
| Loading Wrangler configuration files | ✅ | ✅ | ❌ |
| Use bindings directly in tests | ✅ | ❌ | ✅ |
| Isolated per-test storage | ✅ | ❌ | ❌ |
| Outbound request mocking | ✅ | ❌ | ✅ |
| Multiple Worker support | ✅ | ✅ | ✅ |
| Direct access to Durable Objects | ✅ | ❌ | ❌ |
| Run Durable Object alarms immediately | ✅ | ❌ | ❌ |
| List Durable Objects | ✅ | ❌ | ❌ |
| Testing service Workers | ❌ | ✅ | ✅ |

Pages Functions

The content described on this page is also applicable to [Pages Functions](https://developers.cloudflare.com/pages/functions/). Pages Functions are Cloudflare Workers and can be thought of synonymously with Workers in this context.
