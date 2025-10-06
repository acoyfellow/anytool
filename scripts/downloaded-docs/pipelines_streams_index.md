---
title: Streams · Cloudflare Pipelines Docs
description: Streams are durable, buffered queues that receive and store events
  for processing in Cloudflare Pipelines. They provide reliable data ingestion
  via HTTP endpoints and Worker bindings, ensuring no data loss even during
  downstream processing delays or failures.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/streams/
  md: https://developers.cloudflare.com/pipelines/streams/index.md
---

Streams are durable, buffered queues that receive and store events for processing in [Cloudflare Pipelines](https://developers.cloudflare.com/pipelines/). They provide reliable data ingestion via HTTP endpoints and Worker bindings, ensuring no data loss even during downstream processing delays or failures.

A single stream can be read by multiple pipelines, allowing you to route the same data to different destinations or apply different transformations. For example, you might send user events to both a real-time analytics pipeline and a data warehouse pipeline.

Streams currently accept events in JSON format and support both structured events with defined schemas and unstructured JSON. When a schema is provided, streams will validate and enforce it for incoming events.

## Learn more

[Manage streams ](https://developers.cloudflare.com/pipelines/streams/manage-streams/)Create, configure, and delete streams using Wrangler or the API.

[Writing to streams ](https://developers.cloudflare.com/pipelines/streams/writing-to-streams/)Send events to streams via HTTP endpoints or Worker bindings.
