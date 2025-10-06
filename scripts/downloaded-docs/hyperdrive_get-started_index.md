---
title: Getting started · Cloudflare Hyperdrive docs
description: Hyperdrive accelerates access to your existing databases from
  Cloudflare Workers, making even single-region databases feel globally
  distributed.
lastUpdated: 2025-09-09T14:11:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/get-started/
  md: https://developers.cloudflare.com/hyperdrive/get-started/index.md
---

Hyperdrive accelerates access to your existing databases from Cloudflare Workers, making even single-region databases feel globally distributed.

By maintaining a connection pool to your database within Cloudflare's network, Hyperdrive reduces seven round-trips to your database before you can even send a query: the TCP handshake (1x), TLS negotiation (3x), and database authentication (3x).

Hyperdrive understands the difference between read and write queries to your database, and caches the most common read queries, improving performance and reducing load on your origin database.

This guide will instruct you through:

* Creating your first Hyperdrive configuration.
* Creating a [Cloudflare Worker](https://developers.cloudflare.com/workers/) and binding it to your Hyperdrive configuration.
* Establishing a database connection from your Worker to a public database.

Note

Hyperdrive currently works with PostgreSQL, MySQL and many compatible databases. This includes CockroachDB and Materialize (which are PostgreSQL-compatible), and PlanetScale.

Learn more about the [databases that Hyperdrive supports](https://developers.cloudflare.com/hyperdrive/reference/supported-databases-and-features).

## Prerequisites

Before you begin, ensure you have completed the following:

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages) if you have not already.
2. Install [`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Use a Node version manager like [nvm](https://github.com/nvm-sh/nvm) or [Volta](https://volta.sh/) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) requires a Node version of `16.17.0` or later.
3. Have **a publicly accessible** PostgreSQL/MySQL (or compatible) database.

## 1. Log in

Before creating your Hyperdrive binding, log in with your Cloudflare account by running:

```sh
npx wrangler login
```

You will be directed to a web page asking you to log in to the Cloudflare dashboard. After you have logged in, you will be asked if Wrangler can make changes to your Cloudflare account. Scroll down and select **Allow** to continue.

## 2. Create a Worker

New to Workers?

Refer to [How Workers works](https://developers.cloudflare.com/workers/reference/how-workers-works/) to learn about the Workers serverless execution model works. Go to the [Workers Get started guide](https://developers.cloudflare.com/workers/get-started/guide/) to set up your first Worker.

Create a new project named `hyperdrive-tutorial` by running:

* npm

  ```sh
  npm create cloudflare@latest -- hyperdrive-tutorial
  ```

* yarn

  ```sh
  yarn create cloudflare hyperdrive-tutorial
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest hyperdrive-tutorial
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `Worker only`.
* For *Which language do you want to use?*, choose `TypeScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

This will create a new `hyperdrive-tutorial` directory. Your new `hyperdrive-tutorial` directory will include:

* A `"Hello World"` [Worker](https://developers.cloudflare.com/workers/get-started/guide/#3-write-code) at `src/index.ts`.
* A [`wrangler.jsonc`](https://developers.cloudflare.com/workers/wrangler/configuration/) configuration file. `wrangler.jsonc` is how your `hyperdrive-tutorial` Worker will connect to Hyperdrive.

### Enable Node.js compatibility

[Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) is required for database drivers, and needs to be configured for your Workers project.

To enable both built-in runtime APIs and polyfills for your Worker or Pages project, add the [`nodejs_compat`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag) [compatibility flag](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag) to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), and set your compatibility date to September 23rd, 2024 or later. This will enable [Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) for your Workers project.

* wrangler.jsonc

  ```jsonc
  {
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "compatibility_date": "2024-09-23"
  }
  ```

* wrangler.toml

  ```toml
  compatibility_flags = [ "nodejs_compat" ]
  compatibility_date = "2024-09-23"
  ```

## 3. Connect Hyperdrive to a database

Hyperdrive works by connecting to your database, pooling database connections globally, and speeding up your database access through Cloudflare's network.

It will provide a secure connection string that is only accessible from your Worker which you can use to connect to your database through Hyperdrive. This means that you can use the Hyperdrive connection string with your existing drivers or ORM libraries without needing significant changes to your code.

To create your first Hyperdrive database configuration, change into the directory you just created for your Workers project:

```sh
cd hyperdrive-tutorial
```

To create your first Hyperdrive, you will need:

* The IP address (or hostname) and port of your database.
* The database username (for example, `hyperdrive-demo`).
* The password associated with that username.
* The name of the database you want Hyperdrive to connect to. For example, `postgres` or `mysql`.

Hyperdrive accepts the combination of these parameters in the common connection string format used by database drivers:

* PostgreSQL

  ```txt
  postgres://USERNAME:PASSWORD@HOSTNAME_OR_IP_ADDRESS:PORT/database_name
  ```

  Most database providers will provide a connection string you can copy-and-paste directly into Hyperdrive.

  To create a Hyperdrive connection, run the `wrangler` command, replacing the placeholder values passed to the `--connection-string` flag with the values of your existing database:

  ```sh
  npx wrangler hyperdrive create <YOUR_CONFIG_NAME> --connection-string="postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"
  ```

* MySQL

  ```txt
  mysql://USERNAME:PASSWORD@HOSTNAME_OR_IP_ADDRESS:PORT/database_name
  ```

  Most database providers will provide a connection string you can copy-and-paste directly into Hyperdrive.

  To create a Hyperdrive connection, run the `wrangler` command, replacing the placeholder values passed to the `--connection-string` flag with the values of your existing database:

  ```sh
  npx wrangler hyperdrive create <YOUR_CONFIG_NAME> --connection-string="mysql://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"
  ```

Manage caching

By default, Hyperdrive will cache query results. If you wish to disable caching, pass the flag `--caching-disabled`.

Alternatively, you can use the `--max-age` flag to specify the maximum duration (in seconds) for which items should persist in the cache, before they are evicted. Default value is 60 seconds.

Refer to [Hyperdrive Wrangler commands](https://developers.cloudflare.com/hyperdrive/reference/wrangler-commands/) for more information.

If successful, the command will output your new Hyperdrive configuration:

```json
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<example id: 57b7076f58be42419276f058a8968187>"
    }
  ]
}
```

Copy the `id` field: you will use this in the next step to make Hyperdrive accessible from your Worker script.

Note

Hyperdrive will attempt to connect to your database with the provided credentials to verify they are correct before creating a configuration. If you encounter an error when attempting to connect, refer to Hyperdrive's [troubleshooting documentation](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) to debug possible causes.

## 4. Bind your Worker to Hyperdrive

You must create a binding in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) for your Worker to connect to your Hyperdrive configuration. [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) allow your Workers to access resources, like Hyperdrive, on the Cloudflare developer platform.

To bind your Hyperdrive configuration to your Worker, add the following to the end of your Wrangler file:

* wrangler.jsonc

  ```jsonc
  {
    "hyperdrive": [
      {
        "binding": "HYPERDRIVE",
        "id": "<YOUR_DATABASE_ID>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[hyperdrive]]
  binding = "HYPERDRIVE"
  id = "<YOUR_DATABASE_ID>" # the ID associated with the Hyperdrive you just created
  ```

Specifically:

* The value (string) you set for the `binding` (binding name) will be used to reference this database in your Worker. In this tutorial, name your binding `HYPERDRIVE`.
* The binding must be [a valid JavaScript variable name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables). For example, `binding = "hyperdrive"` or `binding = "productionDB"` would both be valid names for the binding.
* Your binding is available in your Worker at `env.<BINDING_NAME>`.

If you wish to use a local database during development, you can add a `localConnectionString` to your Hyperdrive configuration with the connection string of your database:

* wrangler.jsonc

  ```jsonc
  {
    "hyperdrive": [
      {
        "binding": "HYPERDRIVE",
        "id": "<YOUR_DATABASE_ID>",
        "localConnectionString": "<LOCAL_DATABASE_CONNECTION_URI>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[hyperdrive]]
  binding = "HYPERDRIVE"
  id = "<YOUR_DATABASE_ID>" # the ID associated with the Hyperdrive you just created
  localConnectionString = "<LOCAL_DATABASE_CONNECTION_URI>"
  ```

Note

Learn more about setting up [Hyperdrive for local development](https://developers.cloudflare.com/hyperdrive/configuration/local-development/).

## 5. Run a query against your database

Once you have created a Hyperdrive configuration and bound it to your Worker, you can run a query against your database.

### Install a database driver

* PostgreSQL

  To connect to your database, you will need a database driver which allows you to authenticate and query your database. For this tutorial, you will use [node-postgres (pg)](https://node-postgres.com/), one of the most widely used PostgreSQL drivers.

  To install `pg`, ensure you are in the `hyperdrive-tutorial` directory. Open your terminal and run the following command:

  * npm

    ```sh
    # This should install v8.13.0 or later
    npm i pg
    ```

  * yarn

    ```sh
    # This should install v8.13.0 or later
    yarn add pg
    ```

  * pnpm

    ```sh
    # This should install v8.13.0 or later
    pnpm add pg
    ```

  If you are using TypeScript, you should also install the type definitions for `pg`:

  * npm

    ```sh
    # This should install v8.13.0 or later
    npm i -D @types/pg
    ```

  * yarn

    ```sh
    # This should install v8.13.0 or later
    yarn add -D @types/pg
    ```

  * pnpm

    ```sh
    # This should install v8.13.0 or later
    pnpm add -D @types/pg
    ```

  With the driver installed, you can now create a Worker script that queries your database.

* MySQL

  To connect to your database, you will need a database driver which allows you to authenticate and query your database. For this tutorial, you will use [mysql2](https://github.com/sidorares/node-mysql2), one of the most widely used MySQL drivers.

  To install `mysql2`, ensure you are in the `hyperdrive-tutorial` directory. Open your terminal and run the following command:

  * npm

    ```sh
    # This should install v3.13.0 or later
    npm i mysql2
    ```

  * yarn

    ```sh
    # This should install v3.13.0 or later
    yarn add mysql2
    ```

  * pnpm

    ```sh
    # This should install v3.13.0 or later
    pnpm add mysql2
    ```

  With the driver installed, you can now create a Worker script that queries your database.

* npm

  ```sh
  # This should install v8.13.0 or later
  npm i pg
  ```

* yarn

  ```sh
  # This should install v8.13.0 or later
  yarn add pg
  ```

* pnpm

  ```sh
  # This should install v8.13.0 or later
  pnpm add pg
  ```

* npm

  ```sh
  # This should install v8.13.0 or later
  npm i -D @types/pg
  ```

* yarn

  ```sh
  # This should install v8.13.0 or later
  yarn add -D @types/pg
  ```

* pnpm

  ```sh
  # This should install v8.13.0 or later
  pnpm add -D @types/pg
  ```

* npm

  ```sh
  # This should install v3.13.0 or later
  npm i mysql2
  ```

* yarn

  ```sh
  # This should install v3.13.0 or later
  yarn add mysql2
  ```

* pnpm

  ```sh
  # This should install v3.13.0 or later
  pnpm add mysql2
  ```

### Write a Worker

* PostgreSQL

  After you have set up your database, you will run a SQL query from within your Worker.

  Go to your `hyperdrive-tutorial` Worker and open the `index.ts` file.

  The `index.ts` file is where you configure your Worker's interactions with Hyperdrive.

  Populate your `index.ts` file with the following code:

  ```typescript
  // pg 8.13.0 or later is recommended
  import { Client } from "pg";


  export interface Env {
    // If you set another name in the Wrangler config file as the value for 'binding',
    // replace "HYPERDRIVE" with the variable name you defined.
    HYPERDRIVE: Hyperdrive;
  }


  export default {
    async fetch(request, env, ctx): Promise<Response> {
      // Create a client using the pg driver (or any supported driver, ORM or query builder)
          // with the Hyperdrive credentials. These credentials are only accessible from your Worker.
          const sql = new Client({
            connectionString: env.HYPERDRIVE.connectionString,
          });


      try {
        // Connect to the database
        await sql.connect();


        // Sample query
        const results = await sql.query(`SELECT * FROM pg_tables`);


        // Return result rows as JSON
        return Response.json(results.rows);
      } catch (e) {
        console.error(e);
        return Response.json(
          { error: e instanceof Error ? e.message : e },
          { status: 500 },
        );
      }
    },
  } satisfies ExportedHandler<Env>;
  ```

  Upon receiving a request, the code above does the following:

  1. Creates a new database client configured to connect to your database via Hyperdrive, using the Hyperdrive connection string.
  2. Initiates a query via `await sql.query()` that outputs all tables (user and system created) in the database (as an example query).
  3. Returns the response as JSON to the client.

* MySQL

  After you have set up your database, you will run a SQL query from within your Worker.

  Go to your `hyperdrive-tutorial` Worker and open the `index.ts` file.

  The `index.ts` file is where you configure your Worker's interactions with Hyperdrive.

  Populate your `index.ts` file with the following code:

  ```typescript
  // mysql2 v3.13.0 or later is required
  import { createConnection  } from 'mysql2/promise';


  export interface Env {
    // If you set another name in the Wrangler config file as the value for 'binding',
    // replace "HYPERDRIVE" with the variable name you defined.
    HYPERDRIVE: Hyperdrive;
  }


  export default {
   async fetch(request, env, ctx): Promise<Response> {


      // Create a connection using the mysql2 driver (or any support driver, ORM or query builder)
      // with the Hyperdrive credentials. These credentials are only accessible from your Worker.
      const connection = await createConnection({
        host: env.HYPERDRIVE.host,
        user: env.HYPERDRIVE.user,
        password: env.HYPERDRIVE.password,
        database: env.HYPERDRIVE.database,
        port: env.HYPERDRIVE.port


        // The following line is needed for mysql2 compatibility with Workers
        // mysql2 uses eval() to optimize result parsing for rows with > 100 columns
        // Configure mysql2 to use static parsing instead of eval() parsing with disableEval
        disableEval: true
      });


      try{
        // Sample query
        const [results, fields] = await connection.query(
          'SHOW tables;'
        );


        // Clean up the client after the response is returned, before the Worker is killed
        ctx.waitUntil(connection.end());


        // Return result rows as JSON
        return new Response(JSON.stringify({ results, fields }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      catch(e){
        console.error(e);
        return Response.json(
          { error: e instanceof Error ? e.message : e },
          { status: 500 },
        );
      }


   },
  } satisfies ExportedHandler<Env>;
  ```

  Upon receiving a request, the code above does the following:

  1. Creates a new database client configured to connect to your database via Hyperdrive, using the Hyperdrive connection string.
  2. Initiates a query via `await connection.query` that outputs all tables (user and system created) in the database (as an example query).
  3. Returns the response as JSON to the client.

### Run in development mode (optional)

You can start your project in development mode. If you want to connect to the local database configured in your `wrangler.jsonc` with `localConnectionString` (e.g. `localhost:5432`), you can now run `wrangler dev`. This will connect directly to your database from your local Worker project emulation (Hyperdrive caching will not take effect, and the local database must not require SSL). To develop using a remote database, you can connect to your Hyperdrive configuration by running `wrangler dev --remote`.

## 6. Deploy your Worker

You can now deploy your Worker to make your project accessible on the Internet. To deploy your Worker, run:

```sh
npx wrangler deploy
# Outputs: https://hyperdrive-tutorial.<YOUR_SUBDOMAIN>.workers.dev
```

You can now visit the URL for your newly created project to query your live database.

For example, if the URL of your new Worker is `hyperdrive-tutorial.<YOUR_SUBDOMAIN>.workers.dev`, accessing `https://hyperdrive-tutorial.<YOUR_SUBDOMAIN>.workers.dev/` will send a request to your Worker that queries your database directly.

By finishing this tutorial, you have created a Hyperdrive configuration, a Worker to access that database and deployed your project globally.

## Next steps

* Learn more about [how Hyperdrive works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
* How to [configure query caching](https://developers.cloudflare.com/hyperdrive/configuration/query-caching/).
* [Troubleshooting common issues](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) when connecting a database to Hyperdrive.

If you have any feature requests or notice any bugs, share your feedback directly with the Cloudflare team by joining the [Cloudflare Developers community on Discord](https://discord.cloudflare.com).
