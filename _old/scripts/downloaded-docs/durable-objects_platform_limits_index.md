---
title: Limits · Cloudflare Durable Objects docs
description: Durable Objects are a special kind of Worker, so Workers Limits
  apply according to your Workers plan. In addition, Durable Objects have
  specific limits as listed in this page.
lastUpdated: 2025-09-24T13:21:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/platform/limits/
  md: https://developers.cloudflare.com/durable-objects/platform/limits/index.md
---

Durable Objects are a special kind of Worker, so [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/) apply according to your Workers plan. In addition, Durable Objects have specific limits as listed in this page.

## SQLite-backed Durable Objects general limits

| Feature | Limit |
| - | - |
| Number of Objects | Unlimited (within an account or of a given class) |
| Maximum Durable Object classes | 500 (Workers Paid) / 100 (Free) [1](#user-content-fn-1) |
| Storage per account | Unlimited (Workers Paid) / 5GB (Free) [2](#user-content-fn-2) |
| Storage per class | Unlimited [3](#user-content-fn-3) |
| Storage per Durable Object | 10 GB [3](#user-content-fn-3) |
| Key size | Key and value combined cannot exceed 2 MB |
| Value size | Key and value combined cannot exceed 2 MB |
| WebSocket message size | 1 MiB (only for received messages) |
| CPU per request | 30 seconds (default) / configurable to 5 minutes of [active CPU time](https://developers.cloudflare.com/workers/platform/limits/#cpu-time) [4](#user-content-fn-4) |

Footnotes

1. Identical to the Workers [script limit](https://developers.cloudflare.com/workers/platform/limits/).

2. Durable Objects both bills and measures storage based on a gigabyte\
   (1 GB = 1,000,000,000 bytes) and not a gibibyte (GiB).

3. Accounts on the Workers Free plan are limited to 5GB total Durable Objects storage.

4. Each incoming HTTP request or WebSocket *message* resets the remaining available CPU time to 30 seconds. This allows the Durable Object to consume up to 30 seconds of compute after each incoming network request, with each new network request resetting the timer. If you consume more than 30 seconds of compute between incoming network requests, there is a heightened chance that the individual Durable Object is evicted and reset. CPU time per request invocation [can be increased](https://developers.cloudflare.com/durable-objects/platform/limits/#increasing-durable-object-cpu-limits).

### SQL storage limits

For Durable Object classes with [SQLite storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) these SQL limits apply:

| SQL | Limit |
| - | - |
| Maximum number of columns per table | 100 |
| Maximum number of rows per table | Unlimited (excluding per-object storage limits) |
| Maximum string, `BLOB` or table row size | 2 MB |
| Maximum SQL statement length | 100 KB |
| Maximum bound parameters per query | 100 |
| Maximum arguments per SQL function | 32 |
| Maximum characters (bytes) in a `LIKE` or `GLOB` pattern | 50 bytes |

## Key-value backed Durable Objects general limits

Note

Durable Objects are available both on Workers Free and Workers Paid plans.

* **Workers Free plan**: Only Durable Objects with [SQLite storage backend](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/#wrangler-configuration-for-sqlite-backed-durable-objects) are available.
* **Workers Paid plan**: Durable Objects with either SQLite storage backend or [key-value storage backend](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/#create-durable-object-class-with-key-value-storage) are available.

If you wish to downgrade from a Workers Paid plan to a Workers Free plan, you must first ensure that you have deleted all Durable Object namespaces with the key-value storage backend.

| Feature | Limit for class with key-value storage backend |
| - | - |
| Number of Objects | Unlimited (within an account or of a given class) |
| Maximum Durable Object classes | 500 (Workers Paid) / 100 (Free) [5](#user-content-fn-5) |
| Storage per account | 50 GB (can be raised by contacting Cloudflare) [6](#user-content-fn-6) |
| Storage per class | Unlimited |
| Storage per Durable Object | Unlimited |
| Key size | 2 KiB (2048 bytes) |
| Value size | 128 KiB (131072 bytes) |
| WebSocket message size | 1 MiB (only for received messages) |
| CPU per request | 30s (including WebSocket messages) [7](#user-content-fn-7) |

Footnotes

1. Identical to the Workers [script limit](https://developers.cloudflare.com/workers/platform/limits/).

2. Durable Objects both bills and measures storage based on a gigabyte\
   (1 GB = 1,000,000,000 bytes) and not a gibibyte (GiB).

3. Each incoming HTTP request or WebSocket *message* resets the remaining available CPU time to 30 seconds. This allows the Durable Object to consume up to 30 seconds of compute after each incoming network request, with each new network request resetting the timer. If you consume more than 30 seconds of compute between incoming network requests, there is a heightened chance that the individual Durable Object is evicted and reset. CPU time per request invocation [can be increased](https://developers.cloudflare.com/durable-objects/platform/limits/#increasing-durable-object-cpu-limits).

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

## Frequently Asked Questions

### How much work can a single Durable Object do?

Durable Objects can scale horizontally across many Durable Objects. Each individual Object is inherently single-threaded.

* An individual Object has a soft limit of 1,000 requests per second. You can have an unlimited number of individual objects per namespace.
* A simple [storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) `get()` on a small value that directly returns the response may realize a higher request throughput compared to a Durable Object that (for example) serializes and/or deserializes large JSON values.
* Similarly, a Durable Object that performs multiple `list()` operations may be more limited in terms of request throughput.

A Durable Object that receives too many requests will, after attempting to queue them, return an [overloaded](https://developers.cloudflare.com/durable-objects/observability/troubleshooting/#durable-object-is-overloaded) error to the caller.

### How many Durable Objects can I create?

Durable Objects are designed such that the number of individual objects in the system do not need to be limited, and can scale horizontally.

* You can create and run as many separate Durable Objects as you want within a given Durable Object namespace.
* There are no limits for storage per account when using SQLite-backed Durable Objects on a Workers Paid plan.
* Each SQLite-backed Durable Object has a storage limit of 10 GB on a Workers Paid plan.
* Refer to [Durable Object limits](https://developers.cloudflare.com/durable-objects/platform/limits/) for more information.

### Can I increase Durable Objects' CPU limit?

Durable Objects are Worker scripts, and have the same [per invocation CPU limits](https://developers.cloudflare.com/workers/platform/limits/#worker-limits) as any Workers do. Note that CPU time is active processing time: not time spent waiting on network requests, storage calls, or other general I/O, which don't count towards your CPU time or Durable Objects compute consumption.

By default, the maximum CPU time per Durable Objects invocation (HTTP request, WebSocket message, or Alarm) is set to 30 seconds, but can be increased for all Durable Objects associated with a Durable Object definition by setting `limits.cpu_ms` in your Wrangler configuration:

* wrangler.jsonc

  ```jsonc
  {
    // ...rest of your configuration...
    "limits": {
      "cpu_ms": 300000, // 300,000 milliseconds = 5 minutes
    },
    // ...rest of your configuration...
  }
  ```

* wrangler.toml

  ```toml
  [limits]
  cpu_ms = 300_000
  ```

## Footnotes

1. Identical to the Workers [script limit](https://developers.cloudflare.com/workers/platform/limits/). [↩](#user-content-fnref-1)

2. Durable Objects both bills and measures storage based on a gigabyte\
   (1 GB = 1,000,000,000 bytes) and not a gibibyte (GiB).\
   [↩](#user-content-fnref-2)

3. Accounts on the Workers Free plan are limited to 5 GB total Durable Objects storage. [↩](#user-content-fnref-3) [↩2](#user-content-fnref-3-2)

4. Each incoming HTTP request or WebSocket *message* resets the remaining available CPU time to 30 seconds. This allows the Durable Object to consume up to 30 seconds of compute after each incoming network request, with each new network request resetting the timer. If you consume more than 30 seconds of compute between incoming network requests, there is a heightened chance that the individual Durable Object is evicted and reset. CPU time per request invocation [can be increased](https://developers.cloudflare.com/durable-objects/platform/limits/#increasing-durable-object-cpu-limits). [↩](#user-content-fnref-4)

5. Identical to the Workers [script limit](https://developers.cloudflare.com/workers/platform/limits/). [↩](#user-content-fnref-5)

6. Durable Objects both bills and measures storage based on a gigabyte\
   (1 GB = 1,000,000,000 bytes) and not a gibibyte (GiB).\
   [↩](#user-content-fnref-6)

7. Each incoming HTTP request or WebSocket *message* resets the remaining available CPU time to 30 seconds. This allows the Durable Object to consume up to 30 seconds of compute after each incoming network request, with each new network request resetting the timer. If you consume more than 30 seconds of compute between incoming network requests, there is a heightened chance that the individual Durable Object is evicted and reset. CPU time per request invocation [can be increased](https://developers.cloudflare.com/durable-objects/platform/limits/#increasing-durable-object-cpu-limits). [↩](#user-content-fnref-7)
