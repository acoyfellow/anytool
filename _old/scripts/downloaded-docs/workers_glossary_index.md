---
title: Glossary · Cloudflare Workers docs
description: Review the definitions for terms used across Cloudflare's Workers
  documentation.
lastUpdated: 2025-02-05T10:06:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/glossary/
  md: https://developers.cloudflare.com/workers/glossary/index.md
---

Review the definitions for terms used across Cloudflare's Workers documentation.

| Term | Definition |
| - | - |
| Auxiliary Worker | A Worker created locally via the [Workers Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration/) that runs in a separate isolate to the test runner, with a different global scope. |
| binding | [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) allow your Workers to interact with resources on the Cloudflare Developer Platform. |
| C3 | [C3](https://developers.cloudflare.com/learning-paths/workers/get-started/c3-and-wrangler/) is a command-line tool designed to help you set up and deploy new applications to Cloudflare. |
| CPU time | [CPU time](https://developers.cloudflare.com/workers/platform/limits/#cpu-time) is the amount of time the central processing unit (CPU) actually spends doing work, during a given request. |
| Cron Triggers | [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) allow users to map a cron expression to a Worker using a [`scheduled()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) that enables Workers to be executed on a schedule. |
| D1 | [D1](https://developers.cloudflare.com/d1/) is Cloudflare's native serverless database. |
| deployment | [Deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/#deployments) track the version(s) of your Worker that are actively serving traffic. |
| Durable Objects | [Durable Objects](https://developers.cloudflare.com/durable-objects/) is a globally distributed coordination API with strongly consistent storage. |
| duration | [Duration](https://developers.cloudflare.com/workers/platform/limits/#duration) is a measurement of wall-clock time — the total amount of time from the start to end of an invocation of a Worker. |
| environment | [Environments](https://developers.cloudflare.com/workers/wrangler/environments/) allow you to deploy the same Worker application with different configuration for each environment. Only available for use with a [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). |
| environment variable | [Environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/) are a type of binding that allow you to attach text strings or JSON values to your Worker. |
| handler | [Handlers](https://developers.cloudflare.com/workers/runtime-apis/handlers/) are methods on Workers that can receive and process external inputs, and can be invoked from outside your Worker. |
| isolate | [Isolates](https://developers.cloudflare.com/workers/reference/how-workers-works/#isolates) are lightweight contexts that provide your code with variables it can access and a safe environment to be executed within. |
| KV | [Workers KV](https://developers.cloudflare.com/kv/) is Cloudflare's key-value data storage. |
| module Worker | Refers to a Worker written in [module syntax](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/). |
| origin | [Origin](https://www.cloudflare.com/learning/cdn/glossary/origin-server/) generally refers to the web server behind Cloudflare where your application is hosted. |
| Pages | [Cloudflare Pages](https://developers.cloudflare.com/pages/) is Cloudflare's product offering for building and deploying full-stack applications. |
| Queues | [Queues](https://developers.cloudflare.com/queues/) integrates with Cloudflare Workers and enables you to build applications that can guarantee delivery. |
| R2 | [R2](https://developers.cloudflare.com/r2/) is an S3-compatible distributed object storage designed to eliminate the obstacles of sharing data across clouds. |
| rollback | [Rollbacks](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/) are a way to deploy an older deployment to the Cloudflare global network. |
| secret | [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) are a type of binding that allow you to attach encrypted text values to your Worker. |
| service Worker | Refers to a Worker written in [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) [syntax](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/). |
| subrequest | A subrequest is any request that a Worker makes to either Internet resources using the [Fetch API](https://developers.cloudflare.com/workers/runtime-apis/fetch/) or requests to other Cloudflare services like [R2](https://developers.cloudflare.com/r2/), [KV](https://developers.cloudflare.com/kv/), or [D1](https://developers.cloudflare.com/d1/). |
| Tail Worker | A [Tail Worker](https://developers.cloudflare.com/workers/observability/logs/tail-workers/) receives information about the execution of other Workers (known as producer Workers), such as HTTP statuses, data passed to `console.log()` or uncaught exceptions. |
| V8 | Chrome V8 is a [JavaScript engine](https://www.cloudflare.com/learning/serverless/glossary/what-is-chrome-v8/), which means that it [executes JavaScript code](https://developers.cloudflare.com/workers/reference/how-workers-works/). |
| version | A [version](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/#versions) is defined by the state of code as well as the state of configuration in a Worker's Wrangler file. |
| wall-clock time | [Wall-clock time](https://developers.cloudflare.com/workers/platform/limits/#duration) is the total amount of time from the start to end of an invocation of a Worker. |
| workerd | [`workerd`](https://github.com/cloudflare/workerd?cf_target_id=D15F29F105B3A910EF4B2ECB12D02E2A) is a JavaScript / Wasm server runtime based on the same code that powers Cloudflare Workers. |
| Wrangler | [Wrangler](https://developers.cloudflare.com/learning-paths/workers/get-started/c3-and-wrangler/) is the Cloudflare Developer Platform command-line interface (CLI) that allows you to manage projects, such as Workers, created from the Cloudflare Developer Platform product offering. |
| wrangler.toml / wrangler.json / wrangler.jsonc | The [configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) used to customize the development and deployment setup for a Worker or a Pages Function. |
