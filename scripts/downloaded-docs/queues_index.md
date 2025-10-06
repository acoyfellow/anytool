---
title: Overview · Cloudflare Queues docs
description: Cloudflare Queues integrate with Cloudflare Workers and enable you
  to build applications that can guarantee delivery, offload work from a
  request, send data from Worker to Worker, and buffer or batch data.
lastUpdated: 2025-08-19T15:48:23.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/
  md: https://developers.cloudflare.com/queues/index.md
---

Send and receive messages with guaranteed delivery and no charges for egress bandwidth.

Available on Paid plans

Cloudflare Queues integrate with [Cloudflare Workers](https://developers.cloudflare.com/workers/) and enable you to build applications that can [guarantee delivery](https://developers.cloudflare.com/queues/reference/delivery-guarantees/), [offload work from a request](https://developers.cloudflare.com/queues/reference/how-queues-works/), [send data from Worker to Worker](https://developers.cloudflare.com/queues/configuration/configure-queues/), and [buffer or batch data](https://developers.cloudflare.com/queues/configuration/batching-retries/).

[Get started](https://developers.cloudflare.com/queues/get-started/)

***

## Features

### Batching, Retries and Delays

Cloudflare Queues allows you to batch, retry and delay messages.

[Use Batching, Retries and Delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)

### Dead Letter Queues

Redirect your messages when a delivery failure occurs.

[Use Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)

### Pull consumers

Configure pull-based consumers to pull from a queue over HTTP from infrastructure outside of Cloudflare Workers.

[Use Pull consumers](https://developers.cloudflare.com/queues/configuration/pull-consumers/)

***

## Related products

**[R2](https://developers.cloudflare.com/r2/)**

Cloudflare R2 Storage allows developers to store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

**[Workers](https://developers.cloudflare.com/workers/)**

Cloudflare Workers allows developers to build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

***

## More resources

[Pricing](https://developers.cloudflare.com/queues/platform/pricing/)

Learn about pricing.

[Limits](https://developers.cloudflare.com/queues/platform/limits/)

Learn about Queues limits.

[Try the Demo](https://github.com/Electroid/queues-demo#cloudflare-queues-demo)

Try Cloudflare Queues which can run on your local machine.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[Configuration](https://developers.cloudflare.com/queues/configuration/configure-queues/)

Learn how to configure Cloudflare Queues using Wrangler.

[JavaScript APIs](https://developers.cloudflare.com/queues/configuration/javascript-apis/)

Learn how to use JavaScript APIs to send and receive messages to a Cloudflare Queue.

[Event subscriptions](https://developers.cloudflare.com/queues/event-subscriptions/)

Learn how to configure and manage event subscriptions for your queues.
