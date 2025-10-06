---
title: Wrangler commands · Cloudflare D1 docs
description: D1 Wrangler commands use REST APIs to interact with the control
  plane. This page lists the Wrangler commands for D1.
lastUpdated: 2024-12-16T09:18:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/wrangler-commands/
  md: https://developers.cloudflare.com/d1/wrangler-commands/index.md
---

D1 Wrangler commands use REST APIs to interact with the control plane. This page lists the Wrangler commands for D1.

### `create`

Creates a new D1 database, and provides the binding and UUID that you will put in your Wrangler file.

```txt
wrangler d1 create <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the new D1 database.

* `--location` string optional

  * Provide an optional [location hint](https://developers.cloudflare.com/d1/configuration/data-location/) for your database leader.
  * Available options include `weur` (Western Europe), `eeur` (Eastern Europe), `apac` (Asia Pacific), `oc` (Oceania), `wnam` (Western North America), and `enam` (Eastern North America).

### `info`

Get information about a D1 database, including the current database size and state.

```txt
wrangler d1 info <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database to get information about.
* `--json` boolean optional
  * Return output as JSON rather than a table.

### `list`

List all D1 databases in your account.

```txt
wrangler d1 list [OPTIONS]
```

* `--json` boolean optional
  * Return output as JSON rather than a table.

### `delete`

Delete a D1 database.

```txt
wrangler d1 delete <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database to delete.
* `-y, --skip-confirmation` boolean optional
  * Skip deletion confirmation prompt.

### `execute`

Execute a query on a D1 database.

```txt
wrangler d1 execute <DATABASE_NAME> [OPTIONS]
```

Note

You must provide either `--command` or `--file` for this command to run successfully.

* `DATABASE_NAME` string required
  * The name of the D1 database to execute a query on.
* `--command` string optional
  * The SQL query you wish to execute.
* `--file` string optional
  * Path to the SQL file you wish to execute.
* `-y, --yes` boolean optional
  * Answer `yes` to any prompts.
* `--local` boolean (default: true) optional
  * Execute commands/files against a local database for use with [wrangler dev](https://developers.cloudflare.com/workers/wrangler/commands/#dev).
* `--remote` boolean (default: false) optional
  * Execute commands/files against a remote D1 database for use with [remote bindings](https://developers.cloudflare.com/workers/development-testing/#remote-bindings) or your deployed Worker.
* `--persist-to` string optional
  * Specify directory to use for local persistence (for use in combination with `--local`).
* `--json` boolean optional
  * Return output as JSON rather than a table.
* `--preview` boolean optional
  * Execute commands/files against a preview D1 database (as defined by `preview_database_id` in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases)).

### `export`

Export a D1 database or table's schema and/or content to a `.sql` file.

```txt
wrangler d1 export <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database to export.
* `--local` boolean (default: true) optional
  * Export from a local database for use with [wrangler dev](https://developers.cloudflare.com/workers/wrangler/commands/#dev).
* `--remote` boolean (default: false) optional
  * Export from a remote D1 database.
* `--output` string required
  * Path to the SQL file for your export.
* `--table` string optional
  * The name of the table within a D1 database to export.
* `--no-data` boolean (default: false) optional
  * Controls whether export SQL file contains database data. Note that `--no-data=true` is not recommended due to a known wrangler limitation that intreprets the value as false.
* `--no-schema` boolean (default: false) optional
  * Controls whether export SQL file contains database schema. Note that `--no-schema=true` is not recommended due to a known wrangler limitation that intreprets the value as false.

### `time-travel restore`

Restore a database to a specific point-in-time using [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).

```txt
wrangler d1 time-travel restore <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database to execute a query on.
* `--bookmark` string optional
  * A D1 bookmark representing the state of a database at a specific point in time.
* `--timestamp` string optional
  * A UNIX timestamp or JavaScript date-time `string` within the last 30 days.
* `--json` boolean optional
  * Return output as JSON rather than a table.

### `time-travel info`

Inspect the current state of a database for a specific point-in-time using [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).

```txt
wrangler d1 time-travel info <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database to execute a query on.
* `--timestamp` string optional
  * A UNIX timestamp or JavaScript date-time `string` within the last 30 days.
* `--json` bboolean optional
  * Return output as JSON rather than a table.

### `migrations create`

Create a new migration.

This will generate a new versioned file inside the `migrations` folder. Name your migration file as a description of your change. This will make it easier for you to find your migration in the `migrations` folder. An example filename looks like:

`0000_create_user_table.sql`

The filename will include a version number and the migration name you specify below.

```txt
wrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME>
```

* `DATABASE_NAME` string required
  * The name of the D1 database you wish to create a migration for.
* `MIGRATION_NAME` string required
  * A descriptive name for the migration you wish to create.

### `migrations list`

View a list of unapplied migration files.

```txt
wrangler d1 migrations list <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database you wish to list unapplied migrations for.
* `--local` boolean optional
  * Show the list of unapplied migration files on your locally persisted D1 database.
* `--remote` boolean (default: false) optional
  * Show the list of unapplied migration files on your remote D1 database.
* `--persist-to` string optional
  * Specify directory to use for local persistence (for use in combination with `--local`).
* `--preview` boolean optional
  * Show the list of unapplied migration files on your preview D1 database (as defined by `preview_database_id` in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases)).

### `migrations apply`

Apply any unapplied migrations.

This command will prompt you to confirm the migrations you are about to apply. Confirm that you would like to proceed. After, a backup will be captured.

The progress of each migration will be printed in the console.

When running the apply command in a CI/CD environment or another non-interactive command line, the confirmation step will be skipped, but the backup will still be captured.

If applying a migration results in an error, this migration will be rolled back, and the previous successful migration will remain applied.

```txt
wrangler d1 migrations apply <DATABASE_NAME> [OPTIONS]
```

* `DATABASE_NAME` string required
  * The name of the D1 database you wish to apply your migrations on.
* `--env` string optional
  * Specify which environment configuration to use for D1 binding
* `--local` boolean (default: true) optional
  * Execute any unapplied migrations on your locally persisted D1 database.
* `--remote` boolean (default: false) optional
  * Execute any unapplied migrations on your remote D1 database.
* `--persist-to` string optional
  * Specify directory to use for local persistence (for use in combination with `--local`).
* `--preview` boolean optional
  * Execute any unapplied migrations on your preview D1 database (as defined by `preview_database_id` in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases)).

## Global commands

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

## Experimental commands

### `insights`

Returns statistics about your queries.

```sh
npx wrangler d1 insights <database_name> --<option>
```

For more information, see [Query `insights`](https://developers.cloudflare.com/d1/observability/metrics-analytics/#query-insights).
