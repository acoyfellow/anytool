---
title: Limits · Cloudflare Workflows docs
description: Limits that apply to authoring, deploying, and running Workflows
  are detailed below.
lastUpdated: 2025-09-26T14:36:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/reference/limits/
  md: https://developers.cloudflare.com/workflows/reference/limits/index.md
---

Limits that apply to authoring, deploying, and running Workflows are detailed below.

Many limits are inherited from those applied to Workers scripts and as documented in the [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) documentation.

| Feature | Workers Free | Workers Paid |
| - | - | - |
| Workflow class definitions per script | 3MB max script size per [Worker size limits](https://developers.cloudflare.com/workers/platform/limits/#account-plan-limits) | 10MB max script size per [Worker size limits](https://developers.cloudflare.com/workers/platform/limits/#account-plan-limits) |
| Total scripts per account | 100 | 500 (shared with [Worker script limits](https://developers.cloudflare.com/workers/platform/limits/#account-plan-limits) |
| Compute time per step [1](#user-content-fn-3) | 10 seconds | 30 seconds (default) / configurable to 5 minutes of [active CPU time](https://developers.cloudflare.com/workers/platform/limits/#cpu-time) |
| Duration (wall clock) per step [1](#user-content-fn-3) | Unlimited | Unlimited - for example, waiting on network I/O calls or querying a database |
| Maximum persisted state per step | 1MiB (2^20 bytes) | 1MiB (2^20 bytes) |
| Maximum event [payload size](https://developers.cloudflare.com/workflows/build/events-and-parameters/) | 1MiB (2^20 bytes) | 1MiB (2^20 bytes) |
| Maximum state that can be persisted per Workflow instance | 100MB | 1GB |
| Maximum `step.sleep` duration | 365 days (1 year) | 365 days (1 year) |
| Maximum steps per Workflow [2](#user-content-fn-5) | 1024 | 1024 |
| Maximum Workflow executions | 100,000 per day [shared with Workers daily limit](https://developers.cloudflare.com/workers/platform/limits/#worker-limits) | Unlimited |
| Concurrent Workflow instances (executions) per account | 25 | 4500 |
| Maximum Workflow instance creation rate | 100 per 10 seconds [3](#user-content-fn-6) | 100 per 10 seconds [3](#user-content-fn-6) |
| Maximum number of [queued instances](https://developers.cloudflare.com/workflows/observability/metrics-analytics/#event-types) | 10,000 | 100,000 |
| Retention limit for completed Workflow state | 3 days | 30 days [4](#user-content-fn-2) |
| Maximum length of a Workflow name [5](#user-content-fn-4) | 64 characters | 64 characters |
| Maximum length of a Workflow instance ID [5](#user-content-fn-4) | 100 characters | 100 characters |
| Maximum number of subrequests per Workflow instance | 50/request | 1000/request |

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

### Increasing Workflow CPU limits

Workflows are Worker scripts, and share the same [per invocation CPU limits](https://developers.cloudflare.com/workers/platform/limits/#worker-limits) as any Workers do. Note that CPU time is active processing time: not time spent waiting on network requests, storage calls, or other general I/O, which don't count towards your CPU time or Workflows compute consumption.

By default, the maximum CPU time per Workflow invocation is set to 30 seconds, but can be increased for all invocations associated with a Workflow definition by setting `limits.cpu_ms` in your Wrangler configuration:

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

To learn more about CPU time and limits, [review the Workers documentation](https://developers.cloudflare.com/workers/platform/limits/#cpu-time).

## Footnotes

1. A Workflow instance can run forever, as long as each step does not take more than the CPU time limit and the maximum number of steps per Workflow is not reached. [↩](#user-content-fnref-3) [↩2](#user-content-fnref-3-2)

2. `step.sleep` do not count towards the max. steps limit [↩](#user-content-fnref-5)

3. Workflows will return a HTTP 429 rate limited error if you exceed the rate of new Workflow instance creation. [↩](#user-content-fnref-6) [↩2](#user-content-fnref-6-2)

4. Workflow state and logs will be retained for 3 days on the Workers Free plan and for 7 days on the Workers Paid plan. [↩](#user-content-fnref-2)

5. Match pattern: *`^[a-zA-Z0-9_][a-zA-Z0-9-_]*$`* [↩](#user-content-fnref-4) [↩2](#user-content-fnref-4-2)
