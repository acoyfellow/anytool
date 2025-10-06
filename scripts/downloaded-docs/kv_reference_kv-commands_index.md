---
title: Wrangler KV commands · Cloudflare Workers KV docs
description: Manage Workers KV namespaces.
lastUpdated: 2024-09-05T08:56:02.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/kv/reference/kv-commands/
  md: https://developers.cloudflare.com/kv/reference/kv-commands/index.md
---

## `kv namespace`

Manage Workers KV namespaces.

Note

The `kv ...` commands allow you to manage your Workers KV resources in the Cloudflare network. Learn more about using Workers KV with Wrangler in the [Workers KV guide](https://developers.cloudflare.com/kv/get-started/).

Warning

Since version 3.60.0, Wrangler supports the `kv ...` syntax. If you are using versions below 3.60.0, the command follows the `kv:...` syntax. Learn more about the deprecation of the `kv:...` syntax in the [Wrangler commands](https://developers.cloudflare.com/kv/reference/kv-commands/#deprecations) for KV page.

## `kv namespace create`

Create a new namespace

* npm

  ```sh
  npx wrangler kv namespace create [NAMESPACE]
  ```

* pnpm

  ```sh
  pnpm wrangler kv namespace create [NAMESPACE]
  ```

* yarn

  ```sh
  yarn wrangler kv namespace create [NAMESPACE]
  ```

- `--namespace` string required

  The name of the new namespace

- `--preview` boolean

  Interact with a preview namespace

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv namespace list`

Output a list of all KV namespaces associated with your account id

* npm

  ```sh
  npx wrangler kv namespace list
  ```

* pnpm

  ```sh
  pnpm wrangler kv namespace list
  ```

* yarn

  ```sh
  yarn wrangler kv namespace list
  ```



Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv namespace delete`

Delete a given namespace.

* npm

  ```sh
  npx wrangler kv namespace delete
  ```

* pnpm

  ```sh
  pnpm wrangler kv namespace delete
  ```

* yarn

  ```sh
  yarn wrangler kv namespace delete
  ```

- `--binding` string

  The binding name to the namespace to delete from

- `--namespace-id` string

  The id of the namespace to delete

- `--preview` boolean

  Interact with a preview namespace

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv namespace rename`

Rename a KV namespace

* npm

  ```sh
  npx wrangler kv namespace rename [OLD-NAME]
  ```

* pnpm

  ```sh
  pnpm wrangler kv namespace rename [OLD-NAME]
  ```

* yarn

  ```sh
  yarn wrangler kv namespace rename [OLD-NAME]
  ```

- `--old-name` string

  The current name (title) of the namespace to rename

- `--namespace-id` string

  The id of the namespace to rename

- `--new-name` string required

  The new name for the namespace

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv key`

Manage key-value pairs within a Workers KV namespace.

Note

The `kv ...` commands allow you to manage your Workers KV resources in the Cloudflare network. Learn more about using Workers KV with Wrangler in the [Workers KV guide](https://developers.cloudflare.com/kv/get-started/).

Warning

Since version 3.60.0, Wrangler supports the `kv ...` syntax. If you are using versions below 3.60.0, the command follows the `kv:...` syntax. Learn more about the deprecation of the `kv:...` syntax in the [Wrangler commands](https://developers.cloudflare.com/kv/reference/kv-commands/) for KV page.

## `kv key put`

Write a single key/value pair to the given namespace

* npm

  ```sh
  npx wrangler kv key put [KEY] [VALUE]
  ```

* pnpm

  ```sh
  pnpm wrangler kv key put [KEY] [VALUE]
  ```

* yarn

  ```sh
  yarn wrangler kv key put [KEY] [VALUE]
  ```

- `--key` string required

  The key to write to

- `--value` string

  The value to write

- `--binding` string

  The binding name to the namespace to write to

- `--namespace-id` string

  The id of the namespace to write to

- `--preview` boolean

  Interact with a preview namespace

- `--ttl` number

  Time for which the entries should be visible

- `--expiration` number

  Time since the UNIX epoch after which the entry expires

- `--metadata` string

  Arbitrary JSON that is associated with a key

- `--path` string

  Read value from the file at a given path

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv key list`

Output a list of all keys in a given namespace

* npm

  ```sh
  npx wrangler kv key list
  ```

* pnpm

  ```sh
  pnpm wrangler kv key list
  ```

* yarn

  ```sh
  yarn wrangler kv key list
  ```

- `--binding` string

  The binding name to the namespace to list

- `--namespace-id` string

  The id of the namespace to list

- `--preview` boolean default: false

  Interact with a preview namespace

- `--prefix` string

  A prefix to filter listed keys

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv key get`

Read a single value by key from the given namespace

* npm

  ```sh
  npx wrangler kv key get [KEY]
  ```

* pnpm

  ```sh
  pnpm wrangler kv key get [KEY]
  ```

* yarn

  ```sh
  yarn wrangler kv key get [KEY]
  ```

- `--key` string required

  The key value to get.

- `--binding` string

  The binding name to the namespace to get from

- `--namespace-id` string

  The id of the namespace to get from

- `--preview` boolean default: false

  Interact with a preview namespace

- `--text` boolean default: false

  Decode the returned value as a utf8 string

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv key delete`

Remove a single key value pair from the given namespace

* npm

  ```sh
  npx wrangler kv key delete [KEY]
  ```

* pnpm

  ```sh
  pnpm wrangler kv key delete [KEY]
  ```

* yarn

  ```sh
  yarn wrangler kv key delete [KEY]
  ```

- `--key` string required

  The key value to delete.

- `--binding` string

  The binding name to the namespace to delete from

- `--namespace-id` string

  The id of the namespace to delete from

- `--preview` boolean

  Interact with a preview namespace

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv bulk`

Manage multiple key-value pairs within a Workers KV namespace in batches.

Note

The `kv ...` commands allow you to manage your Workers KV resources in the Cloudflare network. Learn more about using Workers KV with Wrangler in the [Workers KV guide](https://developers.cloudflare.com/kv/get-started/).

Warning

Since version 3.60.0, Wrangler supports the `kv ...` syntax. If you are using versions below 3.60.0, the command follows the `kv:...` syntax. Learn more about the deprecation of the `kv:...` syntax in the [Wrangler commands](https://developers.cloudflare.com/kv/reference/kv-commands/) for KV page.

## `kv bulk get`

Gets multiple key-value pairs from a namespace

* npm

  ```sh
  npx wrangler kv bulk get [FILENAME]
  ```

* pnpm

  ```sh
  pnpm wrangler kv bulk get [FILENAME]
  ```

* yarn

  ```sh
  yarn wrangler kv bulk get [FILENAME]
  ```

- `--filename` string required

  The file containing the keys to get

- `--binding` string

  The binding name to the namespace to get from

- `--namespace-id` string

  The id of the namespace to get from

- `--preview` boolean

  Interact with a preview namespace

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv bulk put`

Upload multiple key-value pairs to a namespace

* npm

  ```sh
  npx wrangler kv bulk put [FILENAME]
  ```

* pnpm

  ```sh
  pnpm wrangler kv bulk put [FILENAME]
  ```

* yarn

  ```sh
  yarn wrangler kv bulk put [FILENAME]
  ```

- `--filename` string required

  The file containing the key/value pairs to write

- `--binding` string

  The binding name to the namespace to write to

- `--namespace-id` string

  The id of the namespace to write to

- `--preview` boolean

  Interact with a preview namespace

- `--ttl` number

  Time for which the entries should be visible

- `--expiration` number

  Time since the UNIX epoch after which the entry expires

- `--metadata` string

  Arbitrary JSON that is associated with a key

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## `kv bulk delete`

Delete multiple key-value pairs from a namespace

* npm

  ```sh
  npx wrangler kv bulk delete [FILENAME]
  ```

* pnpm

  ```sh
  pnpm wrangler kv bulk delete [FILENAME]
  ```

* yarn

  ```sh
  yarn wrangler kv bulk delete [FILENAME]
  ```

- `--filename` string required

  The file containing the keys to delete

- `--binding` string

  The binding name to the namespace to delete from

- `--namespace-id` string

  The id of the namespace to delete from

- `--preview` boolean

  Interact with a preview namespace

- `--force` boolean alias: --f

  Do not ask for confirmation before deleting

- `--local` boolean

  Interact with local storage

- `--remote` boolean

  Interact with remote storage

- `--persist-to` string

  Directory for local persistence

Global flags

* `--v` boolean alias: --version

  Show version number

* `--cwd` string

  Run as if Wrangler was started in the specified directory instead of the current working directory

* `--config` string alias: --c

  Path to Wrangler configuration file

* `--env` string alias: --e

  Environment to use for operations, and for selecting .env and .dev.vars files

* `--env-file` string

  Path to an .env file to load - can be specified multiple times - values from earlier files are overridden by values in later files

* `--experimental-remote-bindings` boolean aliases: --x-remote-bindings default: true

  Experimental: Enable Remote Bindings

* `--experimental-provision` boolean aliases: --x-provision

  Experimental: Enable automatic resource provisioning

## Deprecations

Below are deprecations to Wrangler commands for Workers KV.

### `kv:...` syntax deprecation

Since version 3.60.0, Wrangler supports the `kv ...` syntax. If you are using versions below 3.60.0, the command follows the `kv:...` syntax.

The `kv:...` syntax is deprecated in versions 3.60.0 and beyond and will be removed in a future major version.

For example, commands using the `kv ...` syntax look as such:

```sh
wrangler kv namespace list
wrangler kv key get <KEY>
wrangler kv bulk put <FILENAME>
```

The same commands using the `kv:...` syntax look as such:

```sh
wrangler kv:namespace list
wrangler kv:key get <KEY>
wrangler kv:bulk put <FILENAME>
```
