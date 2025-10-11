---
title: Overview · Cloudflare Hyperdrive docs
description: Hyperdrive is a service that accelerates queries you make to
  existing databases, making it faster to access your data from across the globe
  from Cloudflare Workers, irrespective of your users' location.
lastUpdated: 2025-09-09T08:38:23.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/
  md: https://developers.cloudflare.com/hyperdrive/index.md
---

Turn your existing regional database into a globally distributed database.

Available on Free and Paid plans

Hyperdrive is a service that accelerates queries you make to existing databases, making it faster to access your data from across the globe from [Cloudflare Workers](https://developers.cloudflare.com/workers/), irrespective of your users' location.

Hyperdrive supports any Postgres or MySQL database, including those hosted on AWS, Google Cloud, Azure, Neon and PlanetScale. Hyperdrive also supports Postgres-compatible databases like CockroachDB and Timescale. You do not need to write new code or replace your favorite tools: Hyperdrive works with your existing code and tools you use.

Use Hyperdrive's connection string from your Cloudflare Workers application with your existing Postgres drivers and object-relational mapping (ORM) libraries:

* PostgreSQL

  * index.ts

    ```ts
    import postgres from 'postgres';


    export default {
      async fetch(request, env, ctx): Promise<Response> {
        // Hyperdrive provides a unique generated connection string to connect to
        // your database via Hyperdrive that can be used with your existing tools
        const sql = postgres(env.HYPERDRIVE.connectionString);


          try {
            // Sample SQL query
            const results = await sql`SELECT * FROM pg_tables`;
            return Response.json(results);
          } catch (e) {
            return Response.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
          }
        },


    } satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
    ```

  * wrangler.jsonc

    ```json
      {
        "$schema": "node_modules/wrangler/config-schema.json",
        "name": "WORKER-NAME",
        "main": "src/index.ts",
        "compatibility_date": "2025-02-04",
        "compatibility_flags": [
          "nodejs_compat"
        ],
        "observability": {
          "enabled": true
        },
        "hyperdrive": [
          {
            "binding": "HYPERDRIVE",
            "id": "<YOUR_HYPERDRIVE_ID>",
            "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
          }
        ]
      }
    ```

* MySQL

  * index.ts

    ```ts
    import { createConnection  } from 'mysql2/promise';


    export default {
      async fetch(request, env, ctx): Promise<Response> {
        const connection = await createConnection({
         host: env.HYPERDRIVE.host,
         user: env.HYPERDRIVE.user,
         password: env.HYPERDRIVE.password,
         database: env.HYPERDRIVE.database,
         port: env.HYPERDRIVE.port,


         // This is needed to use mysql2 with Workers
         // This configures mysql2 to use static parsing instead of eval() parsing (not available on Workers)
         disableEval: true
      });


      const [results, fields] = await connection.query('SHOW tables;');


      return new Response(JSON.stringify({ results, fields }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '\*',
        },
      });
    }} satisfies ExportedHandler<Env>;
    ```

  * wrangler.jsonc

    ```json
      {
        "$schema": "node_modules/wrangler/config-schema.json",
        "name": "WORKER-NAME",
        "main": "src/index.ts",
        "compatibility_date": "2025-02-04",
        "compatibility_flags": [
          "nodejs_compat"
        ],
        "observability": {
          "enabled": true
        },
        "hyperdrive": [
          {
            "binding": "HYPERDRIVE",
            "id": "<YOUR_HYPERDRIVE_ID>",
            "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
          }
        ]
      }
    ```

* index.ts

  ```ts
  import postgres from 'postgres';


  export default {
    async fetch(request, env, ctx): Promise<Response> {
      // Hyperdrive provides a unique generated connection string to connect to
      // your database via Hyperdrive that can be used with your existing tools
      const sql = postgres(env.HYPERDRIVE.connectionString);


        try {
          // Sample SQL query
          const results = await sql`SELECT * FROM pg_tables`;
          return Response.json(results);
        } catch (e) {
          return Response.json({ error: e instanceof Error ? e.message : e }, { status: 500 });
        }
      },


  } satisfies ExportedHandler<{ HYPERDRIVE: Hyperdrive }>;
  ```

* wrangler.jsonc

  ```json
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "WORKER-NAME",
      "main": "src/index.ts",
      "compatibility_date": "2025-02-04",
      "compatibility_flags": [
        "nodejs_compat"
      ],
      "observability": {
        "enabled": true
      },
      "hyperdrive": [
        {
          "binding": "HYPERDRIVE",
          "id": "<YOUR_HYPERDRIVE_ID>",
          "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
        }
      ]
    }
  ```

* index.ts

  ```ts
  import { createConnection  } from 'mysql2/promise';


  export default {
    async fetch(request, env, ctx): Promise<Response> {
      const connection = await createConnection({
       host: env.HYPERDRIVE.host,
       user: env.HYPERDRIVE.user,
       password: env.HYPERDRIVE.password,
       database: env.HYPERDRIVE.database,
       port: env.HYPERDRIVE.port,


       // This is needed to use mysql2 with Workers
       // This configures mysql2 to use static parsing instead of eval() parsing (not available on Workers)
       disableEval: true
    });


    const [results, fields] = await connection.query('SHOW tables;');


    return new Response(JSON.stringify({ results, fields }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '\*',
      },
    });
  }} satisfies ExportedHandler<Env>;
  ```

* wrangler.jsonc

  ```json
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "WORKER-NAME",
      "main": "src/index.ts",
      "compatibility_date": "2025-02-04",
      "compatibility_flags": [
        "nodejs_compat"
      ],
      "observability": {
        "enabled": true
      },
      "hyperdrive": [
        {
          "binding": "HYPERDRIVE",
          "id": "<YOUR_HYPERDRIVE_ID>",
          "localConnectionString": "<ENTER_LOCAL_CONNECTION_STRING_FOR_LOCAL_DEVELOPMENT_HERE>"
        }
      ]
    }
  ```

[Get started](https://developers.cloudflare.com/hyperdrive/get-started/)

***

## Features

### Connect your database

Connect Hyperdrive to your existing database and deploy a [Worker](https://developers.cloudflare.com/workers/) that queries it.

[Connect Hyperdrive to your database](https://developers.cloudflare.com/hyperdrive/get-started/)

### PostgreSQL support

Hyperdrive allows you to connect to any PostgreSQL or PostgreSQL-compatible database.

[Connect Hyperdrive to your PostgreSQL database](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)

### MySQL support

Hyperdrive allows you to connect to any MySQL database.

[Connect Hyperdrive to your MySQL database](https://developers.cloudflare.com/hyperdrive/examples/connect-to-mysql/)

### Query Caching

Default-on caching for your most popular queries executed against your database.

[Learn about Query Caching](https://developers.cloudflare.com/hyperdrive/configuration/query-caching/)

***

## Related products

**[Workers](https://developers.cloudflare.com/workers/)**

Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

**[Pages](https://developers.cloudflare.com/pages/)**

Deploy dynamic front-end applications in record time.

***

## More resources

[Pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/)

Learn about Hyperdrive's pricing.

[Limits](https://developers.cloudflare.com/hyperdrive/platform/limits/)

Learn about Hyperdrive limits.

[Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)

Learn more about the storage and database options you can build on with Workers.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Developer Platform.
