---
title: Metrics and analytics · Cloudflare Hyperdrive docs
description: Hyperdrive exposes analytics that allow you to inspect query
  volume, query latency and cache ratios size across all and/or each Hyperdrive
  configuration in your account.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/observability/metrics/
  md: https://developers.cloudflare.com/hyperdrive/observability/metrics/index.md
---

Hyperdrive exposes analytics that allow you to inspect query volume, query latency and cache ratios size across all and/or each Hyperdrive configuration in your account.

## Metrics

Hyperdrive currently exports the below metrics as part of the `hyperdriveQueriesAdaptiveGroups` GraphQL dataset:

| Metric | GraphQL Field Name | Description |
| - | - | - |
| Queries | `count` | The number of queries issued against your Hyperdrive in the given time period. |
| Cache Status | `cacheStatus` | Whether the query was cached or not. Can be one of `disabled`, `hit`, `miss`, `uncacheable`, `multiplestatements`, `notaquery`, `oversizedquery`, `oversizedresult`, `parseerror`, `transaction`, and `volatile`. |
| Query Bytes | `queryBytes` | The size of your queries, in bytes. |
| Result Bytes | `resultBytes` | The size of your query *results*, in bytes. |
| Connection Latency | `connectionLatency` | The time (in milliseconds) required to establish new connections from Hyperdrive to your database, as measured from your Hyperdrive connection pool(s). |
| Query Latency | `queryLatency` | The time (in milliseconds) required to query (and receive results) from your database, as measured from your Hyperdrive connection pool(s). |
| Event Status | `eventStatus` | Whether a query responded successfully (`complete`) or failed (`error`). |

Metrics can be queried (and are retained) for the past 31 days.

## View metrics in the dashboard

Per-database analytics for Hyperdrive are available in the Cloudflare dashboard. To view current and historical metrics for a Hyperdrive configuration:

1. In the Cloudflare dashboard, go to the **Hyperdrive** page.

   [Go to **Hyperdrive**](https://dash.cloudflare.com/?to=/:account/workers/hyperdrive)

2. Select an existing Hyperdrive configuration.

3. Select the **Metrics** tab.

You can optionally select a time window to query. This defaults to the last 24 hours.

## Query via the GraphQL API

You can programmatically query analytics for your Hyperdrive configurations via the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). This API queries the same datasets as the Cloudflare dashboard, and supports GraphQL [introspection](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/introspection/).

Hyperdrives's GraphQL datasets require an `accountTag` filter with your Cloudflare account ID. Hyperdrive exposes the `hyperdriveQueriesAdaptiveGroups` dataset.

## Write GraphQL queries

Examples of how to explore your Hyperdrive metrics.

### Get the number of queries handled via your Hyperdrive config by cache status

```graphql
query HyperdriveQueries(
  $accountTag: string!
  $configId: string!
  $datetimeStart: Time!
  $datetimeEnd: Time!
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      hyperdriveQueriesAdaptiveGroups(
        limit: 10000
        filter: {
          configId: $configId
          datetime_geq: $datetimeStart
          datetime_leq: $datetimeEnd
        }
      ) {
        count
        dimensions {
          cacheStatus
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAElADpAJhAlgNzARXBsAZwAoAoGGAEgEMBjWgexADsAXAFWoHMAuGQ1hmZcAhOSqNmAM3RcAkij4Cho8ZRTVWYVugC2YAMqtqEVn3Z6wYius3bLAUWaKYF-WICUMAN7jM6MAB3SB9xCjpGFlYSGQAbLQg+bxgIpjZOXipUqIyYAF8vXwpimAALJFQMbDxIAMIAQQ1EHWwAcQgmRBIwkphYvXQzGABGAAZx0Z6SuISkqd7JGXkXSkXZBXmSjS0dfQB9LjBgPlsdyyMTVk3i7ft92KOT292wJxRrvPnC68i2a5RLMxCOgGEDQr0FnRSoZjKwQIQPvNPiVkflSHkgA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQZ4AzASzSoBMsQAlAKIAFADL4BFAOpVkACWp1GXMIgCmiNgFtVAZURgATol4AmAAwmArAFoAjGetmAzMlsnMJgJyYALADYALQYQZTUNbQF4HmxzKzsHZ1cADg9vfyCAXyA)

### Get the average query and connection latency for queries handled via your Hyperdrive config within a range of time, excluding queries that failed due to an error

```graphql
query AverageHyperdriveLatencies(
  $accountTag: string!
  $configId: string!
  $datetimeStart: Time!
  $datetimeEnd: Time!
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      hyperdriveQueriesAdaptiveGroups(
        limit: 10000
        filter: {
          configId: $configId
          eventStatus: "complete"
          datetime_geq: $datetimeStart
          datetime_leq: $datetimeEnd
        }
      ) {
        avg {
          connectionLatency
          queryLatency
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAggN0gQwOZgBJQA6QCYQCWSAMsgC5gB2AxoWAM4AUAUDDACTI00D2IVcgBU0ALhgNyRKqgCEbTnyoAzQqgCSecZOlyFHPBTDlCAWzABlcsgjlxQs2HnsDRk+YCiVLTAfn5AJQwAN4KCPQA7pAhCuzcfALkzKoANpQQ4sEw8fyCIqjiXDy5wmgwAL5Boew1MAAWOPhESACK4ESMcIbYJkgA4hD82MyxtTApZoR2MACMAAwLc6O1qemZy2NKqho+HFtqmhu1YEiCVhQgDOIARHym2CnGYNdHNYaU7mAA+ujAhe-GRznWyvdgAz5fR5-TjgxxePCvcobKqvZAIVAxMabXhUKhgGgmHFkSi0KCgmCgSBQYnUGhkrHsJFYpk1FlI8pAA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQZ4AzASzSoBMsQAlAKIAFADL4BFAOpVkACWp1GXMIgCmiNgFtVAZURgATol4AmAAwmArAFoAjGetmAzMlsnMJgJyYALADYALQYQZTUNbQF4HmxzKzsHZ1cADg9vfyCAXyA)

### Get the total amount of query and result bytes flowing through your Hyperdrive config

```graphql
query HyperdriveQueryAndResultBytesForSuccessfulQueries(
  $accountTag: string!
  $configId: string!
  $datetimeStart: Date!
  $datetimeEnd: Date!
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      hyperdriveQueriesAdaptiveGroups(
        limit: 10000
        filter: {
          configId: $configId
          datetime_geq: $datetimeStart
          datetime_leq: $datetimeEnd
        }
      ) {
        sum {
          queryBytes
          resultBytes
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAElADpAJhAlgNzARXNAQQDsUAlMAZxABsAXAISlsoDEB7CAZRAGMfKKAMxp5I6SgAoAUDBgASAIZ82IIrQAqCgOYAuGBVoYiWgIQz5PNkUHotASRR6DR0+bkoFzWugC2YTrQKELR6ACKeYGay7hHefgCiJGERZgCUMADe5pjiAO6QmeaySpaqtBQSNnSQehkwJSpqmrryDWXNMAC+6VmyfTAAFkioGNiiGJQEHoje2ADiECqIFUX9MNS+6CEwAIwADAd7q-1VzBC1x2uW1rYOenLXNvYol-0eXr5gAPpaYMD37zAcX8gWCrz6gOBX2ofwBsU+iReaz6nUuPXBVB8hWR-VAkCgjGYFHBsgglBoDCYlHBqORtJR5lRnSAA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQZ4AzASzSoBMsQAlAKIAFADL4BFAOpVkACWp1GXMIgCmiNgFtVAZURgATol4AmAAwmArAFoAjGesWGIZWo3aB8HtnNW7DswBmEABfIA)
