---
title: Wrangler commands · R2 SQL docs
description: Query a table in R2 Data Catalog using R2 SQL
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2-sql/platform/wrangler-commands/
  md: https://developers.cloudflare.com/r2-sql/platform/wrangler-commands/index.md
---

Note

R2 SQL is currently in open beta. Report R2 SQL bugs in [GitHub](https://github.com/cloudflare/workers-sdk/issues/new/choose). R2 SQL expects there to be a [`WRANGLER_R2_SQL_AUTH_TOKEN`](https://developers.cloudflare.com/r2-sql/query-data/#authentication) environment variable to be set.

### `query`

Query a table in R2 Data Catalog using R2 SQL

```txt
wrangler r2 sql query <warehouse> <query>
```

* `warehouse` string required
  * Your R2 Data Catalog [warehouse name](https://developers.cloudflare.com/r2-sql/query-data/#get-your-warehouse-name).
* `query` string required
  * The SQL query to execute. Refer to the [SQL reference](https://developers.cloudflare.com/r2-sql/sql-reference/).

## Global commands

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.
