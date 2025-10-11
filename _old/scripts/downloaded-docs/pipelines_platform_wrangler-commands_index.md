---
title: Wrangler commands · Cloudflare Pipelines Docs
description: Create a new pipeline
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/platform/wrangler-commands/
  md: https://developers.cloudflare.com/pipelines/platform/wrangler-commands/index.md
---

Note

Pipelines is currently in open beta. Report Pipelines bugs in [GitHub](https://github.com/cloudflare/workers-sdk/issues/new/choose).

### `create`

Create a new pipeline

```txt
wrangler pipelines create <PIPELINE_NAME> [OPTIONS]
```

* `PIPELINE_NAME` string required
  * The name of the pipeline to create.
* `--sql` string optional
  * Inline SQL query for the pipeline. Refer to [SQL reference](https://developers.cloudflare.com/pipelines/sql-reference/).
* `--sql-file` string optional
  * Path to file containing SQL query for the pipeline. Refer to [SQL reference](https://developers.cloudflare.com/pipelines/sql-reference/).

### `delete`

Delete a pipeline

```txt
wrangler pipelines delete <PIPELINE_ID> [OPTIONS]
```

* `PIPELINE_ID` string required
  * The ID of the pipeline to delete.
* `--force` boolean optional
  * Skip confirmation.

### `get`

Get details about a specific pipeline

```txt
wrangler pipelines get <PIPELINE_ID> [OPTIONS]
```

* `PIPELINE_ID` string required
  * The ID of the pipeline to retrieve.
* `--json` boolean optional
  * Output in JSON format.

### `list`

List all pipelines

```txt
wrangler pipelines list [OPTIONS]
```

* `--page` number optional
  * Page number for pagination.
* `--per-page` number optional
  * Number of pipelines per page.
* `--json` boolean optional
  * Output in JSON format.

### `setup`

Interactive setup for a complete pipeline

```txt
wrangler pipelines setup [OPTIONS]
```

* `--name` string optional
  * Pipeline name.

### `streams create`

Create a new stream

```txt
wrangler pipelines streams create <STREAM_NAME> [OPTIONS]
```

* `STREAM_NAME` string required
  * The name of the stream to create.
* `--schema-file` string optional
  * Path to JSON file containing stream schema. Refer to [schema configuration](https://developers.cloudflare.com/pipelines/streams/manage-streams/#schema-configuration).
* `--http-enabled` boolean optional
  * Enable HTTP endpoint. Defaults to `true`.
* `--http-auth` boolean optional
  * Require authentication for HTTP endpoint. Defaults to `true`.
* `--cors-origin` array optional
  * CORS origin.

### `streams delete`

Delete a stream

```txt
wrangler pipelines streams delete <STREAM_ID> [OPTIONS]
```

* `STREAM_ID` string required
  * The ID of the stream to delete.
* `--force` boolean optional
  * Skip confirmation.

### `streams get`

Get details about a specific stream

```txt
wrangler pipelines streams get <STREAM_ID> [OPTIONS]
```

* `STREAM_ID` string required
  * The ID of the stream to retrieve.
* `--json` boolean optional
  * Output in JSON format.

### `streams list`

List all streams

```txt
wrangler pipelines streams list [OPTIONS]
```

* `--page` number optional
  * Page number for pagination
* `--per-page` number optional
  * Number of streams per page.
* `--pipeline-id` string optional
  * Filter streams by pipeline ID.
* `--json` boolean optional
  * Output in JSON format

### `sinks create`

Create a new sink

```txt
wrangler pipelines sinks create <SINK_NAME> [OPTIONS]
```

* `SINK_NAME` string required
  * The name of the sink to create.
* `--type` string required
  * The type of sink to create. Choices: [`r2`](https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2/), [`r2-data-catalog`](https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2-data-catalog/).
* `--bucket` string required
  * R2 bucket name.
* `--format` string optional
  * Output format. Choices: `json`, `parquet`.
* `--compression` string optional
  * Compression method (parquet only). Choices: `uncompressed`, `snappy`, `gzip`, `zstd`, `lz4`.
* `--target-row-group-size` string optional
  * Target row group size for parquet format (parquet only).
* `--path` string optional
  * The base prefix in your bucket where data will be written (r2 sinks only).
* `--partitioning` string optional
  * Time partition pattern (r2 sinks only).
* `--roll-size` number optional
  * Roll file size in MB.
* `--roll-interval` number optional
  * Roll file interval in seconds.
* `--access-key-id` string optional
  * R2 access key ID (required for r2 sinks). Refer to [R2 sink authentication](https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2/#authentication).
* `--secret-access-key` string optional
  * R2 secret access key (required for r2 sinks). Refer to [R2 sink authentication](https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2/#authentication).
* `--namespace` string optional
  * Data catalog namespace (required for r2-data-catalog).
* `--table` string optional
  * Table name within namespace (required for r2-data-catalog).
* `--catalog-token` string optional
  * Authentication token for data catalog (required for r2-data-catalog sinks). Refer to [R2 Data Catalog authentication](https://developers.cloudflare.com/pipelines/sinks/available-sinks/r2-data-catalog/#authentication).

### `sinks delete`

Delete a sink

```txt
wrangler pipelines sinks delete <SINK_ID> [OPTIONS]
```

* `SINK_ID` string required
  * The ID of the sink to delete.
* `--force` boolean optional
  * Skip confirmation.

### `sinks get`

Get details about a specific sink

```txt
wrangler pipelines sinks get <SINK_ID> [OPTIONS]
```

* `SINK_ID` string required
  * The ID of the sink to retrieve.
* `--json` boolean optional
  * Output in JSON format.

### `sinks list`

List all sinks

```txt
wrangler pipelines sinks list [OPTIONS]
```

* `--page` number optional
  * Page number for pagination
* `--per-page` number optional
  * Number of sinks per page.
* `--pipeline-id` string optional
  * Filter sinks by pipeline ID.
* `--json` boolean optional
  * Output in JSON format

## Global commands

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.
