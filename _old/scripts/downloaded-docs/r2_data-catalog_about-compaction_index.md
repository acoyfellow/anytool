---
title: About compaction · Cloudflare R2 docs
description: Learn about R2 Data Catalog compaction
lastUpdated: 2025-09-25T04:10:41.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/data-catalog/about-compaction/
  md: https://developers.cloudflare.com/r2/data-catalog/about-compaction/index.md
---

## What is compaction?

Compaction is the process of taking a group of small files and combining them into fewer larger files. This is an important maintenance operation as it helps ensure that query performance remains consistent by reducing the number of files that needs to be scanned.

## Why do I need compaction?

Every write operation in [Apache Iceberg](https://iceberg.apache.org/), no matter how small or large, results in a series of new files being generated. As time goes on, the number of files can grow unbounded. This can lead to:

* Slower queries and increased I/O operations: Without compaction, query engines will have to open and read each individual file, resulting in longer query times and increased costs.
* Increased metadata overhead: Query engines must scan metadata files to determine which ones to read. With thousands of small files, query planning takes longer even before data is accessed.
* Reduced compression efficiency: Smaller files compress less efficiently than larger files, leading to higher storage costs and more data to transfer during queries.

## R2 Data Catalog automatic compaction

R2 Data Catalog can now [manage compaction](https://developers.cloudflare.com/r2/data-catalog/manage-catalogs) for Apache Iceberg tables stored in R2. When enabled, compaction runs automatically and combines new files that have not been compacted yet.

Compacted files are prefixed with `compacted-` in the `/data/` directory.

### Choosing the right target file size

You can configure the target file size for compaction. Currently, the minimum is 64 MB and the maximum is 512 MB.

Different compute engines have different optimal file sizes, so check their documentation.

Performance tradeoffs depend on your use case. For example, queries that return small amounts of data may perform better with smaller files, as larger files could result in reading unnecessary data.

* For workloads that are more latency sensitive, consider a smaller target file size (for example, 64 MB - 128 MB)
* For streaming ingest workloads, consider medium file sizes (for example, 128 MB - 256 MB)
* For OLAP style queries that need to scan a lot of data, consider larger file sizes (for example, 256 MB - 512 MB)

## Current limitations

* During open beta, compaction will compact up to 2 GB worth of files once per hour for each table.
* Only data files stored in parquet format are currently supported with compaction.
* Snapshot expiration and orphan file cleanup is not supported yet.
* Minimum target file size is 64 MB and maximum is 512 MB.
