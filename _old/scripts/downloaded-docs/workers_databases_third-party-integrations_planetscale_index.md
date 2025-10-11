---
title: PlanetScale · Cloudflare Workers docs
description: PlanetScale is a database platform that provides MySQL-compatible
  and PostgreSQL databases, making them more scalable, easier and safer to
  manage.
lastUpdated: 2025-09-05T14:33:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/databases/third-party-integrations/planetscale/
  md: https://developers.cloudflare.com/workers/databases/third-party-integrations/planetscale/index.md
---

[PlanetScale](https://planetscale.com/) is a database platform that provides MySQL-compatible and PostgreSQL databases, making them more scalable, easier and safer to manage.

Note

You can connect to PlanetScale using [Hyperdrive](https://developers.cloudflare.com/hyperdrive) (recommended), or using the PlanetScale serverless driver, `@planetscale/database`. Both provide connection pooling and reduce the amount of round trips required to create a secure connection from Workers to your database.

Hyperdrive can provide lower latencies because it performs the database connection setup and connection pooling across Cloudflare's network. Hyperdrive supports native database drivers, libraries, and ORMs, and is included in all [Workers plans](https://developers.cloudflare.com/hyperdrive/platform/pricing/). Learn more about Hyperdrive in [How Hyperdrive Works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).

* Hyperdrive (recommended)

  To connect to PlanetScale using [Hyperdrive](https://developers.cloudflare.com/hyperdrive), follow these steps:

  ## 1. Allow Hyperdrive access

  You can connect Hyperdrive to any existing PlanetScale MySQL-compatible database by creating a new user and fetching your database connection string.

  ### PlanetScale Dashboard

  1. Go to the [**PlanetScale dashboard**](https://app.planetscale.com/) and select the database you wish to connect to.
  2. Click **Connect**. Enter `hyperdrive-user` as the password name (or your preferred name) and configure the permissions as desired. Select **Create password**. Note the username and password as they will not be displayed again.
  3. Select **Other** as your language or framework. Note down the database host, database name, database username, and password. You will need these to create a database configuration in Hyperdrive.

  With the host, database name, username and password, you can now create a Hyperdrive database configuration.

  ## 2. Create a database configuration

  To configure Hyperdrive, you will need:

  * The IP address (or hostname) and port of your database.
  * The database username (for example, `hyperdrive-demo`) you configured in a previous step.
  * The password associated with that username.
  * The name of the database you want Hyperdrive to connect to. For example, `mysql`.

  Hyperdrive accepts the combination of these parameters in the common connection string format used by database drivers:

  ```txt
  mysql://USERNAME:PASSWORD@HOSTNAME_OR_IP_ADDRESS:PORT/database_name
  ```

  Most database providers will provide a connection string you can copy-and-paste directly into Hyperdrive.

  To create a Hyperdrive configuration with the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/), open your terminal and run the following command.

  * Replace \<NAME\_OF\_HYPERDRIVE\_CONFIG> with a name for your Hyperdrive configuration and paste the connection string provided from your database host, or,
  * Replace `user`, `password`, `HOSTNAME_OR_IP_ADDRESS`, `port`, and `database_name` placeholders with those specific to your database:

  ```sh
  npx wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string="mysql://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"
  ```

  Note

  Hyperdrive will attempt to connect to your database with the provided credentials to verify they are correct before creating a configuration. If you encounter an error when attempting to connect, refer to Hyperdrive's [troubleshooting documentation](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug possible causes.

  This command outputs a binding for the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/):

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

  ## 3. Use Hyperdrive from your Worker

  Install the [mysql2](https://github.com/sidorares/node-mysql2) driver:

  * npm

    ```sh
    npm i mysql2@>3.13.0
    ```

  * yarn

    ```sh
    yarn add mysql2@>3.13.0
    ```

  * pnpm

    ```sh
    pnpm add mysql2@>3.13.0
    ```

  Note

  `mysql2` v3.13.0 or later is required

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

  Create a new `connection` instance and pass the Hyperdrive parameters:

  ```ts
  // mysql2 v3.13.0 or later is required
  import { createConnection } from "mysql2/promise";


  export default {
    async fetch(request, env, ctx): Promise<Response> {
      // Create a connection using the mysql2 driver with the Hyperdrive credentials (only accessible from your Worker).
      const connection = await createConnection({
        host: env.HYPERDRIVE.host,
        user: env.HYPERDRIVE.user,
        password: env.HYPERDRIVE.password,
        database: env.HYPERDRIVE.database,
        port: env.HYPERDRIVE.port,


        // Required to enable mysql2 compatibility for Workers
        disableEval: true,
      });


      try {
        // Sample query
        const [results, fields] = await connection.query("SHOW tables;");


        // Clean up the client after the response is returned, before the Worker is killed
        ctx.waitUntil(connection.end());


        // Return result rows as JSON
        return Response.json({ results, fields });
      } catch (e) {
        console.error(e);
      }
    },
  } satisfies ExportedHandler<Env>;
  ```

  Note

  The minimum version of `mysql2` required for Hyperdrive is `3.13.0`.

  Note

  When connecting to a PlanetScale database with Hyperdrive, you should use a driver like [node-postgres (pg)](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/) or [Postgres.js](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/) to connect directly to the underlying database instead of the [PlanetScale serverless driver](https://planetscale.com/docs/tutorials/planetscale-serverless-driver). Hyperdrive is optimized for database access for Workers and will perform global connection pooling and fast query routing by connecting directly to your database.

  ## Next steps

  * Learn more about [How Hyperdrive Works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
  * Refer to the [troubleshooting guide](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug common issues.
  * Understand more about other [storage options](https://developers.cloudflare.com/workers/platform/storage-options/) available to Cloudflare Workers.

* PlanetScale serverless driver

  ## Set up an integration with PlanetScale

  To set up an integration with PlanetScale:

  1. You need to have an existing PlanetScale database to connect to. [Create a PlanetScale database](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide#create-a-database) or [import an existing database to PlanetScale](https://planetscale.com/docs/imports/database-imports#overview).

  2. From the [PlanetScale web console](https://planetscale.com/docs/concepts/web-console#get-started), create a `products` table with the following query:

     ```sql
     CREATE TABLE products (
       id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name varchar(255) NOT NULL,
       image_url varchar(255),
       category_id INT,
       KEY category_id_idx (category_id)
     );
     ```

  3. Insert some data in your newly created table. Run the following command to add a product and category to your table:

     ```sql
     INSERT INTO products (name, image_url, category_id)
     VALUES ('Ballpoint pen', 'https://example.com/500x500', '1');
     ```

  4. Configure the PlanetScale database credentials in your Worker:

     You need to add your PlanetScale database credentials as secrets to your Worker. Get your connection details from the [PlanetScale Dashboard](https://app.planetscale.com) by creating a connection string, then add them as secrets using Wrangler:

     ```sh
     # Add the database host as a secret
     npx wrangler secret put DATABASE_HOST
     # When prompted, paste your PlanetScale host


     # Add the database username as a secret
     npx wrangler secret put DATABASE_USERNAME
     # When prompted, paste your PlanetScale username


     # Add the database password as a secret
     npx wrangler secret put DATABASE_PASSWORD
     # When prompted, paste your PlanetScale password
     ```

  5. In your Worker, install the `@planetscale/database` driver to connect to your PlanetScale database and start manipulating data:

     * npm

       ```sh
       npm i @planetscale/database
       ```

     * yarn

       ```sh
       yarn add @planetscale/database
       ```

     * pnpm

       ```sh
       pnpm add @planetscale/database
       ```

  6. The following example shows how to make a query to your PlanetScale database in a Worker. The credentials needed to connect to PlanetScale have been added as secrets to your Worker.

     ```js
     import { connect } from "@planetscale/database";


     export default {
       async fetch(request, env) {
         const config = {
           host: env.DATABASE_HOST,
           username: env.DATABASE_USERNAME,
           password: env.DATABASE_PASSWORD,
           // see https://github.com/cloudflare/workerd/issues/698
           fetch: (url, init) => {
             delete init["cache"];
             return fetch(url, init);
           },
         };


         const conn = connect(config);
         const data = await conn.execute("SELECT * FROM products;");
         return new Response(JSON.stringify(data.rows), {
           status: 200,
           headers: {
             "Content-Type": "application/json",
           },
         });
       },
     };
     ```

  To learn more about PlanetScale, refer to [PlanetScale's official documentation](https://docs.planetscale.com/).

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
  npm i mysql2@>3.13.0
  ```

* yarn

  ```sh
  yarn add mysql2@>3.13.0
  ```

* pnpm

  ```sh
  pnpm add mysql2@>3.13.0
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

* npm

  ```sh
  npm i @planetscale/database
  ```

* yarn

  ```sh
  yarn add @planetscale/database
  ```

* pnpm

  ```sh
  pnpm add @planetscale/database
  ```
