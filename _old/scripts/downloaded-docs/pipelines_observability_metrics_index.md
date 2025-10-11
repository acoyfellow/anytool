---
title: Metrics and analytics · Cloudflare Pipelines Docs
description: Pipelines expose metrics which allow you to measure data ingested,
  processed, and delivered to sinks.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/observability/metrics/
  md: https://developers.cloudflare.com/pipelines/observability/metrics/index.md
---

Pipelines expose metrics which allow you to measure data ingested, processed, and delivered to sinks.

The metrics displayed in the [Cloudflare dashboard](https://dash.cloudflare.com/) are queried from Cloudflare's [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). You can access the metrics [programmatically](#query-via-the-graphql-api) via GraphQL or HTTP client.

## Metrics

### Operator metrics

Pipelines export the below metrics within the `AccountPipelinesOperatorAdaptiveGroups` dataset. These metrics track data read and processed by pipeline operators.

| Metric | GraphQL Field Name | Description |
| - | - | - |
| Bytes In | `bytesIn` | Total number of bytes read by the pipeline (filter by `streamId_neq: ""` to get data read from streams) |
| Records In | `recordsIn` | Total number of records read by the pipeline (filter by `streamId_neq: ""` to get data read from streams) |
| Decode Errors | `decodeErrors` | Number of messages that could not be deserialized in the stream schema |

The `AccountPipelinesOperatorAdaptiveGroups` dataset provides the following dimensions for filtering and grouping queries:

* `pipelineId` - ID of the pipeline
* `streamId` - ID of the source stream
* `datetime` - Timestamp of the operation
* `date` - Timestamp of the operation, truncated to the start of a day
* `datetimeHour` - Timestamp of the operation, truncated to the start of an hour

### Sink metrics

Pipelines export the below metrics within the `AccountPipelinesSinkAdaptiveGroups` dataset. These metrics track data delivery to sinks.

| Metric | GraphQL Field Name | Description |
| - | - | - |
| Bytes Written | `bytesWritten` | Total number of bytes written to the sink, after compression |
| Records Written | `recordsWritten` | Total number of records written to the sink |
| Files Written | `filesWritten` | Number of files written to the sink |
| Row Groups Written | `rowGroupsWritten` | Number of row groups written (for Parquet files) |
| Uncompressed Bytes Written | `uncompressedBytesWritten` | Total number of bytes written before compression |

The `AccountPipelinesSinkAdaptiveGroups` dataset provides the following dimensions for filtering and grouping queries:

* `pipelineId` - ID of the pipeline
* `sinkId` - ID of the destination sink
* `datetime` - Timestamp of the operation
* `date` - Timestamp of the operation, truncated to the start of a day
* `datetimeHour` - Timestamp of the operation, truncated to the start of an hour

## View metrics in the dashboard

Per-pipeline analytics are available in the Cloudflare dashboard. To view current and historical metrics for a pipeline:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Go to **Pipelines** > **Pipelines**.
3. Select a pipeline.
4. Go to the **Metrics** tab to view its metrics.

You can optionally select a time window to query. This defaults to the last 24 hours.

## Query via the GraphQL API

You can programmatically query analytics for your pipelines via the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). This API queries the same datasets as the Cloudflare dashboard and supports GraphQL [introspection](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/introspection/).

Pipelines GraphQL datasets require an `accountTag` filter with your Cloudflare account ID.

### Measure operator metrics over time period

This query returns the total bytes and records read by a pipeline from streams, along with any decode errors.

```graphql
query PipelineOperatorMetrics(
  $accountTag: string!
  $pipelineId: string!
  $datetimeStart: Time!
  $datetimeEnd: Time!
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      accountPipelinesOperatorAdaptiveGroups(
        limit: 10000
        filter: {
          pipelineId: $pipelineId
          streamId_neq: ""
          datetime_geq: $datetimeStart
          datetime_leq: $datetimeEnd
        }
      ) {
        sum {
          bytesIn
          recordsIn
          decodeErrors
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBACgSwA5gDYIHZgPIogQwBcB7CAWTEIgQGMBnACgCgYYASfGm4kDQgFXwBzAFww6VTEICELdkmRpMYAJIATMROoYZctmqKUEAWzABlQvgiEx-E2Fmt9hwvYCiGDTDunZAShgAbzkANwQwAHdIILlWTm5eQkYAMwRUQkgxQJh4nj5BUXZcxIKYAF8A4NZqnK48wkQUdCw6XEgiUgBBAyRXELAAcQgeJEZYmph0YwQbGABGAAYlhfGa1PTMmImJhSbldTE2XaUsdVWJrTB8Y3UAfSxgMQAiJ-OagwzXU1uhMEf2D5GUwWKyEN7VQFfMC3VB-Q6Q9yecFlc6VcF0EDGLbbaoAIygGToKgw4NYEDA3AgaiJJJxEIpxDUYDcEGGEDoyPOKJq3PKTDKQA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQAHASyYFMAbF+dqgEywgASgFEACgBl8oigHUqyABLU6jfmETtELALbsAyojAAnREIBMABgsBWALQBGK-asBmZI4uYLATky2VgBaDCAaWjr6ovCC2NZ2Ti7ungAcPv6BIQC+QA)

### Measure sink delivery metrics

This query returns detailed metrics about data written to a specific sink, including file and compression statistics.

```graphql
query PipelineSinkMetrics(
  $accountTag: string!
  $pipelineId: string!
  $sinkId: string!
  $datetimeStart: Time!
  $datetimeEnd: Time!
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      accountPipelinesSinkAdaptiveGroups(
        limit: 10000
        filter: {
          pipelineId: $pipelineId
          sinkId: $sinkId
          datetime_geq: $datetimeStart
          datetime_leq: $datetimeEnd
        }
      ) {
        sum {
          bytesWritten
          recordsWritten
          filesWritten
          rowGroupsWritten
          uncompressedBytesWritten
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBACgSwA5gDYIHZgMqYNYCyYALhAgMYDOAFAFAwwAkAhueQPYgbEAqzA5gC4YlUpn4BCekyTI0mMAEkAJsNFkMk6Y0r4VasZqkNGy5sRIIAtjmLMIxYT2thjTMxeIuAohlUxnGykAShgAb2kANwQwAHdIcOkGVg4uYhoAMwRUCwhhMJgUzm4+ISYitNKYAF9QiIYGwrZi4kQUdCxKXAw8AEEzJC9IsABxCE4kGiTGmHQrBEcYAEYABjWV6casnMh8zZnZdoV9GTkOpWV9xt0ek509S5mZj0sbAH1+MGBhU3NX23sxCuDReXneqC+P1BPj8wOq+zqwMoICsiSejQARlALJQAOpkYgWDDAhgQMAcCDKPEEokkmDbMDUha09ENcaxMYTJmEsDE1kMLgcKxIMmUShgZQAIWxjPxzN5cP28MaypqtGqQA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQAHASyYFMAbF+dqgEywgASgFEACgBl8oigHUqyABLU6jAM48A1gKFipM+YpW0GIfmETtELALbsAyojAAnREIBMABg8BWALQAjF7+XgDMyIEemB4AnJi+XgBaZhZWNvai8ILY3n5BIeGRABwx8YkpAL5AA)
