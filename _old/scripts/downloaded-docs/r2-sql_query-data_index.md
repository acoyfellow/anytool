---
title: Query data · R2 SQL docs
description: Understand how to query data with R2 SQL
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2-sql/query-data/
  md: https://developers.cloudflare.com/r2-sql/query-data/index.md
---

Query [Apache Iceberg](https://iceberg.apache.org/) tables managed by [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/). R2 SQL queries can be made via [Wrangler](https://developers.cloudflare.com/workers/wrangler/) or HTTP API.

## Get your warehouse name

To query data with R2 SQL, you'll need your warehouse name associated with your [catalog](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/). To retrieve it, you can run the [`r2 bucket catalog get` command](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-catalog-get):

```bash
npx wrangler r2 bucket catalog get <BUCKET_NAME>
```

Alternatively, you can find it in the dashboard by going to the **R2 object storage** page, selecting the bucket, switching to the **Settings** tab, scrolling to **R2 Data Catalog**, and finding **Warehouse name**.

## Query via Wrangler

To begin, install [`npm`](https://docs.npmjs.com/getting-started). Then [install Wrangler, the Developer Platform CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

Wrangler needs an API token with permissions to access R2 Data Catalog, R2 storage, and R2 SQL to execute queries. The `r2 sql query` command looks for the token in the `WRANGLER_R2_SQL_AUTH_TOKEN` environment variable.

Set up your environment:

```bash
export WRANGLER_R2_SQL_AUTH_TOKEN=YOUR_API_TOKEN
```

Or create a `.env` file with:

```plaintext
WRANGLER_R2_SQL_AUTH_TOKEN=YOUR_API_TOKEN
```

Where `YOUR_API_TOKEN` is the token you created with the [required permissions](#authentication). For more information on setting environment variables, refer to [Wrangler system environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/).

To run a SQL query, run the [`r2 sql query` command](https://developers.cloudflare.com/workers/wrangler/commands/#r2-sql-query):

```bash
npx wrangler r2 sql query <WAREHOUSE> "SELECT * FROM namespace.table_name limit 10;"
```

For a full list of supported sql commands, refer to the [R2 SQL reference page](https://developers.cloudflare.com/r2-sql/sql-reference).

## Query via API

Below is an example of using R2 SQL via the REST endpoint:

```bash
curl -X POST \
  "https://api.sql.cloudflarestorage.com/api/v1/accounts/{ACCOUNT_ID}/r2-sql/query/{BUCKET_NAME}" \
  -H "Authorization: Bearer ${WRANGLER_R2_SQL_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM namespace.table_name limit 10;"
  }'
```

The API requires an API token with the appropriate permissions in the Authorization header. Refer to [Authentication](#authentication) for details on creating a token.

For a full list of supported sql commands, refer to the [R2 SQL reference page](https://developers.cloudflare.com/r2-sql/sql-reference).

## Authentication

To query data with R2 SQL, you must provide a Cloudflare API token with R2 SQL, R2 Data Catalog, and R2 storage permissions. R2 SQL requires these permissions to access catalog metadata and read the underlying data files stored in R2.

### Create API token in the dashboard

Create an [R2 API token](https://developers.cloudflare.com/r2/api/tokens/#permissions) with **Admin Read only** permission. This permission includes:

* Access to R2 Data Catalog (read-only)
* Access to R2 storage (read-only)
* Access to R2 SQL (read-only)

Use this token value for the `WRANGLER_R2_SQL_AUTH_TOKEN` environment variable when querying with Wrangler, or in the Authorization header when using the REST API.

### Create API token via API

To create an API token programmatically for use with R2 SQL, you'll need to specify R2 SQL, R2 Data Catalog, and R2 storage permission groups in your [Access Policy](https://developers.cloudflare.com/r2/api/tokens/#access-policy).

#### Example Access Policy

```json
[
  {
    "id": "f267e341f3dd4697bd3b9f71dd96247f",
    "effect": "allow",
    "resources": {
      "com.cloudflare.edge.r2.bucket.4793d734c0b8e484dfc37ec392b5fa8a_default_my-bucket": "*",
      "com.cloudflare.edge.r2.bucket.4793d734c0b8e484dfc37ec392b5fa8a_eu_my-eu-bucket": "*"
    },
    "permission_groups": [
      {
        "id": "45db74139a62490b9b60eb7c4f34994b",
        "name": "Workers R2 Data Catalog Read"
      },
      {
        "id": "6a018a9f2fc74eb6b293b0c548f38b39",
        "name": "Workers R2 Storage Bucket Item Read"
      },
      {
        "id": "f45430d92e2b4a6cb9f94f2594c141b8",
        "name": "Workers R2 SQL Read"
      }
    ]
  }
]
```

To learn more about how to create API tokens for R2 SQL using the API, including required permission groups and usage examples, refer to the [Create API tokens via API documentation](https://developers.cloudflare.com/r2/api/tokens/#create-api-tokens-via-api).

## Additional resources

[Manage R2 Data Catalogs ](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/)Enable or disable R2 Data Catalog on your bucket, retrieve configuration details, and authenticate your Iceberg engine.

[Build an end to end data pipeline ](https://developers.cloudflare.com/r2-sql/tutorials/end-to-end-pipeline)Detailed tutorial for setting up a simple fraud detection data pipeline, and generate events for it in Python.
