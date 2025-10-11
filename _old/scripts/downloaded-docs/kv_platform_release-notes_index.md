---
title: Release notes · Cloudflare Workers KV docs
description: Subscribe to RSS
lastUpdated: 2025-03-11T16:39:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/kv/platform/release-notes/
  md: https://developers.cloudflare.com/kv/platform/release-notes/index.md
---

[Subscribe to RSS](https://developers.cloudflare.com/kv/platform/release-notes/index.xml)

## 2024-11-14

**Workers KV REST API bulk operations provide granular errors**

The REST API endpoints for bulk operations ([write](https://developers.cloudflare.com/api/resources/kv/subresources/namespaces/subresources/keys/methods/bulk_update/), [delete](https://developers.cloudflare.com/api/resources/kv/subresources/namespaces/subresources/keys/methods/bulk_delete/)) now return the keys of operations that failed during the bulk operation. The updated response bodies are documented in the [REST API documentation](https://developers.cloudflare.com/api/resources/kv/subresources/namespaces/methods/list/) and contain the following information in the `result` field:

```
{
  "successful_key_count": number,
  "unsuccessful_keys": string[]
}
```

The unsuccessful keys are an array of keys that were not written successfully to all storage backends and therefore should be retried.

## 2024-08-08

**New KV Analytics API**

Workers KV now has a new [metrics dashboard](https://developers.cloudflare.com/kv/observability/metrics-analytics/#view-metrics-in-the-dashboard) and [analytics API](https://developers.cloudflare.com/kv/observability/metrics-analytics/#query-via-the-graphql-api) that leverages the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) used by many other Cloudflare products. The new analytics API provides per-account and per-namespace metrics for both operations and storage, including latency metrics for read and write operations to Workers KV.

The legacy Workers KV analytics REST API will be turned off as of January 31st, 2025. Developers using this API will receive a series of email notifications prior to the shutdown of the legacy API.
