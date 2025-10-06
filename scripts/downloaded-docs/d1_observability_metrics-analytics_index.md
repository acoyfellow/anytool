---
title: Metrics and analytics · Cloudflare D1 docs
description: D1 exposes database analytics that allow you to inspect query
  volume, query latency, and storage size across all and/or each database in
  your account.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/metrics-analytics/
  md: https://developers.cloudflare.com/d1/observability/metrics-analytics/index.md
---

D1 exposes database analytics that allow you to inspect query volume, query latency, and storage size across all and/or each database in your account.

The metrics displayed in the [Cloudflare dashboard](https://dash.cloudflare.com/) charts are queried from Cloudflare’s [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). You can access the metrics [programmatically](#query-via-the-graphql-api) via GraphQL or HTTP client.

## Metrics

D1 currently exports the below metrics:

| Metric | GraphQL Field Name | Description |
| - | - | - |
| Read Queries (qps) | `readQueries` | The number of read queries issued against a database. This is the raw number of read queries, and is not used for billing. |
| Write Queries (qps) | `writeQueries` | The number of write queries issued against a database. This is the raw number of write queries, and is not used for billing. |
| Rows read (count) | `rowsRead` | The number of rows read (scanned) across your queries. See [Pricing](https://developers.cloudflare.com/d1/platform/pricing/) for more details on how rows are counted. |
| Rows written (count) | `rowsWritten` | The number of rows written across your queries. |
| Query Response (bytes) | `queryBatchResponseBytes` | The total response size of the serialized query response, including any/all column names, rows and metadata. Reported in bytes. |
| Query Latency (ms) | `queryBatchTimeMs` | The total query response time, including response serialization, on the server-side. Reported in milliseconds. |
| Storage (Bytes) | `databaseSizeBytes` | Maximum size of a database. Reported in bytes. |

Metrics can be queried (and are retained) for the past 31 days.

### Row counts

D1 returns the number of rows read, rows written (or both) in response to each individual query via [the Workers Binding API](https://developers.cloudflare.com/d1/worker-api/return-object/).

Row counts are a precise count of how many rows were read (scanned) or written by that query. Inspect row counts to understand the performance and cost of a given query, including whether you can reduce the rows read [using indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/). Use query counts to understand the total volume of traffic against your databases and to discern which databases are actively in-use.

Refer to the [Pricing documentation](https://developers.cloudflare.com/d1/platform/pricing/) for more details on how rows are counted.

## View metrics in the dashboard

Per-database analytics for D1 are available in the Cloudflare dashboard. To view current and historical metrics for a database:

1. In the Cloudflare dashboard, go to the **D1** page.

   [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

2. Select an existing D1 database.

3. Select the **Metrics** tab.

You can optionally select a time window to query. This defaults to the last 24 hours.

## Query via the GraphQL API

You can programmatically query analytics for your D1 databases via the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/). This API queries the same datasets as the Cloudflare dashboard, and supports GraphQL [introspection](https://developers.cloudflare.com/analytics/graphql-api/features/discovery/introspection/).

D1's GraphQL datasets require an `accountTag` filter with your Cloudflare account ID and include:

* `d1AnalyticsAdaptiveGroups`
* `d1StorageAdaptiveGroups`
* `d1QueriesAdaptiveGroups`

### Examples

To query the sum of `readQueries`, `writeQueries` for a given `$databaseId`, grouping by `databaseId` and `date`:

```graphql
query D1ObservabilitySampleQuery(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
        orderBy: [date_DESC]
      ) {
        sum {
          readQueries
          writeQueries
        }
        dimensions {
          date
          databaseId
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAIgRgPICMDOkBuBDFBLAGzwBcoBlbAWwAcCwBFcaACgCgYYASbAYx4HsQAO2IAVbAHMAXDDTEIeIRICE7LnOwRiMuNmJg1nMEIAmOvQY6cTe3NgwBJM7PmKJrAJQwA3msx4wAHdIHzUOXgFhYjRmADNCfQgZbxgIwRFxaS40qMyYAF8vXw4SmBMEAEEhbAIoYjweNAqbanrMMABxCEFqGLDSmCJKEhkEAAYJsf7S+IJE5LKLAH0JMGAZTg0tABpF-SW6da5jE12bYjtHZ2tbFHswJwLpkv4IE0gAISgZAG1zsCWcAAomQAMIAXWeRWeHDQIEooQGAwgYGwJkYkACaBhJUCCn0GIUYGxSI4+RxJjwlGMaDw-CEaERpI4-xxLNu9ycOPJSJ5JT55PyQA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQBnRMAJ0SxACYAGbgKwBaAIy8h-BiACm8ACZc+g0eN4BmKXLCsARmCbSqC7ACUAogAUAMvjMUA6lWQAJanQC+QA)

To query both the average `queryBatchTimeMs` and the 90th percentile `queryBatchTimeMs` per database:

```graphql
query D1ObservabilitySampleQuery2(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
        orderBy: [date_DESC]
      ) {
        quantiles {
          queryBatchTimeMsP90
        }
        dimensions {
          date
          databaseId
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAIgRgPICMDOkBuBDFBLAGzwBcoBlbAWwAcCwBFcaAJgAoAoGGAEmwGM+AexAA7YgBVsAcwBcMNMQh4RUgISceC7BGJy42YmA3cwIgCZ6DRrtzMHc2DAEkL8xcqnsAlDADeGzDwwAHdIPw0ufiFRYjRWADNCQwg5Xxgo4TFJWR4MmJcYAF8ffy4ymDMEAEERbAIoYjw+NCq7akbMMABxCGFqOIjymCJKEjkEAAYpicHyxIJk1IqrAH0pMGA5bi0dABplwxW6TZ5TM327YgdnV1t7FEcwAsLZssEIM0gAISg5AG1LmAVnAAKJkADCAF1XiVXlxQNgxIQwGhwkMhqBIFAvgY+AALcR4ShgACyaAACgBOGborgvWkVImmNB4QQiVGlBkHaxcy7XJ5mOFFV70sqil6FIA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQBnRMAJ0SxACYAGbgKwBaAIy8h-BiACm8ACZc+g0eN4BmKXLCsARmCbSqC7ACUAogAUAMvjMUA6lWQAJanQC+QA)

To query your account-wide `readQueries` and `writeQueries`:

```graphql
query D1ObservabilitySampleQuery3(
  $accountTag: string!
  $start: Date
  $end: Date
  $databaseId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      d1AnalyticsAdaptiveGroups(
        limit: 10000
        filter: { date_geq: $start, date_leq: $end, databaseId: $databaseId }
      ) {
        sum {
          readQueries
          writeQueries
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAIgRgPICMDOkBuBDFBLAGzwBcoBlbAWwAcCwBFcaAZgAoAoGGAEmwGM+AexAA7YgBVsAcwBcMNMQh4RUgISceC7BGJy42YmA3cwIgCZ6DRrtzMHc2DAEkL8xcqnsAlDADeGzDwwAHdIPw0ufiFRYjRWADNCQwg5Xxgo4TFJWR4MmOyYAF8ffy4ymDMEAEERbAIoYjw+NCq7akbMMABxCGFqOIjymCJKEjkEAAYpicHyxIJk1IqrAH0pMGA5bi0dABplwxW6TZ5TM327YgdnV1t7FEcwFyLZmBLXrjQQSnChoYgwNgzIxIEE0B8ysElIYQUowOC-lxCq9keVUS9CkA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQBnRMAJ0SxACYAGbgKwBaAIy8h-BiACm8ACZc+g0eN4BmKXLCsARmCbSqC7ACUAogAUAMvjMUA6lWQAJanQC+QA)

## Query `insights`

D1 provides metrics that let you understand and debug query performance. You can access these via GraphQL's `d1QueriesAdaptiveGroups` or `wrangler d1 insights` command.

D1 captures your query strings to make it easier to analyze metrics across query executions. [Bound parameters](https://developers.cloudflare.com/d1/worker-api/prepared-statements/#guidance) are not captured to remove any sensitive information.

Note

`wrangler d1 insights` is an experimental Wrangler command. Its options and output may change.

Run `wrangler d1 insights --help` to view current options.

| Option | Description |
| - | - |
| `--timePeriod` | Fetch data from now to the provided time period (default: `1d`). |
| `--sort-type` | The operation you want to sort insights by. Select between `sum` and `avg` (default: `sum`). |
| `--sort-by` | The field you want to sort insights by. Select between `time`, `reads`, `writes`, and `count` (default: `time`). |
| `--sort-direction` | The sort direction. Select between `ASC` and `DESC` (default: `DESC`). |
| `--json` | A boolean value to specify whether to return the result as clean JSON (default: `false`). |
| `--limit` | The maximum number of queries to be fetched. |

To find top 3 queries by execution count:

```sh
npx wrangler d1 insights <database_name> --sort-type=sum --sort-by=count --limit=3
```

```sh
 ⛅️ wrangler 3.95.0
-------------------


-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------


[
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  },
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  }
]
```

To find top 3 queries by average execution time:

```sh
npx wrangler d1 insights <database_name> --sort-type=avg --sort-by=time --limit=3
```

```sh
⛅️ wrangler 3.95.0
-------------------


-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------


[
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  }
]
```

To find top 10 queries by rows written in last 7 days:

```sh
npx wrangler d1 insights <database_name> --sort-type=sum --sort-by=writes --limit=10 --timePeriod=7d
```

```sh
⛅️ wrangler 3.95.0
-------------------


-------------------
🚧 `wrangler d1 insights` is an experimental command.
🚧 Flags for this command, their descriptions, and output may change between wrangler versions.
-------------------


[
  {
    "query": "SELECT * FROM Customers",
    "avgRowsRead": 4,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.1873,
    "totalDurationMs": 0.1873,
    "numberOfTimesRun": 1,
    "queryEfficiency": 1
  },
  {
    "query": "SELECT * From Customers",
    "avgRowsRead": 0,
    "totalRowsRead": 0,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 1.0225,
    "totalDurationMs": 1.0225,
    "numberOfTimesRun": 1,
    "queryEfficiency": 0
  },
  {
    "query": "SELECT tbl_name as name,\n                   (SELECT ncol FROM pragma_table_list(tbl_name)) as num_columns\n            FROM sqlite_master\n            WHERE TYPE = \"table\"\n              AND tbl_name NOT LIKE \"sqlite_%\"\n              AND tbl_name NOT LIKE \"d1_%\"\n              AND tbl_name NOT LIKE \"_cf_%\"\n            ORDER BY tbl_name ASC;",
    "avgRowsRead": 2,
    "totalRowsRead": 4,
    "avgRowsWritten": 0,
    "totalRowsWritten": 0,
    "avgDurationMs": 0.49505,
    "totalDurationMs": 0.9901,
    "numberOfTimesRun": 2,
    "queryEfficiency": 0
  }
]
```

Note

The quantity `queryEfficiency` measures how efficient your query was. It is calculated as: the number of rows returned divided by the number of rows read.

Generally, you should try to get `queryEfficiency` as close to `1` as possible. Refer to [Use indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/) for more information on efficient querying.
