---
title: Overview · Cloudflare Durable Objects docs
description: Durable Objects provide a building block for stateful applications
  and distributed systems.
lastUpdated: 2025-09-24T13:21:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/
  md: https://developers.cloudflare.com/durable-objects/index.md
---

Create AI agents, collaborative applications, real-time interactions like chat, and more without needing to coordinate state, have separate storage, or manage infrastructure.

Available on Free and Paid plans

Durable Objects provide a building block for stateful applications and distributed systems.

Use Durable Objects to build applications that need coordination among multiple clients, like collaborative editing tools, interactive chat, multiplayer games, live notifications, and deep distributed systems, without requiring you to build serialization and coordination primitives on your own.

[Get started](https://developers.cloudflare.com/durable-objects/get-started/)

Note

SQLite-backed Durable Objects are now available on the Workers Free plan with these [limits](https://developers.cloudflare.com/durable-objects/platform/pricing/).

[SQLite storage](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/) and corresponding [Storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) methods like `sql.exec` have moved from beta to general availability. New Durable Object classes should use wrangler configuration for [SQLite storage](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/#wrangler-configuration-for-sqlite-durable-objects).

### What are Durable Objects?

A Durable Object is a special kind of [Cloudflare Worker](https://developers.cloudflare.com/workers/) which uniquely combines compute with storage. Like a Worker, a Durable Object is automatically provisioned geographically close to where it is first requested, starts up quickly when needed, and shuts down when idle. You can have millions of them around the world. However, unlike regular Workers:

* Each Durable Object has a **globally-unique name**, which allows you to send requests to a specific object from anywhere in the world. Thus, a Durable Object can be used to coordinate between multiple clients who need to work together.
* Each Durable Object has some **durable storage** attached. Since this storage lives together with the object, it is strongly consistent yet fast to access.

Therefore, Durable Objects enable **stateful** serverless applications.

For more information, refer to the full [What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/) page.

***

## Features

### In-memory State

Learn how Durable Objects coordinate connections among multiple clients or events.

[Use In-memory State](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/)

### Storage API

Learn how Durable Objects provide transactional, strongly consistent, and serializable storage.

[Use Storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)

### WebSocket Hibernation

Learn how WebSocket Hibernation allows you to manage the connections of multiple clients at scale.

[Use WebSocket Hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/#websocket-hibernation-api)

### Durable Objects Alarms

Learn how to use alarms to trigger a Durable Object and perform compute in the future at customizable intervals.

[Use Durable Objects Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)

***

## Related products

**[Workers](https://developers.cloudflare.com/workers/)**

Cloudflare Workers provides a serverless execution environment that allows you to create new applications or augment existing ones without configuring or maintaining infrastructure.

**[D1](https://developers.cloudflare.com/d1/)**

D1 is Cloudflare's SQL-based native serverless database. Create a database by importing data or defining your tables and writing your queries within a Worker or through the API.

**[R2](https://developers.cloudflare.com/r2/)**

Cloudflare R2 Storage allows developers to store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

***

## More resources

[Built with Durable Objects](https://workers.cloudflare.com/built-with/collections/durable-objects/)

Browse what other developers are building with Durable Objects.

[Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)

Learn about Durable Objects limits.

[Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

Learn about Durable Objects pricing.

[Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)

Learn more about storage and database options you can build with Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Developer Platform.
