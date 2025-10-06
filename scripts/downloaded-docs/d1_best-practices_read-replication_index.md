---
title: Global read replication · Cloudflare D1 docs
description: D1 read replication can lower latency for read queries and scale
  read throughput by adding read-only database copies, called read replicas,
  across regions globally closer to clients.
lastUpdated: 2025-09-08T09:38:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/best-practices/read-replication/
  md: https://developers.cloudflare.com/d1/best-practices/read-replication/index.md
---

D1 read replication can lower latency for read queries and scale read throughput by adding read-only database copies, called read replicas, across regions globally closer to clients.

To use read replication, you must use the [D1 Sessions API](https://developers.cloudflare.com/d1/worker-api/d1-database/#withsession), otherwise all queries will continue to be executed only by the primary database.

A session encapsulates all the queries from one logical session for your application. For example, a session may correspond to all queries coming from a particular web browser session. All queries within a session read from a database instance which is as up-to-date as your query needs it to be. Sessions API ensures [sequential consistency](https://developers.cloudflare.com/d1/best-practices/read-replication/#replica-lag-and-consistency-model) for all queries in a session.

To checkout D1 read replication, deploy the following Worker code using Sessions API, which will prompt you to create a D1 database and enable read replication on said database.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api-template)

Tip: Place your database further away for the read replication demo

To simulate how read replication can improve a worst case latency scenario, set your D1 database location hint to be in a farther away region. For example, if you are in Europe create your database in Western North America (WNAM).

* JavaScript

  ```js
  export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);


      // A. Create the Session.
      // When we create a D1 Session, we can continue where we left off from a previous
      // Session if we have that Session's last bookmark or use a constraint.
      const bookmark =
        request.headers.get("x-d1-bookmark") ?? "first-unconstrained";
      const session = env.DB01.withSession(bookmark);


      try {
        // Use this Session for all our Workers' routes.
        const response = await withTablesInitialized(
          request,
          session,
          handleRequest,
        );


        // B. Return the bookmark so we can continue the Session in another request.
        response.headers.set("x-d1-bookmark", session.getBookmark() ?? "");


        return response;
      } catch (e) {
        console.error({
          message: "Failed to handle request",
          error: String(e),
          errorProps: e,
          url,
          bookmark,
        });
        return Response.json(
          { error: String(e), errorDetails: e },
          { status: 500 },
        );
      }
    },
  };
  ```

* TypeScript

  ```ts
  export default {
    async fetch(request, env, ctx): Promise<Response> {
      const url = new URL(request.url);


      // A. Create the Session.
      // When we create a D1 Session, we can continue where we left off from a previous
      // Session if we have that Session's last bookmark or use a constraint.
      const bookmark =
        request.headers.get("x-d1-bookmark") ?? "first-unconstrained";
      const session = env.DB01.withSession(bookmark);


      try {
        // Use this Session for all our Workers' routes.
        const response = await withTablesInitialized(
          request,
          session,
          handleRequest,
        );


        // B. Return the bookmark so we can continue the Session in another request.
        response.headers.set("x-d1-bookmark", session.getBookmark() ?? "");


        return response;
      } catch (e) {
        console.error({
          message: "Failed to handle request",
          error: String(e),
          errorProps: e,
          url,
          bookmark,
        });
        return Response.json(
          { error: String(e), errorDetails: e },
          { status: 500 },
        );
      }
    },
  } satisfies ExportedHandler<Env>;
  ```

## Primary database instance vs read replicas

![D1 read replication concept](https://developers.cloudflare.com/images/d1/d1-read-replication-concept.png)

When using D1 without read replication, D1 routes all queries (both read and write) to a specific database instance in [one location in the world](https://developers.cloudflare.com/d1/configuration/data-location/), known as the primary database instance . D1 request latency is dependent on the physical proximity of a user to the primary database instance. Users located further away from the primary database instance experience longer request latency due to [network round-trip time](https://www.cloudflare.com/learning/cdn/glossary/round-trip-time-rtt/).

When using read replication, D1 creates multiple asynchronously replicated copies of the primary database instance, which only serve read requests, called read replicas . D1 creates the read replicas in [multiple regions](https://developers.cloudflare.com/d1/best-practices/read-replication/#read-replica-locations) throughout the world across Cloudflare's network.

Even though a user may be located far away from the primary database instance, they could be close to a read replica. When D1 routes read requests to the read replica instead of the primary database instance, the user enjoys faster responses for their read queries.

D1 asynchronously replicates changes from the primary database instance to all read replicas. This means that at any given time, a read replica may be arbitrarily out of date. The time it takes for the latest committed data in the primary database instance to be replicated to the read replica is known as the replica lag . Replica lag and non-deterministic routing to individual replicas can lead to application data consistency issues. The D1 Sessions API solves this by ensuring sequential consistency. For more information, refer to [replica lag and consistency model](https://developers.cloudflare.com/d1/best-practices/read-replication/#replica-lag-and-consistency-model).

Note

All write queries are still forwarded to the primary database instance. Read replication only improves the response time for read query requests.

| Type of database instance | Description | How it handles write queries | How it handles read queries |
| - | - | - | - |
| Primary database instance | The database instance containing the “original” copy of the database | Can serve write queries | Can serve read queries |
| Read replica database instance | A database instance containing a copy of the original database which asynchronously receives updates from the primary database instance | Forwards any write queries to the primary database instance | Can serve read queries using its own copy of the database |

## Benefits of read replication

A system with multiple read replicas located around the world improves the performance of databases:

* The query latency decreases for users located close to the read replicas. By shortening the physical distance between a the database instance and the user, read query latency decreases, resulting in a faster application.
* The read throughput increases by distributing load across multiple replicas. Since multiple database instances are able to serve read-only requests, your application can serve a larger number of queries at any given time.

## Use Sessions API

By using [Sessions API](https://developers.cloudflare.com/d1/worker-api/d1-database/#withsession) for read replication, all of your queries from a single session read from a version of the database which ensures sequential consistency. This ensures that the version of the database you are reading is logically consistent even if the queries are handled by different read replicas.

D1 read replication achieves this by attaching a bookmark to each query within a session. For more information, refer to [Bookmarks](https://developers.cloudflare.com/d1/reference/time-travel/#bookmarks).

### Enable read replication

Read replication can be enabled at the database level in the Cloudflare dashboard. Check **Settings** for your D1 database to view if read replication is enabled.

1. In the Cloudflare dashboard, go to the **D1** page.

   [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

2. Select an existing database > **Settings** > **Enable Read Replication**.

### Start a session without constraints

To create a session from any available database version, use `withSession()` without any parameters, which will route the first query to any database instance, either the primary database instance or a read replica.

```ts
const session = env.DB.withSession() // synchronous
// query executes on either primary database or a read replica
const result = await session
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run()
```

* `withSession()` is the same as `withSession("first-unconstrained")`
* This approach is best when your application does not require the latest database version. All queries in a session ensure sequential consistency.
* Refer to the [D1 Workers Binding API documentation](https://developers.cloudflare.com/d1/worker-api/d1-database#withsession).

### Start a session with all latest data

To create a session from the latest database version, use `withSession("first-primary")`, which will route the first query to the primary database instance.

```ts
const session = env.DB.withSession(`first-primary`) // synchronous
// query executes on primary database
const result = await session
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run()
```

* This approach is best when your application requires the latest database version. All queries in a session ensure sequential consistency.
* Refer to the [D1 Workers Binding API documentation](https://developers.cloudflare.com/d1/worker-api/d1-database#withsession).

### Start a session from previous context (bookmark)

To create a new session from the context of a previous session, pass a `bookmark` parameter to guarantee that the session starts with a database version that is at least as up-to-date as the provided `bookmark`.

```ts
// retrieve bookmark from previous session stored in HTTP header
const bookmark = request.headers.get('x-d1-bookmark') ?? 'first-unconstrained';


const session = env.DB.withSession(bookmark)
const result = await session
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run()
// store bookmark for a future session
response.headers.set('x-d1-bookmark', session.getBookmark() ?? "")
```

* Starting a session with a `bookmark` ensures the new session will be at least as up-to-date as the previous session that generated the given `bookmark`.
* Refer to the [D1 Workers Binding API documentation](https://developers.cloudflare.com/d1/worker-api/d1-database#withsession).

### Check where D1 request was processed

To see how D1 requests are processed by the addition of read replicas, `served_by_region` and `served_by_primary` fields are returned in the `meta` object of [D1 Result](https://developers.cloudflare.com/d1/worker-api/return-object/#d1result).

```ts
const result = await env.DB.withSession()
  .prepare(`SELECT * FROM Customers WHERE CompanyName = 'Bs Beverages'`)
  .run();
console.log({
  servedByRegion: result.meta.served_by_region ?? "",
  servedByPrimary: result.meta.served_by_primary ?? "",
});
```

* `served_by_region` and `served_by_primary` fields are present for all D1 remote requests, regardless of whether read replication is enabled or if the Sessions API is used. On local development, `npx wrangler dev`, these fields are `undefined`.

### Enable read replication via REST API

With the REST API, set `read_replication.mode: auto` to enable read replication on a D1 database.

For this REST endpoint, you need to have an API token with `D1:Edit` permission. If you do not have an API token, follow the guide: [Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

* cURL

  ```sh
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"read_replication": {"mode": "auto"}}'
  ```

* TypeScript

  ```ts
  const headers = new Headers({
    "Authorization": `Bearer ${TOKEN}`
  });


  await fetch ("/v4/accounts/{account_id}/d1/database/{database_id}", {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(
      { "read_replication": { "mode": "auto" } }
    )
   }
  )
  ```

### Disable read replication via REST API

With the REST API, set `read_replication.mode: disabled` to disable read replication on a D1 database.

For this REST endpoint, you need to have an API token with `D1:Edit` permission. If you do not have an API token, follow the guide: [Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

Note

Disabling read replication takes up to 24 hours for replicas to stop processing requests. Sessions API works with databases that do not have read replication enabled, so it is safe to run code with Sessions API even after disabling read replication.

* cURL

  ```sh
  curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"read_replication": {"mode": "disabled"}}'
  ```

* TypeScript

  ```ts
  const headers = new Headers({
    "Authorization": `Bearer ${TOKEN}`
  });


  await fetch ("/v4/accounts/{account_id}/d1/database/{database_id}", {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(
      { "read_replication": { "mode": "disabled" } }
    )
   }
  )
  ```

### Check if read replication is enabled

On the Cloudflare dashboard, check **Settings** for your D1 database to view if read replication is enabled.

Alternatively, `GET` D1 database REST endpoint returns if read replication is enabled or disabled.

For this REST endpoint, you need to have an API token with `D1:Read` permission. If you do not have an API token, follow the guide: [Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

* cURL

  ```sh
  curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}" \
    -H "Authorization: Bearer $TOKEN"
  ```

* TypeScript

  ```ts
  const headers = new Headers({
    "Authorization": `Bearer ${TOKEN}`
  });


  const response = await fetch("/v4/accounts/{account_id}/d1/database/{database_id}", {
    method: "GET",
    headers: headers
  });


  const data = await response.json();
  console.log(data.read_replication.mode);
  ```

- Check the `read_replication` property of the `result` object

  * `"mode": "auto"` indicates read replication is enabled
  * `"mode": "disabled"` indicates read replication is disabled

## Read replica locations

Currently, D1 automatically creates a read replica in [every supported region](https://developers.cloudflare.com/d1/configuration/data-location/#available-location-hints), including the region where the primary database instance is located. These regions are:

* ENAM
* WNAM
* WEUR
* EEUR
* APAC
* OC

Note

Read replica locations are subject to change at Cloudflare's discretion.

## Observability

To see the impact of read replication and check the how D1 requests are processed by additional database instances, you can use:

* The `meta` object within the [`D1Result`](https://developers.cloudflare.com/d1/worker-api/return-object/#d1result) return object, which includes new fields:

  * `served_by_region`
  * `served_by_primary`

* The Cloudflare dashboard, where you can view your database metrics breakdown by region that processed D1 requests.

## Pricing

D1 read replication is built into D1, so you don’t pay extra storage or compute costs for read replicas. You incur the exact same D1 [usage billing](https://developers.cloudflare.com/d1/platform/pricing/#billing-metrics) with or without replicas, based on `rows_read` and `rows_written` by your queries.

## Known limitations

There are some known limitations for D1 read replication.

* Sessions API is only available via the [D1 Worker Binding](https://developers.cloudflare.com/d1/worker-api/d1-database/#withsession) and not yet available via the REST API.

## Background information

### Replica lag and consistency model

To account for replica lag, it is important to consider the consistency model for D1. A consistency model is a logical framework that governs how a database system serves user queries (how the data is updated and accessed) when there are multiple database instances. Different models can be useful in different use cases. Most database systems provide [read committed](https://jepsen.io/consistency/models/read-committed), [snapshot isolation](https://jepsen.io/consistency/models/snapshot-isolation), or [serializable](https://jepsen.io/consistency/models/serializable) consistency models, depending on their configuration.

#### Without Sessions API

Consider what could happen in a distributed database system.

![Distributed replicas could cause inconsistencies without Sessions API](https://developers.cloudflare.com/images/d1/consistency-without-sessions-api.png)

1. Your SQL write query is processed by the primary database instance.
2. You obtain a response acknowledging the write query.
3. Your subsequent SQL read query goes to a read replica.
4. The read replica has not yet been updated, so does not contain changes from your SQL write query. The returned results are inconsistent from your perspective.

#### With Sessions API

When using D1 Sessions API, your queries obtain bookmarks which allows the read replica to only serve sequentially consistent data.

![D1 offers sequential consistency when using Sessions API](https://developers.cloudflare.com/images/d1/consistency-with-sessions-api.png)

1. SQL write query is processed by the primary database instance.
2. You obtain a response acknowledging the write query. You also obtain a bookmark (100) which identifies the state of the database after the write query.
3. Your subsequent SQL read query goes to a read replica, and also provides the bookmark (100).
4. The read replica will wait until it has been updated to be at least as up-to-date as the provided bookmark (100).
5. Once the read replica has been updated (bookmark 104), it serves your read query, which is now sequentially consistent.

In the diagram, the returned bookmark is bookmark 104, which is different from the one provided in your read query (bookmark 100). This can happen if there were other writes from other client requests that also got replicated to the read replica in between the two write/read queries you executed.

#### Sessions API provides sequential consistency

D1 read replication offers [sequential consistency](https://jepsen.io/consistency/models/sequential). D1 creates a global order of all operations which have taken place on the database, and can identify the latest version of the database that a query has seen, using [bookmarks](https://developers.cloudflare.com/d1/reference/time-travel/#bookmarks). It then serves the query with a database instance that is at least as up-to-date as the bookmark passed along with the query to execute.

Sequential consistency has properties such as:

* **Monotonic reads**: If you perform two reads one after the other (read-1, then read-2), read-2 cannot read a version of the database prior to read-1.
* **Monotonic writes**: If you perform write-1 then write-2, all processes observe write-1 before write-2.
* **Writes follow reads**: If you read a value, then perform a write, the subsequent write must be based on the value that was just read.
* **Read my own writes**: If you write to the database, all subsequent reads will see the write.

## Supplementary information

You may wish to refer to the following resources:

* Blog: [Sequential consistency without borders: How D1 implements global read replication](https://blog.cloudflare.com/d1-read-replication-beta/)
* Blog: [Building D1: a Global Database](https://blog.cloudflare.com/building-d1-a-global-database/)
* [D1 Sessions API documentation](https://developers.cloudflare.com/d1/worker-api/d1-database#withsession)
* [Starter code for D1 Sessions API demo](https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api-template)
* [E-commerce store read replication tutorial](https://developers.cloudflare.com/d1/tutorials/using-read-replication-for-e-com)
