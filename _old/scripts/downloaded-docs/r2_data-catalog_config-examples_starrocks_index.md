---
title: StarRocks · Cloudflare R2 docs
description: Below is an example of using StarRocks to connect, query, modify
  data from R2 Data Catalog (read-write).
lastUpdated: 2025-07-31T10:17:29.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/data-catalog/config-examples/starrocks/
  md: https://developers.cloudflare.com/r2/data-catalog/config-examples/starrocks/index.md
---

Below is an example of using [StarRocks](https://docs.starrocks.io/docs/data_source/catalog/iceberg/iceberg_catalog/#rest) to connect, query, modify data from R2 Data Catalog (read-write).

## Prerequisites

* Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
* [Create an R2 bucket](https://developers.cloudflare.com/r2/buckets/create-buckets/) and [enable the data catalog](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/#enable-r2-data-catalog-on-a-bucket).
* [Create an R2 API token](https://developers.cloudflare.com/r2/api/tokens/) with both [R2 and data catalog permissions](https://developers.cloudflare.com/r2/api/tokens/#permissions).
* A running [StarRocks](https://www.starrocks.io/) frontend instance. You can use the [all-in-one](https://docs.starrocks.io/docs/quick_start/shared-nothing/#launch-starrocks) docker setup.

## Example usage

In your running StarRocks instance, run these commands:

```sql
-- Create an Iceberg catalog named `r2` and set it as the current catalog


CREATE EXTERNAL CATALOG r2
PROPERTIES
(
    "type" = "iceberg",
    "iceberg.catalog.type" = "rest",
    "iceberg.catalog.uri" = "<r2_catalog_uri>",
    "iceberg.catalog.security" = "oauth2",
    "iceberg.catalog.oauth2.token" = "<r2_api_token>",
    "iceberg.catalog.warehouse" = "<r2_warehouse_name>"
);


SET CATALOG r2;


-- Create a database and display all databases in newly connected catalog


CREATE DATABASE testdb;


SHOW DATABASES FROM r2;


+--------------------+
| Database           |
+--------------------+
| information_schema |
| testdb             |
+--------------------+
2 rows in set (0.66 sec)
```
