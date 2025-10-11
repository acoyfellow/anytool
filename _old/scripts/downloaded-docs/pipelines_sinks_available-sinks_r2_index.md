---
title: R2 · Cloudflare Pipelines Docs
description: Write data as JSON or Parquet files to R2 object storage
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2/
  md: https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2/index.md
---

R2 sinks write processed data from pipelines as raw files to [R2 object storage](https://developers.cloudflare.com/r2/). They currently support writing to JSON and Parquet formats.

To create an R2 sink, run the [`pipelines sinks create`](https://developers.cloudflare.com/workers/wrangler/commands/#pipelines-sinks-create) command and specify the sink type and target [bucket](https://developers.cloudflare.com/r2/buckets/):

```bash
npx wrangler pipelines sinks create my-sink \
  --type r2 \
  --bucket my-bucket
```

## Format options

R2 sinks support two output formats:

### JSON format

Write data as newline-delimited JSON files:

```bash
--format json
```

### Parquet format

Write data as Parquet files for better query performance and compression:

```bash
--format parquet --compression zstd
```

**Compression options for Parquet:**

* `zstd` (default) - Best compression ratio
* `snappy` - Fastest compression
* `gzip` - Good compression, widely supported
* `lz4` - Fast compression with reasonable ratio
* `uncompressed` - No compression

**Row group size:** [Row groups](https://parquet.apache.org/docs/file-format/configurations/) are sets of rows in a Parquet file that are stored together, affecting memory usage and query performance. Configure the target row group size in MB:

```bash
--target-row-group-size 256
```

## File organization

Files are written with UUID names within the partitioned directory structure. For example, with path `analytics` and default partitioning:

```plaintext
analytics/year=2025/month=09/day=18/002507a5-d449-48e8-a484-b1bea916102f.parquet
```

### Path

Set a base directory in your bucket where files will be written:

```bash
--path analytics/events
```

### Partitioning

R2 sinks automatically partition files by time using a configurable pattern. The default pattern is `year=%Y/month=%m/day=%d` (Hive-style partitioning).

```bash
--partitioning "year=%Y/month=%m/day=%d/hour=%H"
```

For available format specifiers, refer to [strftime documentation](https://docs.rs/chrono/latest/chrono/format/strftime/index.html).

## Batching and rolling policy

Control when files are written to R2. Configure based on your needs:

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

R2 sinks require an API credentials (Access Key ID and Secret Access Key) with [Object Read & Write permissions](https://developers.cloudflare.com/r2/api/tokens/#permissions) to write data to your bucket.

```bash
npx wrangler pipelines sinks create my-sink \
  --type r2 \
  --bucket my-bucket \
  --access-key-id YOUR_ACCESS_KEY_ID \
  --secret-access-key YOUR_SECRET_ACCESS_KEY
```
