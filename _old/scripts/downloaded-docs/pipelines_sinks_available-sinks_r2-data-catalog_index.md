---
title: R2 Data Catalog · Cloudflare Pipelines Docs
description: Write data as Apache Iceberg tables to R2 Data Catalog
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2-data-catalog/
  md: https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2-data-catalog/index.md
---

R2 Data Catalog sinks write processed data from pipelines as [Apache Iceberg](https://iceberg.apache.org/) tables to [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/). Iceberg tables provide ACID transactions, schema evolution, and time travel capabilities for analytics workloads.

To create an R2 Data Catalog sink, run the [`pipelines sinks create`](https://developers.cloudflare.com/workers/wrangler/commands/#pipelines-sinks-create) command and specify the sink type, target bucket, namespace, and table name:

```bash
npx wrangler pipelines sinks create my-sink \
  --type r2-data-catalog \
  --bucket my-bucket \
  --namespace my_namespace \
  --table my_table \
  --catalog-token YOUR_CATALOG_TOKEN
```

The sink will create the specified namespace and table if they do not exist. Sinks cannot be created for existing Iceberg tables.

## Format

R2 Data Catalog sinks only support Parquet format. JSON format is not supported for Iceberg tables.

### Compression options

Configure Parquet compression for optimal storage and query performance:

```bash
--compression zstd
```

**Available compression options:**

* `zstd` (default) - Best compression ratio
* `snappy` - Fastest compression
* `gzip` - Good compression, widely supported
* `lz4` - Fast compression with reasonable ratio
* `uncompressed` - No compression

### Row group size

[Row groups](https://parquet.apache.org/docs/file-format/configurations/) are sets of rows in a Parquet file that are stored together, affecting memory usage and query performance. Configure the target row group size in MB:

```bash
--target-row-group-size 256
```

## Batching and rolling policy

Control when data is written to Iceberg tables. Configure based on your needs:

* **Lower values**: More frequent writes, smaller files, lower latency
* **Higher values**: Less frequent writes, larger files, better query performance

### Roll interval

Set how often files are written (default: 300 seconds):

```bash
--roll-interval 60  # Write files every 60 seconds
```

### Roll size

Set maximum file size in MB before creating a new file:

```bash
--roll-size 100  # Create new file after 100MB
```

## Authentication

R2 Data Catalog sinks require an API token with [R2 Admin Read & Write permissions](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs/#create-api-token-in-the-dashboard). This permission grants the sink access to both R2 Data Catalog and R2 storage.

```bash
--catalog-token YOUR_CATALOG_TOKEN
```
