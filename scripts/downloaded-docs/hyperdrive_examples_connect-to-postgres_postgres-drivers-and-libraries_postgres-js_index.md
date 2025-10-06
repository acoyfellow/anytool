---
title: Postgres.js · Cloudflare Hyperdrive docs
description: Postgres.js is a modern, fully-featured PostgreSQL driver for
  Node.js. This example demonstrates how to use Postgres.js with Cloudflare
  Hyperdrive in a Workers application.
lastUpdated: 2025-05-12T14:16:48.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/
  md: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/index.md
---

[Postgres.js](https://github.com/porsager/postgres) is a modern, fully-featured PostgreSQL driver for Node.js. This example demonstrates how to use Postgres.js with Cloudflare Hyperdrive in a Workers application.

Install [Postgres.js](https://github.com/porsager/postgres):

* npm

  ```sh
  npm i postgres@>3.4.5
  ```

* yarn

  ```sh
  yarn add postgres@>3.4.5
  ```

* pnpm

  ```sh
  pnpm add postgres@>3.4.5
  ```

Note

The minimum version of `postgres-js` required for Hyperdrive is `3.4.5`.

Add the required Node.js compatibility flags and Hyperdrive binding to your `wrangler.jsonc` file:

* wrangler.jsonc

  ```jsonc
  {
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "compatibility_date": "2024-09-23",
    "hyperdrive": [
      {
        "binding": "HYPERDRIVE",
        "id": "<your-hyperdrive-id-here>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  # required for database drivers to function
  compatibility_flags = ["nodejs_compat"]
  compatibility_date = "2024-09-23"


  [[hyperdrive]]
  binding = "HYPERDRIVE"
  id = "<your-hyperdrive-id-here>"
  ```

Create a Worker that connects to your PostgreSQL database via Hyperdrive:

```ts
// filepath: src/index.ts
import postgres from "postgres";


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Create a database client that connects to your database via Hyperdrive
    // using the Hyperdrive credentials
    const sql = postgres(env.HYPERDRIVE.connectionString, {
      // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
      max: 5,
      // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
      fetch_types: false,
    });


    try {
      // A very simple test query
      const result = await sql`select * from pg_tables`;


      // Return result rows as JSON
      return Response.json({ success: true, result: result });
    } catch (e: any) {
      console.error("Database error:", e.message);


      return Response.error();
    }
  },
} satisfies ExportedHandler<Env>;
```
