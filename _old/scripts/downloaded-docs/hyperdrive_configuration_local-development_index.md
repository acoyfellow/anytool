---
title: Local development · Cloudflare Hyperdrive docs
description: Hyperdrive can be used when developing and testing your Workers
  locally by connecting to a local database instance running on your machine
  directly, or a remote database instance. Local development uses Wrangler, the
  command-line interface for Workers, to manage local development sessions and
  state.
lastUpdated: 2025-09-30T11:23:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/configuration/local-development/
  md: https://developers.cloudflare.com/hyperdrive/configuration/local-development/index.md
---

Hyperdrive can be used when developing and testing your Workers locally by connecting to a local database instance running on your machine directly, or a remote database instance. Local development uses [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), the command-line interface for Workers, to manage local development sessions and state.

Note

You can connect to a local database for local development using the local connection string configurations for Wrangler, as detailed below. This allows you to connect to a local database instance running on your machine directly.

You can also connect to a remote database for remote development using the `npx wrangler dev --remote` command, which will use the remote database configured for your Hyperdrive configuration.

## Configure local development

To specify a database to connect to when developing locally, you can:

* **Recommended:** Create a `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING_NAME>` [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/) with the connection string of your database. `<BINDING_NAME>` is the name of the binding assigned to your Hyperdrive in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) or Pages configuration. This allows you to avoid committing potentially sensitive credentials to source control in your Wrangler configuration file, if your test/development database is not ephemeral. If you have configured multiple Hyperdrive bindings, replace `<BINDING_NAME>` with the unique binding name for each.
* Set `localConnectionString` in the Wrangler configuration file.

If both the `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING_NAME>` [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/) and `localConnectionString` in the Wrangler configuration file are set, `wrangler dev` will use the environmental variable instead. Use `unset CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING_NAME>` to unset any existing environmental variables.

For example, to use the environmental variable, export the environmental variable before running `wrangler dev`:

```sh
# Your configured Hyperdrive binding is "TEST_DB"
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_TEST_DB="postgres://user:password@localhost:5432/databasename"
# Start a local development session referencing this local instance
npx wrangler dev
```

To configure a `localConnectionString` in the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), ensure your Hyperdrive bindings have a `localConnectionString` property set:

* wrangler.jsonc

  ```jsonc
  {
    "hyperdrive": [
      {
        "binding": "TEST_DB",
        "id": "c020574a-5623-407b-be0c-cd192bab9545",
        "localConnectionString": "postgres://user:password@localhost:5432/databasename"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[hyperdrive]]
  binding = "TEST_DB"
  id = "c020574a-5623-407b-be0c-cd192bab9545"
  localConnectionString = "postgres://user:password@localhost:5432/databasename"
  ```

## Use `wrangler dev`

The following example shows you how to check your wrangler version, set a `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_TEST_DB` [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/), and run a `wrangler dev` session:

```sh
# Confirm you are using wrangler v3.0+
npx wrangler --version
```

```sh
⛅️ wrangler 3.27.0
```

```sh
# Set your environmental variable: your configured Hyperdrive binding is "TEST_DB".
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_TEST_DB="postgres://user:password@localhost:5432/databasename"
```

```sh
# Start a local dev session:
npx wrangler dev
```

```sh
------------------
Found a non-empty CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_TEST_DB variable. Hyperdrive will connect to this database
during local development.


wrangler dev now uses local mode by default, powered by 🔥 Miniflare and 👷 workerd.
To run an edge preview session for your Worker, use wrangler dev --remote
Your worker has access to the following bindings:
- Hyperdrive configs:
  - TEST_DB: c020574a-5623-407b-be0c-cd192bab9545
⎔ Starting local server...


[mf:inf] Ready on http://127.0.0.1:8787/
[b] open a browser, [d] open Devtools, [l] turn off local mode, [c] clear console, [x] to exit
```

`wrangler dev` separates local and production (remote) data. A local session does not have access to your production data by default. To access your production (remote) Hyperdrive configuration, pass the `--remote` flag when calling `wrangler dev`. Any changes you make when running in `--remote` mode cannot be undone.

Refer to the [`wrangler dev` documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev) to learn more about how to configure a local development session.

## Related resources

* Use [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) to run your Worker and Hyperdrive locally and debug issues before deploying.
* Learn [how Hyperdrive works](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/).
* Understand how to [configure query caching in Hyperdrive](https://developers.cloudflare.com/hyperdrive/configuration/query-caching/).
