---
title: Sinks · Cloudflare Pipelines Docs
description: Sinks define destinations for your data in Cloudflare Pipelines.
  They support writing to R2 Data Catalog as Apache Iceberg tables or to R2 as
  raw JSON or Parquet files.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sinks/
  md: https://developers.cloudflare.com/pipelines/sinks/index.md
---

Sinks define destinations for your data in Cloudflare Pipelines. They support writing to [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/) as Apache Iceberg tables or to [R2](https://developers.cloudflare.com/r2/) as raw JSON or Parquet files.

Sinks provide exactly-once delivery guarantees, ensuring events are never duplicated or dropped. They can be configured to write files frequently for low-latency ingestion or to write larger, less frequent files for better query performance.

## Learn more

[Manage sinks ](https://developers.cloudflare.com/pipelines/sinks/manage-sinks/)Create, configure, and delete sinks using Wrangler or the API.

[Available sinks ](https://developers.cloudflare.com/pipelines/sinks/available-sinks/)Learn about supported sink destinations and their configuration options.
