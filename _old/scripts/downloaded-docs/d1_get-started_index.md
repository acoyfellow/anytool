---
title: Getting started · Cloudflare D1 docs
description: "This guide instructs you through:"
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/get-started/
  md: https://developers.cloudflare.com/d1/get-started/index.md
---

This guide instructs you through:

* Creating your first database using D1, Cloudflare's native serverless SQL database.
* Creating a schema and querying your database via the command-line.
* Connecting a [Cloudflare Worker](https://developers.cloudflare.com/workers/) to your D1 database using bindings, and querying your D1 database programmatically.

You can perform these tasks through the CLI or through the Cloudflare dashboard.

Note

If you already have an existing Worker and an existing D1 database, follow this tutorial from [3. Bind your Worker to your D1 database](https://developers.cloudflare.com/d1/get-started/#3-bind-your-worker-to-your-d1-database).

## Quick start

If you want to skip the steps and get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/d1-get-started/d1/d1-get-started)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers. Use this option if you are familiar with Cloudflare Workers, and wish to skip the step-by-step guidance.

You may wish to manually follow the steps if you are new to Cloudflare Workers.

## Prerequisites

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
2. Install [`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), discussed later in this guide, requires a Node version of `16.17.0` or later.

## 1. Create a Worker

Create a new Worker as the means to query your database.

* CLI

  1. Create a new project named `d1-tutorial` by running:

     * npm

       ```sh
       npm create cloudflare@latest -- d1-tutorial
       ```

     * yarn

       ```sh
       yarn create cloudflare d1-tutorial
       ```

     * pnpm

       ```sh
       pnpm create cloudflare@latest d1-tutorial
       ```

     For setup, select the following options:

     * For *What would you like to start with?*, choose `Hello World example`.
     * For *Which template would you like to use?*, choose `Worker only`.
     * For *Which language do you want to use?*, choose `TypeScript`.
     * For *Do you want to use git for version control?*, choose `Yes`.
     * For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

     This creates a new `d1-tutorial` directory as illustrated below.

     Your new `d1-tutorial` directory includes:

     * A `"Hello World"` [Worker](https://developers.cloudflare.com/workers/get-started/guide/#3-write-code) in `index.ts`.
     * A [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This file is how your `d1-tutorial` Worker accesses your D1 database.

  Note

  If you are familiar with Cloudflare Workers, or initializing projects in a Continuous Integration (CI) environment, initialize a new project non-interactively by setting `CI=true` as an [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/) when running `create cloudflare@latest`.

  For example: `CI=true npm create cloudflare@latest d1-tutorial --type=simple --git --ts --deploy=false` creates a basic "Hello World" project ready to build on.

* Dashboard

  1. In the Cloudflare dashboard, go to the **Workers & Pages** page. [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
  2. Select **Create application**.
  3. Select **Start with Hello World!** > **Get started**.
  4. Name your Worker. For this tutorial, name your Worker `d1-tutorial`.
  5. Select **Deploy**.

* npm

  ```sh
  npm create cloudflare@latest -- d1-tutorial
  ```

* yarn

  ```sh
  yarn create cloudflare d1-tutorial
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest d1-tutorial
  ```

## 2. Create a database

A D1 database is conceptually similar to many other SQL databases: a database may contain one or more tables, the ability to query those tables, and optional indexes. D1 uses the familiar [SQL query language](https://www.sqlite.org/lang.html) (as used by SQLite).

To create your first D1 database:

* CLI

  1. Change into the directory you just created for your Workers project:

     ```sh
     cd d1-tutorial
     ```

  2. Run the following `wrangler@latest d1` command and give your database a name. In this tutorial, the database is named `prod-d1-tutorial`:

     Note

     The [Wrangler command-line interface](https://developers.cloudflare.com/workers/wrangler/) is Cloudflare's tool for managing and deploying Workers applications and D1 databases in your terminal. It was installed when you used `npm create cloudflare@latest` to initialize your new project.

     While Wrangler gets installed locally to your project, you can use it outside the project by using the command `npx wrangler`.

     ```sh
     npx wrangler@latest d1 create prod-d1-tutorial
     ```

     ```txt
     ✅ Successfully created DB 'prod-d1-tutorial' in region WEUR
     Created your new D1 database.


     {
       "d1_databases": [
         {
           "binding": "prod_d1_tutorial",
           "database_name": "prod-d1-tutorial",
           "database_id": "<unique-ID-for-your-database>"
         }
       ]
     }
     ```

  3. When prompted: `Would you like Wrangler to add it on your behalf?`, select `Yes`. This will automatically add the binding to your Wrangler configuration file.

  This creates a new D1 database and outputs the [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/) configuration needed in the next step.

* Dashboard

  1. In the Cloudflare dashboard, go to the **D1 SQL database** page.

     [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

  2. Select **Create Database**.

  3. Name your database. For this tutorial, name your D1 database `prod-d1-tutorial`.

  4. (Optional) Provide a location hint. Location hint is an optional parameter you can provide to indicate your desired geographical location for your database. Refer to [Provide a location hint](https://developers.cloudflare.com/d1/configuration/data-location/#provide-a-location-hint) for more information.

  5. Select **Create**.

Note

For reference, a good database name:

* Uses a combination of ASCII characters, shorter than 32 characters, and uses dashes (-) instead of spaces.
* Is descriptive of the use-case and environment. For example, "staging-db-web" or "production-db-backend".
* Only describes the database, and is not directly referenced in code.

## 3. Bind your Worker to your D1 database

You must create a binding for your Worker to connect to your D1 database. [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) allow your Workers to access resources, like D1, on the Cloudflare developer platform.

To bind your D1 database to your Worker:

* CLI

  You can automatically add the binding to your Wrangler configuration file when you run the `wrangler d1 create` command (step 3 of [2. Create a database](https://developers.cloudflare.com/d1/get-started/#2-create-a-database)).

  But if you wish to add the binding manually, follow the steps below:

  1. Copy the lines obtained from step 2 of [2. Create a database](https://developers.cloudflare.com/d1/get-started/#2-create-a-database) from your terminal.

  2. Add them to the end of your Wrangler file.

     * wrangler.jsonc

       ```jsonc
       {
         "d1_databases": [
           {
             "binding": "prod_d1_tutorial",
             "database_name": "prod-d1-tutorial",
             "database_id": "<unique-ID-for-your-database>"
           }
         ]
       }
       ```

     * wrangler.toml

       ```toml
       [[d1_databases]]
       binding = "prod_d1_tutorial" # available in your Worker on env.DB
       database_name = "prod-d1-tutorial"
       database_id = "<unique-ID-for-your-database>"
       ```

     Specifically:

     * The value (string) you set for `binding` is the **binding name**, and is used to reference this database in your Worker. In this tutorial, name your binding `prod_d1_tutorial`.
     * The binding name must be [a valid JavaScript variable name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables). For example, `binding = "MY_DB"` or `binding = "productionDB"` would both be valid names for the binding.
     * Your binding is available in your Worker at `env.<BINDING_NAME>` and the D1 [Workers Binding API](https://developers.cloudflare.com/d1/worker-api/) is exposed on this binding.

  Note

  When you execute the `wrangler d1 create` command, the client API package (which implements the D1 API and database class) is automatically installed. For more information on the D1 Workers Binding API, refer to [Workers Binding API](https://developers.cloudflare.com/d1/worker-api/).

  You can also bind your D1 database to a [Pages Function](https://developers.cloudflare.com/pages/functions/). For more information, refer to [Functions Bindings for D1](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases).

* Dashboard

  You create bindings by adding them to the Worker you have created.

  1. In the Cloudflare dashboard, go to the **Workers & Pages** page. [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
  2. Select the `d1-tutorial` Worker you created in [step 1](https://developers.cloudflare.com/d1/get-started/#1-create-a-worker).
  3. Go to the **Bindings** tab.
  4. Select **Add binding**.
  5. Select **D1 database** > **Add binding**.
  6. Name your binding in **Variable name**, then select the `prod-d1-tutorial` D1 database you created in [step 2](https://developers.cloudflare.com/d1/get-started/#2-create-a-database) from the dropdown menu. For this tutorial, name your binding `prod_d1_tutorial`.
  7. Select **Add binding**.

* wrangler.jsonc

  ```jsonc
  {
    "d1_databases": [
      {
        "binding": "prod_d1_tutorial",
        "database_name": "prod-d1-tutorial",
        "database_id": "<unique-ID-for-your-database>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[d1_databases]]
  binding = "prod_d1_tutorial" # available in your Worker on env.DB
  database_name = "prod-d1-tutorial"
  database_id = "<unique-ID-for-your-database>"
  ```

## 4. Run a query against your D1 database

### Populate your D1 database

* CLI

  After correctly preparing your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), set up your database. Create a `schema.sql` file using the SQL syntax below to initialize your database.

  1. Copy the following code and save it as a `schema.sql` file in the `d1-tutorial` Worker directory you created in step 1:

     ```sql
     DROP TABLE IF EXISTS Customers;
     CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
     INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');
     ```

  2. Initialize your database to run and test locally first. Bootstrap your new D1 database by running:

     ```sh
     npx wrangler d1 execute prod-d1-tutorial --local --file=./schema.sql
     ```

     ```txt
     ⛅️ wrangler 4.13.2
     -------------------


     🌀 Executing on local database prod-d1-tutorial (<DATABASE_ID>) from .wrangler/state/v3/d1:
     🌀 To execute on your remote database, add a --remote flag to your wrangler command.
     🚣 3 commands executed successfully.
     ```

     Note

     The command `npx wrangler d1 execute` initializes your database locally, not on the remote database.

  3. Validate that your data is in the database by running:

     ```sh
     npx wrangler d1 execute prod-d1-tutorial --local --command="SELECT * FROM Customers"
     ```

     ```txt
      🌀 Executing on local database jun-d1-db-gs-2025 (cf91ec5c-fa77-4d49-ad8e-e22921b996b2) from .wrangler/state/v3/d1:
      🌀 To execute on your remote database, add a --remote flag to your wrangler command.
      🚣 1 command executed successfully.
      ┌────────────┬─────────────────────┬───────────────────┐
      │ CustomerId │ CompanyName         │ ContactName       │
      ├────────────┼─────────────────────┼───────────────────┤
      │ 1          │ Alfreds Futterkiste │ Maria Anders      │
      ├────────────┼─────────────────────┼───────────────────┤
      │ 4          │ Around the Horn     │ Thomas Hardy      │
      ├────────────┼─────────────────────┼───────────────────┤
      │ 11         │ Bs Beverages        │ Victoria Ashworth │
      ├────────────┼─────────────────────┼───────────────────┤
      │ 13         │ Bs Beverages        │ Random Name       │
      └────────────┴─────────────────────┴───────────────────┘
     ```

* Dashboard

  Use the Dashboard to create a table and populate it with data.

  1. In the Cloudflare dashboard, go to the **D1 SQL database** page.

     [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

  2. Select the `prod-d1-tutorial` database you created in [step 2](https://developers.cloudflare.com/d1/get-started/#2-create-a-database).

  3. Select **Console**.

  4. Paste the following SQL snippet.

     ```sql
     DROP TABLE IF EXISTS Customers;
     CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);
     INSERT INTO Customers (CustomerID, CompanyName, ContactName) VALUES (1, 'Alfreds Futterkiste', 'Maria Anders'), (4, 'Around the Horn', 'Thomas Hardy'), (11, 'Bs Beverages', 'Victoria Ashworth'), (13, 'Bs Beverages', 'Random Name');
     ```

  5. Select **Execute**. This creates a table called `Customers` in your `prod-d1-tutorial` database.

  6. Select **Tables**, then select the `Customers` table to view the contents of the table.

### Write queries within your Worker

After you have set up your database, run an SQL query from within your Worker.

* CLI

  1. Navigate to your `d1-tutorial` Worker and open the `index.ts` file. The `index.ts` file is where you configure your Worker's interactions with D1.

  2. Clear the content of `index.ts`.

  3. Paste the following code snippet into your `index.ts` file:

     * JavaScript

       ```js
       export default {
         async fetch(request, env) {
           const { pathname } = new URL(request.url);


           if (pathname === "/api/beverages") {
             // If you did not use `DB` as your binding name, change it here
             const { results } = await env.prod_d1_tutorial
               .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
               .bind("Bs Beverages")
               .run();
             return Response.json(results);
           }


           return new Response(
             "Call /api/beverages to see everyone who works at Bs Beverages",
           );
         },
       };
       ```

     * TypeScript

       ```ts
       export interface Env {
         // If you set another name in the Wrangler config file for the value for 'binding',
         // replace "DB" with the variable name you defined.
         prod_d1_tutorial: D1Database;
       }


       export default {
         async fetch(request, env): Promise<Response> {
           const { pathname } = new URL(request.url);


           if (pathname === "/api/beverages") {
             // If you did not use `DB` as your binding name, change it here
             const { results } = await env.prod_d1_tutorial.prepare(
               "SELECT * FROM Customers WHERE CompanyName = ?",
             )
               .bind("Bs Beverages")
               .run();
             return Response.json(results);
           }


           return new Response(
             "Call /api/beverages to see everyone who works at Bs Beverages",
           );
         },
       } satisfies ExportedHandler<Env>;
       ```

     * Python

       ```python
       from workers import Response, WorkerEntrypoint
       from urllib.parse import urlparse


       class Default(WorkerEntrypoint):
           async def fetch(self, request):
               pathname = urlparse(request.url).path
               if pathname == "/api/beverages":
                   query = (
                       await self.env.prod_d1_tutorial.prepare(
                           "SELECT * FROM Customers WHERE CompanyName = ?",
                       )
                       .bind("Bs Beverages")
                       .run()
                   )
                   return Response.json(query.results)
               return Response(
                   "Call /api/beverages to see everyone who works at Bs Beverages"
               )
       ```

     In the code above, you:

     1. Define a binding to your D1 database in your code. This binding matches the `binding` value you set in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) under `d1_databases`.
     2. Query your database using `env.prod_d1_tutorial.prepare` to issue a [prepared query](https://developers.cloudflare.com/d1/worker-api/d1-database/#prepare) with a placeholder (the `?` in the query).
     3. Call `bind()` to safely and securely bind a value to that placeholder. In a real application, you would allow a user to pass the `CompanyName` they want to list results for. Using `bind()` prevents users from executing arbitrary SQL (known as "SQL injection") against your application and deleting or otherwise modifying your database.
     4. Execute the query by calling [`run()`](https://developers.cloudflare.com/d1/worker-api/prepared-statements/#run) to return all rows (or none, if the query returns none).
     5. Return your query results, if any, in JSON format with `Response.json(results)`.

  After configuring your Worker, you can test your project locally before you deploy globally.

* Dashboard

  You can query your D1 database using your Worker.

  1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

     [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

  2. Select the `d1-tutorial` Worker you created.

  3. Select the **Edit code** icon (**\</>**).

  4. Clear the contents of the `worker.js` file, then paste the following code:

     ```js
     export default {
       async fetch(request, env) {
         const { pathname } = new URL(request.url);


         if (pathname === "/api/beverages") {
           // If you did not use `DB` as your binding name, change it here
           const { results } = await env.prod_d1_tutorial.prepare(
             "SELECT * FROM Customers WHERE CompanyName = ?"
           )
             .bind("Bs Beverages")
             .run();
           return new Response(JSON.stringify(results), {
             headers: { 'Content-Type': 'application/json' }
           });
         }


         return new Response(
           "Call /api/beverages to see everyone who works at Bs Beverages"
         );
       },
     };
     ```

  5. Select **Save**.

* JavaScript

  ```js
  export default {
    async fetch(request, env) {
      const { pathname } = new URL(request.url);


      if (pathname === "/api/beverages") {
        // If you did not use `DB` as your binding name, change it here
        const { results } = await env.prod_d1_tutorial
          .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
          .bind("Bs Beverages")
          .run();
        return Response.json(results);
      }


      return new Response(
        "Call /api/beverages to see everyone who works at Bs Beverages",
      );
    },
  };
  ```

* TypeScript

  ```ts
  export interface Env {
    // If you set another name in the Wrangler config file for the value for 'binding',
    // replace "DB" with the variable name you defined.
    prod_d1_tutorial: D1Database;
  }


  export default {
    async fetch(request, env): Promise<Response> {
      const { pathname } = new URL(request.url);


      if (pathname === "/api/beverages") {
        // If you did not use `DB` as your binding name, change it here
        const { results } = await env.prod_d1_tutorial.prepare(
          "SELECT * FROM Customers WHERE CompanyName = ?",
        )
          .bind("Bs Beverages")
          .run();
        return Response.json(results);
      }


      return new Response(
        "Call /api/beverages to see everyone who works at Bs Beverages",
      );
    },
  } satisfies ExportedHandler<Env>;
  ```

* Python

  ```python
  from workers import Response, WorkerEntrypoint
  from urllib.parse import urlparse


  class Default(WorkerEntrypoint):
      async def fetch(self, request):
          pathname = urlparse(request.url).path
          if pathname == "/api/beverages":
              query = (
                  await self.env.prod_d1_tutorial.prepare(
                      "SELECT * FROM Customers WHERE CompanyName = ?",
                  )
                  .bind("Bs Beverages")
                  .run()
              )
              return Response.json(query.results)
          return Response(
              "Call /api/beverages to see everyone who works at Bs Beverages"
          )
  ```

## 5. Deploy your application

Deploy your application on Cloudflare's global network.

* CLI

  To deploy your Worker to production using Wrangler, you must first repeat the [database configuration](https://developers.cloudflare.com/d1/get-started/#populate-your-d1-database) steps after replacing the `--local` flag with the `--remote` flag to give your Worker data to read. This creates the database tables and imports the data into the production version of your database.

  1. Create tables and add entries to your remote database with the `schema.sql` file you created in step 4. Enter `y` to confirm your decision.

     ```sh
     npx wrangler d1 execute prod-d1-tutorial --remote --file=./schema.sql
     ```

     ```txt
     🌀 Executing on remote database prod-d1-tutorial (<DATABASE_ID>):
     🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
     Note: if the execution fails to complete, your DB will return to its original state and you can safely retry.
     ├ 🌀 Uploading <DATABASE_ID>.a7f10c4651cc3a26.sql
     │ 🌀 Uploading complete.
     │
     🌀 Starting import...
     🌀 Processed 3 queries.
     🚣 Executed 3 queries in 0.00 seconds (5 rows read, 6 rows written)
     Database is currently at bookmark 00000000-0000000a-00004f6d-b85c16a3dbcf077cb8f258b4d4eb965e.
     ┌────────────────────────┬───────────┬──────────────┬────────────────────┐
     │ Total queries executed │ Rows read │ Rows written │ Database size (MB) │
     ├────────────────────────┼───────────┼──────────────┼────────────────────┤
     │ 3                      │ 5         │ 6            │ 0.02               │
     └────────────────────────┴───────────┴──────────────┴────────────────────┘
     ```

  2. Validate the data is in production by running:

     ```sh
     npx wrangler d1 execute prod-d1-tutorial --remote --command="SELECT * FROM Customers"
     ```

     ```txt
     ⛅️ wrangler 4.33.1
     ───────────────────
     🌀 Executing on remote database jun-d1-db-gs-2025 (cf91ec5c-fa77-4d49-ad8e-e22921b996b2):
     🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
     🚣 Executed 1 command in 0.1797ms
     ┌────────────┬─────────────────────┬───────────────────┐
     │ CustomerId │ CompanyName         │ ContactName       │
     ├────────────┼─────────────────────┼───────────────────┤
     │ 1          │ Alfreds Futterkiste │ Maria Anders      │
     ├────────────┼─────────────────────┼───────────────────┤
     │ 4          │ Around the Horn     │ Thomas Hardy      │
     ├────────────┼─────────────────────┼───────────────────┤
     │ 11         │ Bs Beverages        │ Victoria Ashworth │
     ├────────────┼─────────────────────┼───────────────────┤
     │ 13         │ Bs Beverages        │ Random Name       │
     └────────────┴─────────────────────┴───────────────────┘
     ```

  3. Deploy your Worker to make your project accessible on the Internet. Run:

     ```sh
     npx wrangler deploy
     ```

     ```txt
     ⛅️ wrangler 4.33.1
     ────────────────────
     Total Upload: 0.52 KiB / gzip: 0.33 KiB
     Your Worker has access to the following bindings:
     Binding                                        Resource
     env.prod_d1_tutorial (prod-d1-tutorial)        D1 Database


     Uploaded prod-d1-tutorial (4.17 sec)
     Deployed prod-d1-tutorial triggers (3.49 sec)
     https://prod-d1-tutorial.pcx-team.workers.dev
     Current Version ID: 42c82f1c-ff2b-4dce-9ea2-265adcccd0d5
     ```

     You can now visit the URL for your newly created project to query your live database.

     For example, if the URL of your new Worker is `d1-tutorial.<YOUR_SUBDOMAIN>.workers.dev`, accessing `https://d1-tutorial.<YOUR_SUBDOMAIN>.workers.dev/api/beverages` sends a request to your Worker that queries your live database directly.

  4. Test your database is running successfully. Add `/api/beverages` to the provided Wrangler URL. For example, `https://d1-tutorial.<YOUR_SUBDOMAIN>.workers.dev/api/beverages`.

* Dashboard

  1. In the Cloudflare dashboard, go to the **Workers & Pages** page. [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
  2. Select your `d1-tutorial` Worker.
  3. Select **Deployments**.
  4. From the **Version History** table, select **Deploy version**.
  5. From the **Deploy version** page, select **Deploy**.

  This deploys the latest version of the Worker code to production.

## 6. (Optional) Develop locally with Wrangler

If you are using D1 with Wrangler, you can test your database locally. While in your project directory:

1. Run `wrangler dev`:

   ```sh
   npx wrangler dev
   ```

   When you run `wrangler dev`, Wrangler provides a URL (most likely `localhost:8787`) to review your Worker.

2. Go to the URL.

   The page displays `Call /api/beverages to see everyone who works at Bs Beverages`.

3. Test your database is running successfully. Add `/api/beverages` to the provided Wrangler URL. For example, `localhost:8787/api/beverages`.

If successful, the browser displays your data.

Note

You can only develop locally if you are using Wrangler. You cannot develop locally through the Cloudflare dashboard.

## 7. (Optional) Delete your database

To delete your database:

* CLI

  Run:

  ```sh
  npx wrangler d1 delete prod-d1-tutorial
  ```

* Dashboard

  1. In the Cloudflare dashboard, go to the **D1 SQL database** page.

     [Go to **D1 SQL database**](https://dash.cloudflare.com/?to=/:account/workers/d1)

  2. Select your `prod-d1-tutorial` D1 database.

  3. Select **Settings**.

  4. Select **Delete**.

  5. Type the name of the database (`prod-d1-tutorial`) to confirm the deletion.

Warning

Note that deleting your D1 database will stop your application from functioning as before.

If you want to delete your Worker:

* CLI

  Run:

  ```sh
  npx wrangler delete d1-tutorial
  ```

* Dashboard

  1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

     [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

  2. Select your `d1-tutorial` Worker.

  3. Select **Settings**.

  4. Scroll to the bottom of the page, then select **Delete**.

  5. Type the name of the Worker (`d1-tutorial`) to confirm the deletion.

## Summary

In this tutorial, you have:

* Created a D1 database
* Created a Worker to access that database
* Deployed your project globally

## Next steps

If you have any feature requests or notice any bugs, share your feedback directly with the Cloudflare team by joining the [Cloudflare Developers community on Discord](https://discord.cloudflare.com).

* See supported [Wrangler commands for D1](https://developers.cloudflare.com/workers/wrangler/commands/#d1).
* Learn how to use [D1 Worker Binding APIs](https://developers.cloudflare.com/d1/worker-api/) within your Worker, and test them from the [API playground](https://developers.cloudflare.com/d1/worker-api/#api-playground).
* Explore [community projects built on D1](https://developers.cloudflare.com/d1/reference/community-projects/).
