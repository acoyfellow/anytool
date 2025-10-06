---
title: node-postgres (pg) · Cloudflare Hyperdrive docs
description: node-postgres (pg) is a widely-used PostgreSQL driver for Node.js
  applications. This example demonstrates how to use node-postgres with
  Cloudflare Hyperdrive in a Workers application.
lastUpdated: 2025-05-12T14:16:48.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/
  md: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/index.md
---

[node-postgres](https://node-postgres.com/) (pg) is a widely-used PostgreSQL driver for Node.js applications. This example demonstrates how to use node-postgres with Cloudflare Hyperdrive in a Workers application.

Install the `node-postgres` driver:

* npm

  ```sh
  npm i pg@>8.16.3
  ```

* yarn

  ```sh
  yarn add pg@>8.16.3
  ```

* pnpm

  ```sh
  pnpm add pg@>8.16.3
  ```

Note

The minimum version of `node-postgres` required for Hyperdrive is `8.16.3`.

If using TypeScript, install the types package:

* npm

  ```sh
  npm i -D @types/pg
  ```

* yarn

  ```sh
  yarn add -D @types/pg
  ```

* pnpm

  ```sh
  pnpm add -D @types/pg
  ```

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

Create a new `Client` instance and pass the Hyperdrive `connectionString`:

```ts
// filepath: src/index.ts
import { Client } from "pg";


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Create a new client instance for each request.
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString,
    });


    try {
      // Connect to the database
      await client.connect();
      console.log("Connected to PostgreSQL database");


      // Perform a simple query
      const result = await client.query("SELECT * FROM pg_tables");


      return Response.json({
        success: true,
        result: result.rows,
      });
    } catch (error: any) {
      console.error("Database error:", error.message);


      new Response("Internal error occurred", { status: 500 });
    }
  },
};
```

Note

If you expect to be making multiple parallel database queries within a single Worker invocation, consider using a [connection pool (`pg.Pool`)](https://node-postgres.com/apis/pool) to allow for parallel queries. If doing so, set the max connections of the connection pool to 5 connections. This ensures that the connection pool fits within [Workers' concurrent open connections limit of 6](https://developers.cloudflare.com/workers/platform/limits), which affect TCP connections that database drivers use.
