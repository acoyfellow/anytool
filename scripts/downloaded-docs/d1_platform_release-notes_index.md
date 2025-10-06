---
title: Release notes · Cloudflare D1 docs
description: Subscribe to RSS
lastUpdated: 2025-07-23T15:37:48.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/platform/release-notes/
  md: https://developers.cloudflare.com/d1/platform/release-notes/index.md
---

[Subscribe to RSS](https://developers.cloudflare.com/d1/platform/release-notes/index.xml)

## 2025-09-11

**D1 automatically retries read-only queries**

D1 now detects read-only queries and automatically attempts up to two retries to execute those queries in the event of failures with retryable errors. You can access the number of execution attempts in the returned [response metadata](https://developers.cloudflare.com/d1/worker-api/return-object/#d1result) property `total_attempts`.

At the moment, only read-only queries are retried, that is, queries containing only the following SQLite keywords: `SELECT`, `EXPLAIN`, `WITH`. Queries containing any [SQLite keyword](https://sqlite.org/lang_keywords.html) that leads to database writes are not retried.

The retry success ratio among read-only retryable errors varies from 5% all the way up to 95%, depending on the underlying error and its duration (like network errors or other internal errors).

The retry success ratio among all retryable errors is lower, indicating that there are write-queries that could be retried. Therefore, we recommend D1 users to continue applying [retries in their own code](https://developers.cloudflare.com/d1/best-practices/retry-queries/) for queries that are not read-only but are idempotent according to the business logic of the application.

![D1 automatically query retries success ratio](https://developers.cloudflare.com/_astro/d1-auto-retry-success-ratio.yPw8B0tB_Z1kzKe0.webp)

D1 ensures that any retry attempt does not cause database writes, making the automatic retries safe from side-effects, even if a query causing changes slips through the read-only detection. D1 achieves this by checking for modifications after every query execution, and if any write occurred due to a retry attempt, the query is rolled back.

The read-only query detection heuristics are simple for now, and there is room for improvement to capture more cases of queries that can be retried, so this is just the beginning.

## 2025-07-01

**Maximum D1 storage per account for the Workers paid plan is now 1 TB**

The maximum D1 storage per account for users on the Workers paid plan has been increased from 250 GB to 1 TB.

## 2025-07-01

**D1 alpha database backup access removed**

Following the removal of query access to D1 alpha databases on [2024-08-23](https://developers.cloudflare.com/d1/platform/release-notes/#2024-08-23), D1 alpha database backups can no longer be accessed or created with [`wrangler d1 backup`](https://developers.cloudflare.com/d1/reference/backups/), available with wrangler v3.

If you want to retain a backup of your D1 alpha database, please use `wrangler d1 backup` before 2025-07-01. A D1 alpha backup can be used to [migrate](https://developers.cloudflare.com/d1/platform/alpha-migration/#5-create-a-new-d1-database) to a newly created D1 database in its generally available state.

## 2025-05-30

**50-500ms Faster D1 REST API Requests**

Users using Cloudflare's [REST API](https://developers.cloudflare.com/api/resources/d1/) to query their D1 database can see lower end-to-end request latency now that D1 authentication is performed at the closest Cloudflare network data center that received the request. Previously, authentication required D1 REST API requests to proxy to Cloudflare's core, centralized data centers, which added network round trips and latency.

Latency improvements range from 50-500 ms depending on request location and [database location](https://developers.cloudflare.com/d1/configuration/data-location/) and only apply to the REST API. REST API requests and databases outside the United States see a bigger benefit since Cloudflare's primary core data centers reside in the United States.

D1 query endpoints like `/query` and `/raw` have the most noticeable improvements since they no longer access Cloudflare's core data centers. D1 control plane endpoints such as those to create and delete databases see smaller improvements, since they still require access to Cloudflare's core data centers for other control plane metadata.

## 2025-05-02

**D1 HTTP API permissions bug fix**

A permissions bug that allowed Cloudflare account and user [API tokens](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/) with `D1:Read` permission and `Edit` permission on another Cloudflare product to perform D1 database writes is fixed. `D1:Edit` permission is required for any database writes via HTTP API.

If you were using an existing API token without `D1:Edit` permission to make edits to a D1 database via the HTTP API, then you will need to [create or edit API tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) to explicitly include `D1:Edit` permission.

## 2025-04-10

**D1 Read Replication Public Beta**

D1 read replication is available in public beta to help lower average latency and increase overall throughput for read-heavy applications like e-commerce websites or content management tools.

Workers can leverage read-only database copies, called read replicas, by using D1 [Sessions API](https://developers.cloudflare.com/d1/best-practices/read-replication). A session encapsulates all the queries from one logical session for your application. For example, a session may correspond to all queries coming from a particular web browser session. With Sessions API, D1 queries in a session are guaranteed to be [sequentially consistent](https://developers.cloudflare.com/d1/best-practices/read-replication/#replica-lag-and-consistency-model) to avoid data consistency pitfalls. D1 [bookmarks](https://developers.cloudflare.com/d1/reference/time-travel/#bookmarks) can be used from a previous session to ensure logical consistency between sessions.

```ts
// retrieve bookmark from previous session stored in HTTP header
const bookmark = request.headers.get("x-d1-bookmark") ?? "first-unconstrained";

const session = env.DB.withSession(bookmark);
const result = await session
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run();
// store bookmark for a future session
response.headers.set("x-d1-bookmark", session.getBookmark() ?? "");
```

Read replicas are automatically created by Cloudflare (currently one in each supported [D1 region](https://developers.cloudflare.com/d1/best-practices/read-replication/#read-replica-locations)), are active/inactive based on query traffic, and are transparently routed to by Cloudflare at no additional cost.

To checkout D1 read replication, deploy the following Worker code using Sessions API, which will prompt you to create a D1 database and enable read replication on said database.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api)

To learn more about how read replication was implemented, go to our [blog post](https://blog.cloudflare.com/d1-read-replication-beta).

## 2025-02-19

**D1 supports \`PRAGMA optimize\`**

D1 now supports `PRAGMA optimize` command, which can improve database query performance. It is recommended to run this command after a schema change (for example, after creating an index). Refer to [`PRAGMA optimize`](https://developers.cloudflare.com/d1/sql-api/sql-statements/#pragma-optimize) for more information.

## 2025-02-04

**Fixed bug with D1 read-only access via UI and /query REST API.**

Fixed a bug with D1 permissions which allowed users with read-only roles via the UI and users with read-only API tokens via the `/query` [REST API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) to execute queries that modified databases. UI actions via the `Tables` tab, such as creating and deleting tables, were incorrectly allowed with read-only access. However, UI actions via the `Console` tab were not affected by this bug and correctly required write access.

Write queries with read-only access will now fail. If you relied on the previous incorrect behavior, please assign the correct roles to users or permissions to API tokens to perform D1 write queries.

## 2025-01-13

**D1 will begin enforcing its free tier limits from the 10th of February 2025.**

D1 will begin enforcing the daily [free tier limits](https://developers.cloudflare.com/d1/platform/limits) from 2025-02-10. These limits only apply to accounts on the Workers Free plan.

From 2025-02-10, if you do not take any action and exceed the daily free tier limits, queries to D1 databases via the Workers API and/or REST API will return errors until limits reset daily at 00:00 UTC.

To ensure uninterrupted service, upgrade your account to the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) from the [plans page](https://dash.cloudflare.com/?account=/workers/plans). The minimum monthly billing amount is $5. Refer to [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) and [D1 limits](https://developers.cloudflare.com/d1/platform/limits/).

For better insight into your current usage, refer to your [billing metrics](https://developers.cloudflare.com/d1/observability/billing/) for rows read and rows written, which can be found on the [D1 dashboard](https://dash.cloudflare.com/?account=/workers/d1) or GraphQL API.

## 2025-01-07

**D1 Worker API request latency decreases by 40-60%.**

D1 lowered end-to-end Worker API request latency by 40-60% by eliminating redundant network round trips for each request.

![D1 Worker API latency](https://developers.cloudflare.com/images/d1/faster-d1-worker-api.png)

*p50, p90, and p95 request latency aggregated across entire D1 service. These latencies are a reference point and should not be viewed as your exact workload improvement.*

For each request to a D1 database, at least two network round trips were eliminated. One round trip was due to a bug that is now fixed. The remaining removed round trips are due to avoiding creating a new TCP connection for each request when reaching out to the datacenter hosting the database.

The removal of redundant network round trips also applies to D1's [REST API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/). However, the REST API still depends on Cloudflare's centralized datacenters for authentication, which reduces the relative performance improvement.

## 2024-08-23

**D1 alpha databases have stopped accepting SQL queries**

Following the [deprecation warning](https://developers.cloudflare.com/d1/platform/release-notes/#2024-04-30) on 2024-04-30, D1 alpha databases have stopped accepting queries (you are still able to create and retrieve backups).

Requests to D1 alpha databases now respond with a HTTP 400 error, containing the following text:

`You can no longer query a D1 alpha database. Please follow https://developers.cloudflare.com/d1/platform/alpha-migration/ to migrate your alpha database and resume querying.`

You can upgrade to the new, generally available version of D1 by following the [alpha database migration guide](https://developers.cloudflare.com/d1/platform/alpha-migration/).

## 2024-07-26

**Fixed bug in TypeScript typings for run() API**

The `run()` method as part of the [D1 Client API](https://developers.cloudflare.com/d1/worker-api/) had an incorrect (outdated) type definition, which has now been addressed as of [`@cloudflare/workers-types`](https://www.npmjs.com/package/@cloudflare/workers-types) version `4.20240725.0`.

The correct type definition is `stmt.run<T>(): D1Result`, as `run()` returns the result rows of the query. The previously *incorrect* type definition was `stmt.run(): D1Response`, which only returns query metadata and no results.

## 2024-06-17

**HTTP API now returns a HTTP 429 error for overloaded D1 databases**

Previously, D1's [HTTP API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) returned a HTTP `500 Internal Server` error for queries that came in while a D1 database was overloaded. These requests now correctly return a `HTTP 429 Too Many Requests` error.

D1's [Workers API](https://developers.cloudflare.com/d1/worker-api/) is unaffected by this change.

## 2024-04-30

**D1 alpha databases will stop accepting live SQL queries on August 15, 2024**

Previously [deprecated alpha](https://developers.cloudflare.com/d1/platform/release-notes/#2024-04-05) D1 databases need to be migrated by August 15, 2024 to accept new queries.

Refer to [alpha database migration guide](https://developers.cloudflare.com/d1/platform/alpha-migration/) to migrate to the new, generally available, database architecture.

## 2024-04-12

**HTTP API now returns a HTTP 400 error for invalid queries**

Previously, D1's [HTTP API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) returned a HTTP `500 Internal Server` error for an invalid query. An invalid SQL query now correctly returns a `HTTP 400 Bad Request` error.

D1's [Workers API](https://developers.cloudflare.com/d1/worker-api/) is unaffected by this change.

## 2024-04-05

**D1 alpha databases are deprecated**

Now that D1 is generally available and production ready, alpha D1 databases are deprecated and should be migrated for better performance, reliability, and ongoing support.

Refer to [alpha database migration guide](https://developers.cloudflare.com/d1/platform/alpha-migration/) to migrate to the new, generally available, database architecture.

## 2024-04-01

**D1 is generally available**

D1 is now generally available and production ready. Read the [blog post](https://blog.cloudflare.com/building-d1-a-global-database/) for more details on new features in GA and to learn more about the upcoming D1 read replication API.

* Developers with a Workers Paid plan now have a 10GB GB per-database limit (up from 2GB), which can be combined with existing limit of 50,000 databases per account.
* Developers with a Workers Free plan retain the 500 MB per-database limit and can create up to 10 databases per account.
* D1 databases can be [exported](https://developers.cloudflare.com/d1/best-practices/import-export-data/#export-an-existing-d1-database) as a SQL file.

## 2024-03-12

**Change in \`wrangler d1 execute\` default**

As of `wrangler@3.33.0`, `wrangler d1 execute` and `wrangler d1 migrations apply` now default to using a local database, to match the default behavior of `wrangler dev`.

It is also now possible to specify one of `--local` or `--remote` to explicitly tell wrangler which environment you wish to run your commands against.

## 2024-03-05

**Billing for D1 usage**

As of 2024-03-05, D1 usage will start to be counted and may incur charges for an account's future billing cycle.

Developers on the Workers Paid plan with D1 usage beyond [included limits](https://developers.cloudflare.com/d1/platform/pricing/#billing-metrics) will incur charges according to [D1's pricing](https://developers.cloudflare.com/d1/platform/pricing).

Developers on the Workers Free plan can use up to the included limits. Usage beyond the limits below requires signing up for the $5/month Workers Paid plan.

Account billable metrics are available in the [Cloudflare Dashboard](https://dash.cloudflare.com) and [GraphQL API](https://developers.cloudflare.com/d1/observability/metrics-analytics/#metrics).

## 2024-02-16

**API changes to \`run()\`**

A previous change (made on 2024-02-13) to the `run()` [query statement method](https://developers.cloudflare.com/d1/worker-api/prepared-statements/#run) has been reverted.

`run()` now returns a `D1Result`, including the result rows, matching its original behavior prior to the change on 2024-02-13.

Future change to `run()` to return a [`D1ExecResult`](https://developers.cloudflare.com/d1/worker-api/return-object/#d1execresult), as originally intended and documented, will be gated behind a [compatibility date](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) as to avoid breaking existing Workers relying on the way `run()` currently works.

## 2024-02-13

**API changes to \`raw()\`, \`all()\` and \`run()\`**

D1's `raw()`, `all()` and `run()` [query statement methods](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) have been updated to reflect their intended behavior and improve compatibility with ORM libraries.

`raw()` now correctly returns results as an array of arrays, allowing the correct handling of duplicate column names (such as when joining tables), as compared to `all()`, which is unchanged and returns an array of objects. To include an array of column names in the results when using `raw()`, use `raw({columnNames: true})`.

`run()` no longer incorrectly returns a `D1Result` and instead returns a [`D1ExecResult`](https://developers.cloudflare.com/d1/worker-api/return-object/#d1execresult) as originally intended and documented.

This may be a breaking change for some applications that expected `raw()` to return an array of objects.

Refer to [D1 client API](https://developers.cloudflare.com/d1/worker-api/) to review D1's query methods, return types and TypeScript support in detail.

## 2024-01-18

**Support for LIMIT on UPDATE and DELETE statements**

D1 now supports adding a `LIMIT` clause to `UPDATE` and `DELETE` statements, which allows you to limit the impact of a potentially dangerous operation.

## 2023-12-18

**Legacy alpha automated backups disabled**

Databases using D1's legacy alpha backend will no longer run automated [hourly backups](https://developers.cloudflare.com/d1/reference/backups/). You may still choose to take manual backups of these databases.

The D1 team recommends moving to D1's new [production backend](https://developers.cloudflare.com/d1/platform/release-notes/#2023-09-28), which will require you to export and import your existing data. D1's production backend is faster than the original alpha backend. The new backend also supports [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), which allows you to restore your database to any minute in the past 30 days without relying on hourly or manual snapshots.

## 2023-10-03

**Create up to 50,000 D1 databases**

Developers using D1 on a Workers Paid plan can now create up to 50,000 databases as part of ongoing increases to D1's limits.

* This further enables database-per-user use-cases and allows you to isolate data between customers.
* Total storage per account is now 50 GB.
* D1's [analytics and metrics](https://developers.cloudflare.com/d1/observability/metrics-analytics/) provide per-database usage data.

If you need to create more than 50,000 databases or need more per-account storage, [reach out](https://developers.cloudflare.com/d1/platform/limits/) to the D1 team to discuss.

## 2023-09-28

**The D1 public beta is here**

D1 is now in public beta, and storage limits have been increased:

* Developers with a Workers Paid plan now have a 2 GB per-database limit (up from 500 MB) and can create 25 databases per account (up from 10). These limits will continue to increase automatically during the public beta.
* Developers with a Workers Free plan retain the 500 MB per-database limit and can create up to 10 databases per account.

Databases must be using D1's [new storage subsystem](https://developers.cloudflare.com/d1/platform/release-notes/#2023-07-27) to benefit from the increased database limits.

Read the [announcement blog](https://blog.cloudflare.com/d1-open-beta-is-here/) for more details about what is new in the beta and what is coming in the future for D1.

## 2023-08-19

**Row count now returned per query**

D1 now returns a count of `rows_written` and `rows_read` for every query executed, allowing you to assess the cost of query for both [pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [index optimization](https://developers.cloudflare.com/d1/best-practices/use-indexes/) purposes.

The `meta` object returned in [D1's Client API](https://developers.cloudflare.com/d1/worker-api/return-object/#d1result) contains a total count of the rows read (`rows_read`) and rows written (`rows_written`) by that query. For example, a query that performs a full table scan (for example, `SELECT * FROM users`) from a table with 5000 rows would return a `rows_read` value of `5000`:

```json
"meta": {
  "duration": 0.20472300052642825,
  "size_after": 45137920,
  "rows_read": 5000,
  "rows_written": 0
}
```

Refer to [D1 pricing documentation](https://developers.cloudflare.com/d1/platform/pricing/) to understand how reads and writes are measured. D1 remains free to use during the alpha period.

## 2023-08-09

**Bind D1 from the Cloudflare dashboard**

You can now [bind a D1 database](https://developers.cloudflare.com/d1/get-started/#3-bind-your-worker-to-your-d1-database) to your Workers directly in the [Cloudflare dashboard](https://dash.cloudflare.com). To bind D1 from the Cloudflare dashboard, select your Worker project -> **Settings** -> **Variables** -> and select **D1 Database Bindings**.

Note: If you have previously deployed a Worker with a D1 database binding with a version of `wrangler` prior to `3.5.0`, you must upgrade to [`wrangler v3.5.0`](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%403.5.0) first before you can edit your D1 database bindings in the Cloudflare dashboard. New Workers projects do not have this limitation.

Legacy D1 alpha users who had previously prefixed their database binding manually with `__D1_BETA__` should remove this as part of this upgrade. Your Worker scripts should call your D1 database via `env.BINDING_NAME` only. Refer to the latest [D1 getting started guide](https://developers.cloudflare.com/d1/get-started/#3-bind-your-worker-to-your-d1-database) for best practices.

We recommend all D1 alpha users begin using wrangler `3.5.0` (or later) to benefit from improved TypeScript types and future D1 API improvements.

## 2023-08-01

**Per-database limit now 500 MB**

Databases using D1's [new storage subsystem](https://developers.cloudflare.com/d1/platform/release-notes/#2023-07-27) can now grow to 500 MB each, up from the previous 100 MB limit. This applies to both existing and newly created databases.

Refer to [Limits](https://developers.cloudflare.com/d1/platform/limits/) to learn about D1's limits.

## 2023-07-27

**New default storage subsystem**

Databases created via the Cloudflare dashboard and Wrangler (as of `v3.4.0`) now use D1's new storage subsystem by default. The new backend can [be 6 - 20x faster](https://blog.cloudflare.com/d1-turning-it-up-to-11/) than D1's original alpha backend.

To understand which storage subsystem your database uses, run `wrangler d1 info YOUR_DATABASE` and inspect the version field in the output.

Databases with `version: beta` use the new storage backend and support the [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) API. Databases with `version: alpha` only use D1's older, legacy backend.

## 2023-07-27

**Time Travel**

[Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) is now available. Time Travel allows you to restore a D1 database back to any minute within the last 30 days (Workers Paid plan) or 7 days (Workers Free plan), at no additional cost for storage or restore operations.

Refer to the [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) documentation to learn how to travel backwards in time.

Databases using D1's [new storage subsystem](https://blog.cloudflare.com/d1-turning-it-up-to-11/) can use Time Travel. Time Travel replaces the [snapshot-based backups](https://developers.cloudflare.com/d1/reference/backups/) used for legacy alpha databases.

## 2023-06-28

**Metrics and analytics**

You can now view [per-database metrics](https://developers.cloudflare.com/d1/observability/metrics-analytics/) via both the [Cloudflare dashboard](https://dash.cloudflare.com/) and the [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/).

D1 currently exposes read & writes per second, query response size, and query latency percentiles.

## 2023-06-16

**Generated columns documentation**

New documentation has been published on how to use D1's support for [generated columns](https://developers.cloudflare.com/d1/reference/generated-columns/) to define columns that are dynamically generated on write (or read). Generated columns allow you to extract data from [JSON objects](https://developers.cloudflare.com/d1/sql-api/query-json/) or use the output of other SQL functions.

## 2023-06-12

**Deprecating Error.cause**

As of [`wrangler v3.1.1`](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%403.1.1) the [D1 client API](https://developers.cloudflare.com/d1/worker-api/) now returns [detailed error messages](https://developers.cloudflare.com/d1/observability/debug-d1/) within the top-level `Error.message` property, and no longer requires developers to inspect the `Error.cause.message` property.

To facilitate a transition from the previous `Error.cause` behaviour, detailed error messages will continue to be populated within `Error.cause` as well as the top-level `Error` object until approximately July 14th, 2023. Future versions of both `wrangler` and the D1 client API will no longer populate `Error.cause` after this date.

## 2023-05-19

**New experimental backend**

D1 has a new experimental storage back end that dramatically improves query throughput, latency and reliability. The experimental back end will become the default back end in the near future. To create a database using the experimental backend, use `wrangler` and set the `--experimental-backend` flag when creating a database:

```sh
$ wrangler d1 create your-database --experimental-backend
```

Read more about the experimental back end in the [announcement blog](https://blog.cloudflare.com/d1-turning-it-up-to-11/).

## 2023-05-19

**Location hints**

You can now provide a [location hint](https://developers.cloudflare.com/d1/configuration/data-location/) when creating a D1 database, which will influence where the leader (writer) is located. By default, D1 will automatically create your database in a location close to where you issued the request to create a database. In most cases this allows D1 to choose the optimal location for your database on your behalf.

## 2023-05-17

**Query JSON**

[New documentation](https://developers.cloudflare.com/d1/sql-api/query-json/) has been published that covers D1's extensive JSON function support. JSON functions allow you to parse, query and modify JSON directly from your SQL queries, reducing the number of round trips to your database, or data queried.
