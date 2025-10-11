---
title: AWS RDS and Aurora · Cloudflare Hyperdrive docs
description: Connect Hyperdrive to an AWS RDS or Aurora Postgres database instance.
lastUpdated: 2025-08-20T20:59:04.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/aws-rds-aurora/
  md: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/aws-rds-aurora/index.md
---

This example shows you how to connect Hyperdrive to an Amazon Relational Database Service (Amazon RDS) Postgres or Amazon Aurora database instance.

## 1. Allow Hyperdrive access

To allow Hyperdrive to connect to your database, you will need to ensure that Hyperdrive has valid user credentials and network access.

Note

To allow Hyperdrive to connect to your database, you must allow Cloudflare IPs to be able to access your database. You can either allow-list all IP address ranges (0.0.0.0 - 255.255.255.255) or restrict your IP access control list to the [IP ranges used by Hyperdrive](https://developers.cloudflare.com/hyperdrive/configuration/firewall-and-networking-configuration/).

Alternatively, you can connect to your databases over in your private network using [Cloudflare Tunnels](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/).

### AWS Console

When creating or modifying an instance in the AWS console:

1. Configure a **DB cluster identifier** and other settings you wish to customize.
2. Under **Settings** > **Credential settings**, note down the **Master username** and **Master password** (Aurora only).
3. Under the **Connectivity** header, ensure **Public access** is set to **Yes**.
4. Select an **Existing VPC security group** that allows public Internet access from `0.0.0.0/0` to the port your database instance is configured to listen on (default: `5432` for PostgreSQL instances).
5. Select **Create database**.

Warning

You must ensure that the [VPC security group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) associated with your database allows public IPv4 access to your database port.

Refer to AWS' [database server rules](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html#sg-rules-db-server) for details on how to configure rules specific to your RDS or Aurora database.

### Retrieve the database endpoint (Aurora)

To retrieve the database endpoint (hostname) for Hyperdrive to connect to:

1. Go to **Databases** view under **RDS** in the AWS console.
2. Select the database you want Hyperdrive to connect to.
3. Under the **Endpoints** header, note down the **Endpoint name** with the type `Writer` and the **Port**.

### Retrieve the database endpoint (RDS PostgreSQL)

For regular RDS instances (non-Aurora), you will need to fetch the endpoint and port of the database:

1. Go to **Databases** view under **RDS** in the AWS console.
2. Select the database you want Hyperdrive to connect to.
3. Under the **Connectivity & security** header, note down the **Endpoint** and the **Port**.

The endpoint will resemble `YOUR_DATABASE_NAME.cpuo5rlli58m.AWS_REGION.rds.amazonaws.com` and the port will default to `5432`.

## 2. Create your user

Once your database is created, you will need to create a user for Hyperdrive to connect as. Although you can use the **Master username** configured during initial database creation, best practice is to create a less privileged user.

To create a new user, log in to the database and use the `CREATE ROLE` command:

```sh
# Log in to the database
psql postgresql://MASTER_USERNAME:MASTER_PASSWORD@ENDPOINT_NAME:PORT/database_name
```

Run the following SQL statements:

```sql
-- Create a role for Hyperdrive
CREATE ROLE hyperdrive;


-- Allow Hyperdrive to connect
GRANT CONNECT ON DATABASE postgres TO hyperdrive;


-- Grant database privileges to the hyperdrive role
GRANT ALL PRIVILEGES ON DATABASE postgres to hyperdrive;


-- Create a specific user for Hyperdrive to log in as
CREATE ROLE hyperdrive_user LOGIN PASSWORD 'sufficientlyRandomPassword';


-- Grant this new user the hyperdrive role privileges
GRANT hyperdrive to hyperdrive_user;
```

Refer to AWS' [documentation on user roles in PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.Roles.html) for more details.

With a database user, password, database endpoint (hostname and port) and database name (default: `postgres`), you can now set up Hyperdrive.

## 3. Create a database configuration

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
