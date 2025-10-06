---
title: Getting started · Cloudflare Pipelines Docs
description: Create your first pipeline to ingest streaming data and write to R2
  Data Catalog as an Apache Iceberg table.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/getting-started/
  md: https://developers.cloudflare.com/pipelines/getting-started/index.md
---

This guide will instruct you through:

* Creating your first [R2 bucket](https://developers.cloudflare.com/r2/buckets/) and enabling its [data catalog](https://developers.cloudflare.com/r2/data-catalog/).
* Creating an [API token](https://developers.cloudflare.com/r2/api/tokens/) needed for pipelines to authenticate with your data catalog.
* Creating your first pipeline with a simple ecommerce schema that writes to an [Apache Iceberg](https://iceberg.apache.org/) table managed by R2 Data Catalog.
* Sending sample ecommerce data via HTTP endpoint.
* Validating data in your bucket and querying it with R2 SQL.

## Prerequisites

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
2. Install [`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), discussed later in this guide, requires a Node version of `16.17.0` or later.

## 1. Create an R2 bucket

* Wrangler CLI

  1. If not already logged in, run:

     ```plaintext
     npx wrangler login
     ```

  2. Create an R2 bucket:

     ```plaintext
     npx wrangler r2 bucket create pipelines-tutorial
     ```

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select **Create bucket**.

  3. Enter the bucket name: pipelines-tutorial

  4. Select **Create bucket**.

## 2. Enable R2 Data Catalog

* Wrangler CLI

  Enable the catalog on your R2 bucket:

  ```plaintext
  npx wrangler r2 bucket catalog enable pipelines-tutorial
  ```

  When you run this command, take note of the "Warehouse" and "Catalog URI". You will need these later.

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket: pipelines-tutorial.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and select **Enable**.

  4. Once enabled, note the **Catalog URI** and **Warehouse name**.

## 3. Create an API token

Pipelines must authenticate to R2 Data Catalog with an [R2 API token](https://developers.cloudflare.com/r2/api/tokens/) that has catalog and R2 permissions.

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Select **Manage API tokens**.

3. Select **Create Account API token**.

4. Give your API token a name.

5. Under **Permissions**, choose the **Admin Read & Write** permission.

6. Select **Create Account API Token**.

7. Note the **Token value**.

Note

This token also includes the R2 SQL Read permission, which allows you to query your data with R2 SQL.

## 4. Create your first pipeline

* Wrangler CLI

  First, create a schema file that defines your ecommerce data structure:

  **Create `schema.json`:**

  ```json
  {
    "fields": [
      {
        "name": "user_id",
        "type": "string",
        "required": true
      },
      {
        "name": "event_type",
        "type": "string",
        "required": true
      },
      {
        "name": "product_id",
        "type": "string",
        "required": false
      },
      {
        "name": "amount",
        "type": "float64",
        "required": false
      }
    ]
  }
  ```

  Use the interactive setup to create a pipeline that writes to R2 Data Catalog:

  ```bash
  npx wrangler pipelines setup
  ```

  Follow the prompts:

  1. **Pipeline name**: Enter `ecommerce`

  2. **Stream configuration**:

     * Enable HTTP endpoint: `yes`
     * Require authentication: `no` (for simplicity)
     * Configure custom CORS origins: `no`
     * Schema definition: `Load from file`
     * Schema file path: `schema.json` (or your file path)

  3. **Sink configuration**:

     * Destination type: `Data Catalog Table`
     * R2 bucket name: `pipelines-tutorial`
     * Namespace: `default`
     * Table name: `ecommerce`
     * Catalog API token: Enter your token from step 3
     * Compression: `zstd`
     * Roll file when size reaches (MB): `100`
     * Roll file when time reaches (seconds): `10` (for faster data visibility in this tutorial)

  4. **SQL transformation**: Choose `Use simple ingestion query` to use:

     ```sql
     INSERT INTO ecommerce_sink SELECT * FROM ecommerce_stream
     ```

  After setup completes, note the HTTP endpoint URL displayed in the final output.

* Dashboard

  1. In the Cloudflare dashboard, go to **Pipelines** > **Pipelines**.

     [Go to **Pipelines**](https://dash.cloudflare.com/?to=/:account/pipelines)

  2. Select **Create Pipeline**.

  3. **Connect to a Stream**:

     * Pipeline name: `ecommerce`
     * Enable HTTP endpoint for sending data: Enabled
     * HTTP authentication: Disabled (default)
     * Select **Next**

  4. **Define Input Schema**:

     * Select **JSON editor**

     * Copy in the schema:

       ```json
       {
         "fields": [
           {
             "name": "user_id",
             "type": "string",
             "required": true
           },
           {
             "name": "event_type",
             "type": "string",
             "required": true
           },
           {
             "name": "product_id",
             "type": "string",
             "required": false
           },
           {
             "name": "amount",
             "type": "f64",
             "required": false
           }
         ]
       }
       ```

     * Select **Next**

  5. **Define Sink**:

     * Select your R2 bucket: `pipelines-tutorial`
     * Storage type: **R2 Data Catalog**
     * Namespace: `default`
     * Table name: `ecommerce`
     * **Advanced Settings**: Change **Maximum Time Interval** to `10 seconds`
     * Select **Next**

  6. **Credentials**:

     * Disable **Automatically create an Account API token for your sink**
     * Enter **Catalog Token** from step 3
     * Select **Next**

  7. **Pipeline Definition**:

     * Leave the default SQL query:

       ```sql
       INSERT INTO ecommerce_sink SELECT * FROM ecommerce_stream;
       ```

     * Select **Create Pipeline**

  8. After pipeline creation, note the **Stream ID** for the next step.

## 5. Send sample data

Send ecommerce events to your pipeline's HTTP endpoint:

```bash
curl -X POST https://{stream-id}.ingest.cloudflare.com \
  -H "Content-Type: application/json" \
  -d '[
    {
      "user_id": "user_12345",
      "event_type": "purchase",
      "product_id": "widget-001",
      "amount": 29.99
    },
    {
      "user_id": "user_67890",
      "event_type": "view_product",
      "product_id": "widget-002"
    },
    {
      "user_id": "user_12345",
      "event_type": "add_to_cart",
      "product_id": "widget-003",
      "amount": 15.50
    }
  ]'
```

Replace `{stream-id}` with your actual stream endpoint from the pipeline setup.

## 6. Validate data in your bucket

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

2. Select your bucket: `pipelines-tutorial`.

3. You should see Iceberg metadata files and data files created by your pipeline. Note: If you aren't seeing any files in your bucket, try waiting a couple of minutes and trying again.

4. The data is organized in the Apache Iceberg format with metadata tracking table versions.

## 7. Query your data using R2 SQL

Set up your environment to use R2 SQL:

```bash
export WRANGLER_R2_SQL_AUTH_TOKEN=YOUR_API_TOKEN
```

Or create a `.env` file with:

```plaintext
WRANGLER_R2_SQL_AUTH_TOKEN=YOUR_API_TOKEN
```

Where `YOUR_API_TOKEN` is the token you created in step 3. For more information on setting environment variables, refer to [Wrangler system environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/).

Query your data:

```bash
npx wrangler r2 sql query "YOUR_WAREHOUSE_NAME" "
SELECT
    user_id,
    event_type,
    product_id,
    amount
FROM default.ecommerce
WHERE event_type = 'purchase'
LIMIT 10"
```

Replace `YOUR_WAREHOUSE_NAME` with the warehouse name from step 2.

You can also query this table with any engine that supports Apache Iceberg. To learn more about connecting other engines to R2 Data Catalog, refer to [Connect to Iceberg engines](https://developers.cloudflare.com/r2/data-catalog/config-examples/).

## Learn more

[Streams ](https://developers.cloudflare.com/pipelines/streams/)Learn about configuring streams for data ingestion.

[Pipelines ](https://developers.cloudflare.com/pipelines/pipelines/)Understand SQL transformations and pipeline configuration.

[Sinks ](https://developers.cloudflare.com/pipelines/sinks/)Configure data destinations and output formats.
