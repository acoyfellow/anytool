---
title: Apache Trino · Cloudflare R2 docs
description: Below is an example of using Apache Trino to connect to R2 Data
  Catalog. For more information on connecting to R2 Data Catalog with Trino,
  refer to Trino documentation.
lastUpdated: 2025-09-05T20:58:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/data-catalog/config-examples/trino/
  md: https://developers.cloudflare.com/r2/data-catalog/config-examples/trino/index.md
---

Below is an example of using [Apache Trino](https://trino.io/) to connect to R2 Data Catalog. For more information on connecting to R2 Data Catalog with Trino, refer to [Trino documentation](https://trino.io/docs/current/connector/iceberg.html).

## Prerequisites

* Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
* [Create an R2 bucket](https://developers.cloudflare.com/r2/buckets/create-buckets/) and [enable the data catalog](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/#enable-r2-data-catalog-on-a-bucket).
* [Create an R2 API token, key, and secret](https://developers.cloudflare.com/r2/api/tokens/) with both [R2 and data catalog permissions](https://developers.cloudflare.com/r2/api/tokens/#permissions).
* Install [Docker](https://docs.docker.com/get-docker/) to run the Trino container.

## Setup

Create a local directory for the catalog configuration and change directories to it

```bash
mkdir -p trino-catalog && cd trino-catalog/
```

Create a configuration file called `r2.properties` for your R2 Data Catalog connection:

```properties
# r2.properties
connector.name=iceberg


# R2 Configuration
fs.native-s3.enabled=true
s3.region=auto
s3.aws-access-key=<Your R2 access key>
s3.aws-secret-key=<Your R2 secret>
s3.endpoint=<Your R2 endpoint>
s3.path-style-access=true


# R2 Data Catalog Configuration
iceberg.catalog.type=rest
iceberg.rest-catalog.uri=<Your R2 Data Catalog URI>
iceberg.rest-catalog.warehouse=<Your R2 Data Catalog warehouse>
iceberg.rest-catalog.security=OAUTH2
iceberg.rest-catalog.oauth2.token=<Your R2 authentication token>
```

## Example usage

1. Start Trino with the R2 catalog configuration:

   ```bash
   # Create a local directory for the catalog configuration
   mkdir -p trino-catalog


   # Place your r2.properties file in the catalog directory
   cp r2.properties trino-catalog/


   # Run Trino with the catalog configuration
   docker run -d \
     --name trino-r2 \
     -p 8080:8080 \
     -v $(pwd)/trino-catalog:/etc/trino/catalog \
     trinodb/trino:latest
   ```

2. Connect to Trino and query your R2 Data Catalog:

   ```bash
   # Connect to the Trino CLI
   docker exec -it trino-r2 trino
   ```

3. In the Trino CLI, run the following commands:

   ```sql
   -- Show all schemas in the R2 catalog
   SHOW SCHEMAS IN r2;


   -- Show all schemas in the R2 catalog
   CREATE SCHEMA r2.example_schema


   -- Create a table with some values in it
   CREATE TABLE r2.example_schema.yearly_clicks (
       year,
       clicks
   )
   WITH (
      partitioning = ARRAY['year']
   )
   AS VALUES
       (2021, 10000),
       (2022, 20000);


   -- Show tables in a specific schema
   SHOW TABLES IN r2.example_schema;


   -- Query your Iceberg table
   SELECT * FROM r2.example_schema.yearly_clicks;
   ```
