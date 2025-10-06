---
title: Embedded function calling · Cloudflare Workers AI docs
description: Cloudflare has a unique embedded function calling feature that
  allows you to execute function code alongside your tool call inference. Our
  npm package @cloudflare/ai-utils is the developer toolkit to get started.
lastUpdated: 2025-04-03T16:21:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/
  md: https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/index.md
---

Cloudflare has a unique [embedded function calling](https://blog.cloudflare.com/embedded-function-calling) feature that allows you to execute function code alongside your tool call inference. Our npm package [`@cloudflare/ai-utils`](https://www.npmjs.com/package/@cloudflare/ai-utils) is the developer toolkit to get started.

Embedded function calling can be used to easily make complex agents that interact with websites and APIs, like using natural language to create meetings on Google Calendar, saving data to Notion, automatically routing requests to other APIs, saving data to an R2 bucket - or all of this at the same time. All you need is a prompt and an OpenAPI spec to get started.

REST API support

Embedded function calling depends on features native to the Workers platform. This means that embedded function calling is only supported via [Cloudflare Workers](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/), not via the [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/).

## Resources

* [Get Started](https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/get-started/)
* [Examples](https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/examples/)
* [API Reference](https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/api-reference/)
* [Troubleshooting](https://developers.cloudflare.com/workers-ai/features/function-calling/embedded/troubleshooting/)
