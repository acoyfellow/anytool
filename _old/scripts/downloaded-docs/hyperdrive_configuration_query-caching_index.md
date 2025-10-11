---
title: Query caching · Cloudflare Hyperdrive docs
description: Hyperdrive automatically caches all cacheable queries executed
  against your database when query caching is turned on, reducing the need to go
  back to your database (incurring latency and database load) for every query
  which can be especially useful for popular queries. Query caching is enabled
  by default.
lastUpdated: 2025-07-07T12:55:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/configuration/query-caching/
  md: https://developers.cloudflare.com/hyperdrive/configuration/query-caching/index.md
---

Hyperdrive automatically caches all cacheable queries executed against your database when query caching is turned on, reducing the need to go back to your database (incurring latency and database load) for every query which can be especially useful for popular queries. Query caching is enabled by default.

## What does Hyperdrive cache?

Because Hyperdrive uses database protocols, it can differentiate between a mutating query (a query that writes to the database) and a non-mutating query (a read-only query), allowing Hyperdrive to safely cache read-only queries.

Besides determining the difference between a `SELECT` and an `INSERT`, Hyperdrive also parses the database wire-protocol and uses it to differentiate between a mutating or non-mutating query.

For example, a read query that populates the front page of a news site would be cached:

* PostgreSQL

  ```sql
  -- Cacheable
  SELECT * FROM articles WHERE DATE(published_time) =
  CURRENT_DATE() ORDER BY published_time DESC LIMIT 50
  ```

* MySQL

  ```sql
  -- Cacheable
  SELECT * FROM articles WHERE DATE(published_time) =
  CURDATE() ORDER BY published_time DESC LIMIT 50
  ```

Mutating queries (including `INSERT`, `UPSERT`, or `CREATE TABLE`) and queries that use [functions designated as `volatile` by PostgreSQL](https://www.postgresql.org/docs/current/xfunc-volatility.html) are not cached:

* PostgreSQL

  ```sql
  -- Not cached
  INSERT INTO users(id, name, email) VALUES(555, 'Matt', 'hello@example.com');


  SELECT LASTVAL(), * FROM articles LIMIT 50;
  ```

* MySQL

  ```sql
  -- Not cached
  INSERT INTO users(id, name, email) VALUES(555, 'Thomas', 'hello@example.com');


  SELECT LAST_INSERT_ID(), * FROM articles LIMIT 50;
  ```

## Default cache settings

The default caching behaviour for Hyperdrive is defined as below:

* `max_age` = 60 seconds (1 minute)
* `stale_while_revalidate` = 15 seconds

The `max_age` setting determines the maximum lifetime a query response will be served from cache. Cached responses may be evicted from the cache prior to this time if they are rarely used.

The `stale_while_revalidate` setting allows Hyperdrive to continue serving stale cache results for an additional period of time while it is revalidating the cache. In most cases, revalidation should happen rapidly.

You can set a maximum `max_age` of 1 hour.

## Disable caching

Disable caching on a per-Hyperdrive basis by using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) CLI to set the `--caching-disabled` option to `true`.

For example:

```sh
# wrangler v3.11 and above required
npx wrangler hyperdrive update my-hyperdrive-id --origin-password my-db-password --caching-disabled true
```

You can also configure multiple Hyperdrive connections from a single application: one connection that enables caching for popular queries, and a second connection where you do not want to cache queries, but still benefit from Hyperdrive's latency benefits and connection pooling.

For example, using database drivers:

* PostgreSQL

  ```ts
  const client = postgres(env.HYPERDRIVE.connectionString);
  // ...
  const clientNoCache = postgres(env.HYPERDRIVE_CACHE_DISABLED.connectionString);
  ```

* MySQL

  ```ts
  const connection = createConnection({
      host: env.HYPERDRIVE.host,
      user: env.HYPERDRIVE.user,
      password: env.HYPERDRIVE.password,
      database: env.HYPERDRIVE.database,
      port: env.HYPERDRIVE.port
  });
  // ...
  const connectionNoCache = createConnection({
      host: env.HYPERDRIVE_CACHE_DISABLED.host,
      user: env.HYPERDRIVE_CACHE_DISABLED.user,
      password: env.HYPERDRIVE_CACHE_DISABLED.password,
      database: env.HYPERDRIVE_CACHE_DISABLED.database,
      port: env.HYPERDRIVE_CACHE_DISABLED.port
  });
  ```

The Wrangler configuration remains the same both for PostgreSQL and MySQL.

```jsonc
    {
      // Rest of file
      "hyperdrive": [
        {
          "binding": "HYPERDRIVE",
          "id": "<YOUR_HYPERDRIVE_CACHE_ENABLED_CONFIGURATION_ID>"
        },
        {
          "binding": "HYPERDRIVE_CACHE_DISABLED",
          "id": "<YOUR_HYPERDRIVE_CACHE_DISABLED_CONFIGURATION_ID>"
        }
      ]
    }
```

## Next steps

* Learn more about [How Hyperdrive works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
* Learn how to [Connect to PostgreSQL](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/) from Hyperdrive.
* Review [Troubleshooting common issues](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) when connecting a database to Hyperdrive.
