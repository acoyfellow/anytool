---
title: Supabase · Cloudflare Workers docs
description: Supabase is an open source Firebase alternative and a PostgreSQL
  database service that offers real-time functionality, database backups, and
  extensions. With Supabase, developers can quickly set up a PostgreSQL database
  and build applications.
lastUpdated: 2025-07-02T08:58:55.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/databases/third-party-integrations/supabase/
  md: https://developers.cloudflare.com/workers/databases/third-party-integrations/supabase/index.md
---

[Supabase](https://supabase.com/) is an open source Firebase alternative and a PostgreSQL database service that offers real-time functionality, database backups, and extensions. With Supabase, developers can quickly set up a PostgreSQL database and build applications.

Note

The Supabase client (`@supabase/supabase-js`) provides access to Supabase's various features, including database access. If you need access to all of the Supabase client functionality, use the Supabase client.

If you want to connect directly to the Supabase Postgres database, connect using [Hyperdrive](https://developers.cloudflare.com/hyperdrive). Hyperdrive can provide lower latencies because it performs the database connection setup and connection pooling across Cloudflare's network. Hyperdrive supports native database drivers, libraries, and ORMs, and is included in all [Workers plans](https://developers.cloudflare.com/hyperdrive/platform/pricing/). Learn more about Hyperdrive in [How Hyperdrive Works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).

* Supabase client

  ### Supabase client setup

  To set up an integration with Supabase:

  1. You need to have an existing Supabase database to connect to. [Create a Supabase database](https://supabase.com/docs/guides/database/tables#creating-tables) or [have an existing database to connect to Supabase and load data from](https://supabase.com/docs/guides/database/tables#loading-data).

  2. Create a `countries` table with the following query. You can create a table in your Supabase dashboard in two ways:

     * Use the table editor, which allows you to set up Postgres similar to a spreadsheet.
     * Alternatively, use the [SQL editor](https://supabase.com/docs/guides/database/overview#the-sql-editor):

     ```sql
     CREATE TABLE countries (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL
     );
     ```

  3. Insert some data in your newly created table. Run the following commands to add countries to your table:

     ```sql
     INSERT INTO countries (name) VALUES ('United States');
     INSERT INTO countries (name) VALUES ('Canada');
     INSERT INTO countries (name) VALUES ('The Netherlands');
     ```

  4. Configure the Supabase database credentials in your Worker:

     You need to add your Supabase URL and anon key as secrets to your Worker. Get these from your [Supabase Dashboard](https://supabase.com/dashboard) under **Settings** > **API**, then add them as secrets using Wrangler:

     ```sh
     # Add the Supabase URL as a secret
     npx wrangler secret put SUPABASE_URL
     # When prompted, paste your Supabase project URL


     # Add the Supabase anon key as a secret
     npx wrangler secret put SUPABASE_KEY
     # When prompted, paste your Supabase anon/public key
     ```

  5. In your Worker, install the `@supabase/supabase-js` driver to connect to your database and start manipulating data:

     * npm

       ```sh
       npm i @supabase/supabase-js
       ```

     * yarn

       ```sh
       yarn add @supabase/supabase-js
       ```

     * pnpm

       ```sh
       pnpm add @supabase/supabase-js
       ```

  6. The following example shows how to make a query to your Supabase database in a Worker. The credentials needed to connect to Supabase have been added as secrets to your Worker.

     ```js
     import { createClient } from "@supabase/supabase-js";


     export default {
       async fetch(request, env) {
         const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
         const { data, error } = await supabase.from("countries").select("*");
         if (error) throw error;
         return new Response(JSON.stringify(data), {
           headers: {
             "Content-Type": "application/json",
           },
         });
       },
     };
     ```

  To learn more about Supabase, refer to [Supabase's official documentation](https://supabase.com/docs).

* Hyperdrive

  When connecting to Supabase with Hyperdrive, you connect directly to the underlying Postgres database. This provides the lowest latency for databsae queries when accessed server-side from Workers. To connect to Supabase using [Hyperdrive](https://developers.cloudflare.com/hyperdrive), follow these steps:

  ## 1. Allow Hyperdrive access

  You can connect Hyperdrive to any existing Supabase database as the Postgres user which is set up during project creation. Alternatively, to create a new user for Hyperdrive, run these commands in the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new).

  The database endpoint can be found in the [database settings page](https://supabase.com/dashboard/project/_/settings/database).

  With a database user, password, database endpoint (hostname and port) and database name (default: postgres), you can now set up Hyperdrive.

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

  Note

  When connecting to a Supabase database with Hyperdrive, you should use a driver like [node-postgres (pg)](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/) or [Postgres.js](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/) to connect directly to the underlying database instead of the [Supabase JavaScript client](https://github.com/supabase/supabase-js). Hyperdrive is optimized for database access for Workers and will perform global connection pooling and fast query routing by connecting directly to your database.

  ## Next steps

  * Learn more about [How Hyperdrive Works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
  * Refer to the [troubleshooting guide](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug common issues.
  * Understand more about other [storage options](https://developers.cloudflare.com/workers/platform/storage-options/) available to Cloudflare Workers.

* npm

  ```sh
  npm i @supabase/supabase-js
  ```

* yarn

  ```sh
  yarn add @supabase/supabase-js
  ```

* pnpm

  ```sh
  pnpm add @supabase/supabase-js
  ```

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
