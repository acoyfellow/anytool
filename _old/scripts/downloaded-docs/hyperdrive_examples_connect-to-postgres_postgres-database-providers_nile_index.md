---
title: Nile · Cloudflare Hyperdrive docs
description: Connect Hyperdrive to a Nile Postgres database instance.
lastUpdated: 2025-08-20T20:59:04.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/nile/
  md: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/nile/index.md
---

This example shows you how to connect Hyperdrive to a [Nile](https://thenile.dev) PostgreSQL database instance.

Nile is PostgreSQL re-engineered for multi-tenant applications. Nile's virtual tenant databases provide you with isolation, placement, insight, and other features for your tenant's data and embedding. Refer to [Nile documentation](https://www.thenile.dev/docs/getting-started/whatisnile) to learn more.

## 1. Allow Hyperdrive access

You can connect Cloudflare Hyperdrive to any Nile database in your workspace using its connection string - either with a new set of credentials, or using an existing set.

### Nile console

To get a connection string from Nile console:

1. Log in to [Nile console](https://console.thenile.dev), then select a database.
2. On the left hand menu, click **Settings** (the bottom-most icon) and then select **Connection**.
3. Select the PostgreSQL logo to show the connection string.
4. Select "Generate credentials" to generate new credentials.
5. Copy the connection string (without the "psql" part).

You will have obtained a connection string similar to the following:

```txt
    postgres://0191c898-...:4d7d8b45-...@eu-central-1.db.thenile.dev:5432/my_database
```

With the connection string, you can now create a Hyperdrive database configuration.

## 2. Create a database configuration

To configure Hyperdrive, you will need:

* The IP address (or hostname) and port of your database.
* The database username (for example, `hyperdrive-demo`) you configured in a previous step.
* The password associated with that username.
* The name of the database you want Hyperdrive to connect to. For example, `postgres`.

Hyperdrive accepts the combination of these parameters in the common connection string format used by database drivers:

```txt
postgres://USERNAME:PASSWORD@HOSTNAME_OR_IP_ADDRESS:PORT/database_name
```

Most database providers will provide a connection string you can directly copy-and-paste directly into Hyperdrive.

* Dashboard

  To create a Hyperdrive configuration with the Cloudflare dashboard:

  1. In the Cloudflare dashboard, go to the **Hyperdrive** page.

     [Go to **Hyperdrive**](https://dash.cloudflare.com/?to=/:account/workers/hyperdrive)

  2. Select **Create Configuration**.

  3. Fill out the form, including the connection string.

  4. Select **Create**.

* Wrangler CLI

  To create a Hyperdrive configuration with the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):

  1. Open your terminal and run the following command. Replace `<NAME_OF_HYPERDRIVE_CONFIG>` with a name for your Hyperdrive configuration and paste the connection string provided from your database host, or replace `user`, `password`, `HOSTNAME_OR_IP_ADDRESS`, `port`, and `database_name` placeholders with those specific to your database:

     ```sh
     npx wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string="postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"
     ```

  2. This command outputs a binding for the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/):

     * wrangler.jsonc

       ```jsonc
       {
         "name": "hyperdrive-example",
         "main": "src/index.ts",
         "compatibility_date": "2024-08-21",
         "compatibility_flags": [
           "nodejs_compat"
         ],
         "hyperdrive": [
           {
             "binding": "HYPERDRIVE",
             "id": "<ID OF THE CREATED HYPERDRIVE CONFIGURATION>"
           }
         ]
       }
       ```

     * wrangler.toml

       ```toml
       name = "hyperdrive-example"
       main = "src/index.ts"
       compatibility_date = "2024-08-21"
       compatibility_flags = ["nodejs_compat"]


       # Pasted from the output of `wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string=[...]` above.
       [[hyperdrive]]
       binding = "HYPERDRIVE"
       id = "<ID OF THE CREATED HYPERDRIVE CONFIGURATION>"
       ```

* wrangler.jsonc

  ```jsonc
  {
    "name": "hyperdrive-example",
    "main": "src/index.ts",
    "compatibility_date": "2024-08-21",
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "hyperdrive": [
      {
        "binding": "HYPERDRIVE",
        "id": "<ID OF THE CREATED HYPERDRIVE CONFIGURATION>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "hyperdrive-example"
  main = "src/index.ts"
  compatibility_date = "2024-08-21"
  compatibility_flags = ["nodejs_compat"]


  # Pasted from the output of `wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string=[...]` above.
  [[hyperdrive]]
  binding = "HYPERDRIVE"
  id = "<ID OF THE CREATED HYPERDRIVE CONFIGURATION>"
  ```

Note

Hyperdrive will attempt to connect to your database with the provided credentials to verify they are correct before creating a configuration. If you encounter an error when attempting to connect, refer to Hyperdrive's [troubleshooting documentation](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug possible causes.

## 3. Use Hyperdrive from your Worker

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

## Next steps

* Learn more about [How Hyperdrive Works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
* Refer to the [troubleshooting guide](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug common issues.
* Understand more about other [storage options](https://developers.cloudflare.com/workers/platform/storage-options/) available to Cloudflare Workers.
