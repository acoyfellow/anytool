---
title: Manage catalogs · Cloudflare R2 docs
description: Understand how to manage Iceberg REST catalogs associated with R2 buckets
lastUpdated: 2025-09-25T04:10:41.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/
  md: https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/index.md
---

Learn how to:

* Enable and disable [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/) on your buckets.
* Authenticate Iceberg engines using API tokens.

## Enable R2 Data Catalog on a bucket

Enabling the catalog on a bucket turns on the REST catalog interface and provides a **Catalog URI** and **Warehouse name** required by Iceberg clients. Once enabled, you can create and manage Iceberg tables in that bucket.

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket you want to enable as a data catalog.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and select **Enable**.

  4. Once enabled, note the **Catalog URI** and **Warehouse name**.

* Wrangler CLI

  To enable the catalog on your bucket, run the [`r2 bucket catalog enable command`](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-catalog-enable):

  ```bash
  npx wrangler r2 bucket catalog enable <BUCKET_NAME>
  ```

  After enabling, Wrangler will return your catalog URI and warehouse name.

## Disable R2 Data Catalog on a bucket

When you disable the catalog on a bucket, it immediately stops serving requests from the catalog interface. Any Iceberg table references stored in that catalog become inaccessible until you re-enable it.

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket where you want to disable the data catalog.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and select **Disable**.

* Wrangler CLI

  To disable the catalog on your bucket, run the [`r2 bucket catalog disable command`](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-catalog-disable):

  ```bash
  npx wrangler r2 bucket catalog disable <BUCKET_NAME>
  ```

## Enable compaction

Compaction improves query performance by combining the many small files created during data ingestion into fewer, larger files according to the set `target file size`. For more information about compaction and why it's valuable, refer to [About compaction](https://developers.cloudflare.com/r2/data-catalog/about-compaction/).

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket you want to enable compaction on.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and click on the **Edit** icon next to the compaction card.

  4. Enable compaction and optionally set a target file size. The default is 128 MB.

  5. (Optional) Provide a Cloudflare API token for compaction to access and rewrite files in your bucket.

  6. Select **Save**.

* Wrangler CLI

  To enable the compaction on your catalog, run the [`r2 bucket catalog enable command`](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-catalog-compaction-enable):

  ```bash
  npx wrangler r2 bucket catalog compaction enable <BUCKET_NAME>  --target-size 128 --token <API_TOKEN>
  ```

API token permission requirements

Compaction requires a Cloudflare API token with both R2 storage and R2 Data Catalog read/write permissions to act as a service credential. The compaction process uses this token to read files, combine them, and update table metadata.

Refer to [Authenticate your Iceberg engine](#authenticate-your-iceberg-engine) for details on creating a token with the required permissions.

Once enabled, compaction applies retroactively to all existing tables and automatically to newly created tables. During open beta, we currently compact up to 2 GB worth of files once per hour for each table.

## Disable compaction

Disabling compaction will prevent the process from running for all tables managed by the catalog. You can re-enable it at any time.

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket you want to enable compaction on.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and click on the **edit** icon next to the compaction card.

  4. Disable compaction.

  5. Select **Save**.

* Wrangler CLI

  To disable the compaction on your catalog, run the [`r2 bucket catalog disable command`](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-catalog-compaction-disable):

  ```bash
  npx wrangler r2 bucket catalog compaction disable <BUCKET_NAME>
  ```

## Authenticate your Iceberg engine

To connect your Iceberg engine to R2 Data Catalog, you must provide a Cloudflare API token with **both** R2 Data Catalog permissions and R2 storage permissions. Iceberg engines interact with R2 Data Catalog to perform table operations. The catalog also provides engines with SigV4 credentials, which are required to access the underlying data files stored in R2.

### Create API token in the dashboard

Create an [R2 API token](https://developers.cloudflare.com/r2/api/tokens/#permissions) with **Admin Read & Write** or **Admin Read only** permissions. These permissions include both:

* Access to R2 Data Catalog (read-only or read/write, depending on chosen permission)
* Access to R2 storage (read-only or read/write, depending on chosen permission)

Providing the resulting token value to your Iceberg engine gives it the ability to manage catalog metadata and handle data operations (reads or writes to R2).

### Create API token via API

To create an API token programmatically for use with R2 Data Catalog, you'll need to specify both R2 Data Catalog and R2 storage permission groups in your [Access Policy](https://developers.cloudflare.com/r2/api/tokens/#access-policy).

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
        "id": "d229766a2f7f4d299f20eaa8c9b1fde9",
        "name": "Workers R2 Data Catalog Write"
      },
      {
        "id": "2efd5506f9c8494dacb1fa10a3e7d5b6",
        "name": "Workers R2 Storage Bucket Item Write"
      }
    ]
  }
]
```

To learn more about how to create API tokens for R2 Data Catalog using the API, including required permission groups and usage examples, refer to the [Create API tokens via API documentation](https://developers.cloudflare.com/r2/api/tokens/#create-api-tokens-via-api).

## Learn more

[Get started ](https://developers.cloudflare.com/r2/data-catalog/get-started/)Learn how to enable the R2 Data Catalog on your bucket, load sample data, and run your first query.

[Connect to Iceberg engines ](https://developers.cloudflare.com/r2/data-catalog/config-examples/)Find detailed setup instructions for Apache Spark and other common query engines.
