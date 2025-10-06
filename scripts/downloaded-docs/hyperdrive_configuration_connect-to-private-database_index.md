---
title: Connect to a private database using Tunnel · Cloudflare Hyperdrive docs
description: Hyperdrive can securely connect to your private databases using
  Cloudflare Tunnel and Cloudflare Access.
lastUpdated: 2025-09-16T17:43:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/
  md: https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/index.md
---

Hyperdrive can securely connect to your private databases using [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) and [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/).

## How it works

When your database is isolated within a private network (such as a [virtual private cloud](https://www.cloudflare.com/learning/cloud/what-is-a-virtual-private-cloud) or an on-premise network), you must enable a secure connection from your network to Cloudflare.

* [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) is used to establish the secure tunnel connection.
* [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) is used to restrict access to your tunnel such that only specific Hyperdrive configurations can access it.

A request from the Cloudflare Worker to the origin database goes through Hyperdrive, Cloudflare Access, and the Cloudflare Tunnel established by `cloudflared`. `cloudflared` must be running in the private network in which your database is accessible.

The Cloudflare Tunnel will establish an outbound bidirectional connection from your private network to Cloudflare. Cloudflare Access will secure your Cloudflare Tunnel to be only accessible by your Hyperdrive configuration.

![A request from the Cloudflare Worker to the origin database goes through Hyperdrive, Cloudflare Access and the Cloudflare Tunnel established by cloudflared.](https://developers.cloudflare.com/_astro/hyperdrive-private-database-architecture.BrGTjEln_2iaw6y.webp)

## Before you start

All of the tutorials assume you have already completed the [Get started guide](https://developers.cloudflare.com/workers/get-started/guide/), which gets you set up with a Cloudflare Workers account, [C3](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare), and [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

Warning

If your organization also uses [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/), keep **Definitely Automated** set to **Allow**. Otherwise, tunnels might fail with a `websocket: bad handshake` error.

## Prerequisites

* A database in your private network, [configured to use TLS/SSL](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/#supported-tls-ssl-modes).
* A hostname on your Cloudflare account, which will be used to route requests to your database.

## 1. Create a tunnel in your private network

### 1.1. Create a tunnel

First, create a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) in your private network to establish a secure connection between your network and Cloudflare. Your network must be configured such that the tunnel has permissions to egress to the Cloudflare network and access the database within your network.

1. Log in to [Zero Trust](https://one.dash.cloudflare.com) and go to **Networks** > **Tunnels**.

2. Select **Create a tunnel**.

3. Choose **Cloudflared** for the connector type and select **Next**.

4. Enter a name for your tunnel. We suggest choosing a name that reflects the type of resources you want to connect through this tunnel (for example, `enterprise-VPC-01`).

5. Select **Save tunnel**.

6. Next, you will need to install `cloudflared` and run it. To do so, check that the environment under **Choose an environment** reflects the operating system on your machine, then copy the command in the box below and paste it into a terminal window. Run the command.

7. Once the command has finished running, your connector will appear in Zero Trust.

   ![Connector appearing in the UI after cloudflared has run](https://developers.cloudflare.com/_astro/connector.DgDJjokf_1bYl1O.webp)

8. Select **Next**.

### 1.2. Connect your database using a public hostname

Your tunnel must be configured to use a public hostname on Cloudflare so that Hyperdrive can route requests to it. If you don't have a hostname on Cloudflare yet, you will need to [register a new hostname](https://developers.cloudflare.com/registrar/get-started/register-domain/) or [add a zone](https://developers.cloudflare.com/dns/zone-setups/) to Cloudflare to proceed.

1. In the **Published application routes** tab, choose a **Domain** and specify any subdomain or path information. This will be used in your Hyperdrive configuration to route to this tunnel.

2. In the **Service** section, specify **Type** `TCP` and the URL and configured port of your database, such as `localhost:5432` or `my-database-host.database-provider.com:5432`. This address will be used by the tunnel to route requests to your database.

3. Select **Save tunnel**.

Note

If you are setting up the tunnel through the CLI instead ([locally-managed tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/local-management/)), you will have to complete these steps manually. Follow the Cloudflare Zero Trust documentation to [add a public hostname to your tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/) and [configure the public hostname to route to the address of your database](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/local-management/configuration-file/).

## 2. Create and configure Hyperdrive to connect to the Cloudflare Tunnel

To restrict access to the Cloudflare Tunnel to Hyperdrive, a [Cloudflare Access application](https://developers.cloudflare.com/cloudflare-one/applications/) must be configured with a [Policy](https://developers.cloudflare.com/cloudflare-one/policies/) that requires requests to contain a valid [Service Auth token](https://developers.cloudflare.com/cloudflare-one/policies/access/#service-auth).

The Cloudflare dashboard can automatically create and configure the underlying [Cloudflare Access application](https://developers.cloudflare.com/cloudflare-one/applications/), [Service Auth token](https://developers.cloudflare.com/cloudflare-one/policies/access/#service-auth), and [Policy](https://developers.cloudflare.com/cloudflare-one/policies/) on your behalf. Alternatively, you can manually create the Access application and configure the Policies.

Automatic creation

### 2.1. (Automatic) Create a Hyperdrive configuration in the Cloudflare dashboard

Create a Hyperdrive configuration in the Cloudflare dashboard to automatically configure Hyperdrive to connect to your Cloudflare Tunnel.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/hyperdrive), navigate to **Storage & Databases > Hyperdrive** and click **Create configuration**.
2. Select **Private database**.
3. In the **Networking details** section, select the tunnel you are connecting to.
4. In the **Networking details** section, select the hostname associated to the tunnel. If there is no hostname for your database, return to step [1.2. Connect your database using a public hostname](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/#12-connect-your-database-using-a-public-hostname).
5. In the **Access Service Authentication Token** section, select **Create new (automatic)**.
6. In the **Access Application** section, select **Create new (automatic)**.
7. In the **Database connection details** section, enter the database **name**, **user**, and **password**.

Manual creation

### 2.1. (Manual) Create a service token

The service token will be used to restrict requests to the tunnel, and is needed for the next step.

1. In [Zero Trust](https://one.dash.cloudflare.com), go to **Access** > **Service auth** > **Service Tokens**.

2. Select **Create Service Token**.

3. Name the service token. The name allows you to easily identify events related to the token in the logs and to revoke the token individually.

4. Set a **Service Token Duration** of `Non-expiring`. This prevents the service token from expiring, ensuring it can be used throughout the life of the Hyperdrive configuration.

5. Select **Generate token**. You will see the generated Client ID and Client Secret for the service token, as well as their respective request headers.

6. Copy the Access Client ID and Access Client Secret. These will be used when creating the Hyperdrive configuration.

   Warning

   This is the only time Cloudflare Access will display the Client Secret. If you lose the Client Secret, you must regenerate the service token.

### 2.2. (Manual) Create an Access application to secure the tunnel

[Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) will be used to verify that requests to the tunnel originate from Hyperdrive using the service token created above.

1. In [Zero Trust](https://one.dash.cloudflare.com), go to **Access** > **Applications**.

2. Select **Add an application**.

3. Select **Self-hosted**.

4. Enter any name for the application.

5. In **Session Duration**, select `No duration, expires immediately`.

6. Select **Add public hostname**. and enter the subdomain and domain that was previously set for the tunnel application.

7. Select **Create new policy**.

8. Enter a **Policy name** and set the **Action** to *Service Auth*.

9. Create an **Include** rule. Specify a **Selector** of *Service Token* and the **Value** of the service token you created in step [2. Create a service token](#21-create-a-service-token).

10. Save the policy.

11. Go back to the application configuration and add the newly created Access policy.

12. In **Login methods**, turn off *Accept all available identity providers* and clear all identity providers.

13. Select **Next**.

14. In **Application Appearance**, turn off **Show application in App Launcher**.

15. Select **Next**.

16. Select **Next**.

17. Save the application.

### 2.3. (Manual) Create a Hyperdrive configuration

To create a Hyperdrive configuration for your private database, you'll need to specify the Access application and Cloudflare Tunnel information upon creation.

* Wrangler

  ```sh
  # wrangler v3.65 and above required
  npx wrangler hyperdrive create <NAME-OF-HYPERDRIVE-CONFIGURATION-FOR-DB-VIA-TUNNEL> --host=<HOSTNAME-FOR-THE-TUNNEL> --user=<USERNAME-FOR-YOUR-DATABASE> --password=<PASSWORD-FOR-YOUR-DATABASE> --database=<DATABASE-TO-CONNECT-TO> --access-client-id=<YOUR-ACCESS-CLIENT-ID> --access-client-secret=<YOUR-SERVICE-TOKEN-CLIENT-SECRET>
  ```

* Terraform

  ```terraform
  resource "cloudflare_hyperdrive_config"  "<TERRAFORM_VARIABLE_NAME_FOR_CONFIGURATION>" {
    account_id = "<YOUR_ACCOUNT_ID>"
    name       = "<NAME_OF_HYPERDRIVE_CONFIGURATION>"
    origin     = {
      host     = "<HOSTNAME_OF_TUNNEL>"
      database = "<NAME_OF_DATABASE>"
      user     = "<NAME_OF_DATABASE_USER>"
      password = "<DATABASE_PASSWORD>"
      scheme   = "postgres"
      access_client_id     = "<ACCESS_CLIENT_ID>"
      access_client_secret = "<ACCESS_CLIENT_SECRET>"
    }
    caching = {
      disabled = false
    }
  }
  ```

This will create a Hyperdrive configuration using the usual database information (database name, database host, database user, and database password).

In addition, it will also set the Access Client ID and the Access Client Secret of the Service Token. When Hyperdrive makes requests to the tunnel, requests will be intercepted by Access and validated using the credentials of the Service Token.

Note

When creating the Hyperdrive configuration for the private database, you must enter the `access-client-id` and the `access-client-id`, and omit the `port`. Hyperdrive will route database messages to the public hostname of the tunnel, and the tunnel will rely on its service configuration (as configured in [1.2. Connect your database using a public hostname](#12-connect-your-database-using-a-public-hostname)) to route requests to the database within your private network.

## 3. Query your Hyperdrive configuration from a Worker (optional)

To test your Hyperdrive configuration to the database using Cloudflare Tunnel and Access, use the Hyperdrive configuration ID in your Worker and deploy it.

### 3.1. Create a Hyperdrive binding

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

### 3.2. Query your database

Validate that you can connect to your database from Workers and make queries.

* PostgreSQL

  Use Postgres.js to send a test query to validate that the connection has been successful.

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

  Now, deploy your Worker:

  ```bash
  npx wrangler deploy
  ```

  If you successfully receive the list of `pg_tables` from your database when you access your deployed Worker, your Hyperdrive has now been configured to securely connect to a private database using [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) and [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/).

* MySQL

  Use [mysql2](https://github.com/sidorares/node-mysql2) to send a test query to validate that the connection has been successful.

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

  Now, deploy your Worker:

  ```bash
  npx wrangler deploy
  ```

  If you successfully receive the list of tables from your database when you access your deployed Worker, your Hyperdrive has now been configured to securely connect to a private database using [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) and [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/).

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

## Troubleshooting

If you encounter issues when setting up your Hyperdrive configuration with tunnels to a private database, consider these common solutions, in addition to [general troubleshooting steps](https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/) for Hyperdrive:

* Ensure your database is configured to use TLS (SSL). Hyperdrive requires TLS (SSL) to connect.
