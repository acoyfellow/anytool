---
title: Pipelines · Cloudflare Pipelines Docs
description: Cloudflare Pipelines ingests events, transforms them with SQL, and
  delivers them to R2 as Iceberg tables or as Parquet and JSON files.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/
  md: https://developers.cloudflare.com/pipelines/index.md
---

Note

Pipelines is in **open beta**, and any developer with a [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) can start using it. Currently, outside of standard R2 storage and operations, you will not be billed for your use of Pipelines.

Ingest, transform, and load streaming data into Apache Iceberg or Parquet in R2.

Available on Paid plans

Cloudflare Pipelines ingests events, transforms them with SQL, and delivers them to R2 as [Iceberg tables](https://developers.cloudflare.com/r2/data-catalog/) or as Parquet and JSON files.

Whether you're processing server logs, mobile application events, IoT telemetry, or clickstream data, Pipelines provides durable ingestion via HTTP endpoints or Worker bindings, SQL-based transformations, and exactly-once delivery to R2. This makes it easy to build analytics-ready data warehouses and lakehouses without managing streaming infrastructure.

Create your first pipeline by following the [getting started guide](https://developers.cloudflare.com/pipelines/getting-started) or running this [Wrangler](https://developers.cloudflare.com/workers/wrangler/) command:

```sh
npx wrangler pipelines setup
```

***

## Features

### Create your first pipeline

Build your first pipeline to ingest data via HTTP or Workers, apply SQL transformations, and deliver to R2 as Iceberg tables or Parquet files.

[Get started](https://developers.cloudflare.com/pipelines/getting-started/)

### Streams

Durable, buffered queues that receive events via HTTP endpoints or Worker bindings.

[Learn about Streams](https://developers.cloudflare.com/pipelines/streams/)

### Pipelines

Connect streams to sinks with SQL transformations that validate, filter, transform, and enrich your data at ingestion time.

[Learn about Pipelines](https://developers.cloudflare.com/pipelines/pipelines/)

### Sinks

Configure destinations for your data. Write Apache Iceberg tables to R2 Data Catalog or export as Parquet and JSON files.

[Learn about Sinks](https://developers.cloudflare.com/pipelines/sinks/)

***

## Related products

**[R2](https://developers.cloudflare.com/r2/)**

Cloudflare R2 Object Storage allows developers to store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

**[Workers](https://developers.cloudflare.com/workers/)**

Cloudflare Workers allows developers to build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

***

## More resources

[Limits](https://developers.cloudflare.com/pipelines/platform/limits/)

Learn about pipelines limits.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.
