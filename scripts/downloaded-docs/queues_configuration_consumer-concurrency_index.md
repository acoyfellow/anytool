---
title: Consumer concurrency · Cloudflare Queues docs
description: Consumer concurrency allows a consumer Worker processing messages
  from a queue to automatically scale out horizontally to keep up with the rate
  that messages are being written to a queue.
lastUpdated: 2025-09-04T11:41:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/configuration/consumer-concurrency/
  md: https://developers.cloudflare.com/queues/configuration/consumer-concurrency/index.md
---

Consumer concurrency allows a [consumer Worker](https://developers.cloudflare.com/queues/reference/how-queues-works/#consumers) processing messages from a queue to automatically scale out horizontally to keep up with the rate that messages are being written to a queue.

In many systems, the rate at which you write messages to a queue can easily exceed the rate at which a single consumer can read and process those same messages. This is often because your consumer might be parsing message contents, writing to storage or a database, or making third-party (upstream) API calls.

Note that queue producers are always scalable, up to the [maximum supported messages-per-second](https://developers.cloudflare.com/queues/platform/limits/) (per queue) limit.

## Enable concurrency

By default, all queues have concurrency enabled. Queue consumers will automatically scale up [to the maximum concurrent invocations](https://developers.cloudflare.com/queues/platform/limits/) as needed to manage a queue's backlog and/or error rates.

## How concurrency works

After processing a batch of messages, Queues will check to see if the number of concurrent consumers should be adjusted. The number of concurrent consumers invoked for a queue will autoscale based on several factors, including:

* The number of messages in the queue (backlog) and its rate of growth.
* The ratio of failed (versus successful) invocations. A failed invocation is when your `queue()` handler returns an uncaught exception instead of `void` (nothing).
* The value of `max_concurrency` set for that consumer.

Where possible, Queues will optimize for keeping your backlog from growing exponentially, in order to minimize scenarios where the backlog of messages in a queue grows to the point that they would reach the [message retention limit](https://developers.cloudflare.com/queues/platform/limits/) before being processed.

Consumer concurrency and retried messages

[Retrying messages with `retry()`](https://developers.cloudflare.com/queues/configuration/batching-retries/#explicit-acknowledgement-and-retries) or calling `retryAll()` on a batch will **not** count as a failed invocation.

### Example

If you are writing 100 messages/second to a queue with a single concurrent consumer that takes 5 seconds to process a batch of 100 messages, the number of messages in-flight will continue to grow at a rate faster than your consumer can keep up.

In this scenario, Queues will notice the growing backlog and will scale the number of concurrent consumer Workers invocations up to a steady-state of (approximately) five (5) until the rate of incoming messages decreases, the consumer processes messages faster, or the consumer begins to generate errors.

### Why are my consumers not autoscaling?

If your consumers are not autoscaling, there are a few likely causes:

* `max_concurrency` has been set to 1.
* Your consumer Worker is returning errors rather than processing messages. Inspect your consumer to make sure it is healthy.
* A batch of messages is being processed. Queues checks if it should autoscale consumers only after processing an entire batch of messages, so it will not autoscale while a batch is being processed. Consider reducing batch sizes or refactoring your consumer to process messages faster.

## Limit concurrency

Recommended concurrency setting

Cloudflare recommends leaving the maximum concurrency unset, which will allow your queue consumer to scale up as much as possible. Setting a fixed number means that your consumer will only ever scale up to that maximum, even as Queues increases the maximum supported invocations over time.

If you have a workflow that is limited by an upstream API and/or system, you may prefer for your backlog to grow, trading off increased overall latency in order to avoid overwhelming an upstream system.

You can configure the concurrency of your consumer Worker in two ways:

1. Set concurrency settings in the Cloudflare dashboard
2. Set concurrency settings via the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/)

### Set concurrency settings in the Cloudflare dashboard

To configure the concurrency settings for your consumer Worker from the dashboard:

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select your queue > **Settings**.

3. Select **Edit Consumer** under Consumer details.

4. Set **Maximum consumer invocations** to a value between `1` and `250`. This value represents the maximum number of concurrent consumer invocations available to your queue.

To remove a fixed maximum value, select **auto (recommended)**.

Note that if you are writing messages to a queue faster than you can process them, messages may eventually reach the [maximum retention period](https://developers.cloudflare.com/queues/platform/limits/) set for that queue. Individual messages that reach that limit will expire from the queue and be deleted.

### Set concurrency settings in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/)

Note

Ensure you are using the latest version of [wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/). Support for configuring the maximum concurrency of a queue consumer is only supported in wrangler [`2.13.0`](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%402.13.0) or greater.

To set a fixed maximum number of concurrent consumer invocations for a given queue, configure a `max_concurrency` in your Wrangler file:

* wrangler.jsonc

  ```jsonc
  {
    "queues": {
      "consumers": [
        {
          "queue": "my-queue",
          "max_concurrency": 1
        }
      ]
    }
  }
  ```

* wrangler.toml

  ```toml
  [[queues.consumers]]
    queue = "my-queue"
    max_concurrency = 1
  ```

To remove the limit, remove the `max_concurrency` setting from the `[[queues.consumers]]` configuration for a given queue and call `npx wrangler deploy` to push your configuration update.

## Billing

When multiple consumer Workers are invoked, each Worker invocation incurs [CPU time costs](https://developers.cloudflare.com/workers/platform/pricing/#workers).

* If you intend to process all messages written to a queue, *the effective overall cost is the same*, even with concurrency enabled.
* Enabling concurrency simply brings those costs forward, and can help prevent messages from reaching the [message retention limit](https://developers.cloudflare.com/queues/platform/limits/).

Billing for consumers follows the [Workers standard usage model](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing) meaning a developer is billed for the request and for CPU time used in the request.

### Example

A consumer Worker that takes 2 seconds to process a batch of messages will incur the same overall costs to process 50 million (50,000,000) messages, whether it does so concurrently (faster) or individually (slower).
