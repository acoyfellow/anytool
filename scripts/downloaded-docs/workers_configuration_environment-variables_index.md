---
title: Environment variables · Cloudflare Workers docs
description: You can add environment variables, which are a type of binding, to
  attach text strings or JSON values to your Worker.
lastUpdated: 2025-09-09T12:12:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/configuration/environment-variables/
  md: https://developers.cloudflare.com/workers/configuration/environment-variables/index.md
---

## Background

You can add environment variables, which are a type of binding, to attach text strings or JSON values to your Worker. Environment variables are available on the [`env` parameter](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/#parameters) passed to your Worker's [`fetch` event handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/).

Text strings and JSON values are not encrypted and are useful for storing application configuration.

## Add environment variables via Wrangler

To add env variables using Wrangler, define text and JSON via the `[vars]` configuration in your Wrangler file. In the following example, `API_HOST` and `API_ACCOUNT_ID` are text values and `SERVICE_X_DATA` is a JSON value.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker-dev",
    "vars": {
      "API_HOST": "example.com",
      "API_ACCOUNT_ID": "example_user",
      "SERVICE_X_DATA": {
        "URL": "service-x-api.dev.example",
        "MY_ID": 123
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker-dev"


  [vars]
  API_HOST = "example.com"
  API_ACCOUNT_ID = "example_user"
  SERVICE_X_DATA = { URL = "service-x-api.dev.example", MY_ID = 123 }
  ```

Refer to the following example on how to access the `API_HOST` environment variable in your Worker code:

* JavaScript

  ```js
  export default {
    async fetch(request, env, ctx) {
      return new Response(`API host: ${env.API_HOST}`);
    },
  };
  ```

* TypeScript

  ```ts
  export interface Env {
    API_HOST: string;
  }


  export default {
    async fetch(request, env, ctx): Promise<Response> {
      return new Response(`API host: ${env.API_HOST}`);
    },
  } satisfies ExportedHandler<Env>;
  ```

### Configuring different environments in Wrangler

[Environments in Wrangler](https://developers.cloudflare.com/workers/wrangler/environments) let you specify different configurations for the same Worker, including different values for `vars` in each environment. As `vars` is a [non-inheritable key](https://developers.cloudflare.com/workers/wrangler/configuration/#non-inheritable-keys), they are not inherited by environments and must be specified for each environment.

The example below sets up two environments, `staging` and `production`, with different values for `API_HOST`.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker-dev",
    "vars": {
      "API_HOST": "api.example.com"
    },
    "env": {
      "staging": {
        "vars": {
          "API_HOST": "staging.example.com"
        }
      },
      "production": {
        "vars": {
          "API_HOST": "production.example.com"
        }
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker-dev"


  # top level environment
  [vars]
  API_HOST = "api.example.com"


  [env.staging.vars]
  API_HOST = "staging.example.com"


  [env.production.vars]
  API_HOST = "production.example.com"
  ```

To run Wrangler commands in specific environments, you can pass in the `--env` or `-e` flag. For example, you can develop the Worker in an environment called `staging` by running `npx wrangler dev --env staging`, and deploy it with `npx wrangler deploy --env staging`.

Learn about [environments in Wrangler](https://developers.cloudflare.com/workers/wrangler/environments).

## Add environment variables via the dashboard

To add environment variables via the dashboard:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. In **Overview**, select your Worker.

3. Select **Settings**.

4. Under **Variables and Secrets**, select **Add**.

5. Select a **Type**, input a **Variable name**, and input its **Value**. This variable will be made available to your Worker.

6. (Optional) To add multiple environment variables, select **Add variable**.

7. Select **Deploy** to implement your changes.

Plaintext strings and secrets

Select the **Secret** type if your environment variable is a [secret](https://developers.cloudflare.com/workers/configuration/secrets/). Alternatively, consider [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/), for account-level secrets.

## Compare secrets and environment variables

Use secrets for sensitive information

Do not use plaintext environment variables to store sensitive information. Use [secrets](https://developers.cloudflare.com/workers/configuration/secrets/) or [Secrets Store bindings](https://developers.cloudflare.com/secrets-store/integrations/workers/) instead.

[Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) are [environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/). The difference is secret values are not visible within Wrangler or Cloudflare dashboard after you define them. This means that sensitive data, including passwords or API tokens, should always be encrypted to prevent data leaks. To your Worker, there is no difference between an environment variable and a secret. The secret's value is passed through as defined.

### Local development with secrets

Warning

Do not use `vars` to store sensitive information in your Worker's Wrangler configuration file. Use secrets instead.

Put secrets for use in local development in either a `.dev.vars` file or a `.env` file, in the same directory as the Wrangler configuration file.

Choose to use either `.dev.vars` or `.env` but not both. If you define a `.dev.vars` file, then values in `.env` files will not be included in the `env` object during local development.

These files should be formatted using the [dotenv](https://hexdocs.pm/dotenvy/dotenv-file-format.html) syntax. For example:

```bash
SECRET_KEY="value"
API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
```

Do not commit secrets to git

The `.dev.vars` and `.env` files should not committed to git. Add `.dev.vars*` and `.env*` to your project's `.gitignore` file.

To set different secrets for each Cloudflare environment, create files named `.dev.vars.<environment-name>` or `.env.<environment-name>`.

When you select a Cloudflare environment in your local development, the corresponding environment-specific file will be loaded ahead of the generic `.dev.vars` (or `.env`) file.

* When using `.dev.vars.<environment-name>` files, all secrets must be defined per environment. If `.dev.vars.<environment-name>` exists then only this will be loaded; the `.dev.vars` file will not be loaded.

* In contrast, all matching `.env` files are loaded and the values are merged. For each variable, the value from the most specific file is used, with the following precedence:

  * `.env.<environment-name>.local` (most specific)
  * `.env.local`
  * `.env.<environment-name>`
  * `.env` (least specific)

Controlling `.env` handling

It is possible to control how `.env` files are loaded in local development by setting environment variables on the process running the tools.

* To disable loading local dev vars from `.env` files without providing a `.dev.vars` file, set the `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV` environment variable to `"false"`.
* To include every environment variable defined in your system's process environment as a local development variable, ensure there is no `.dev.vars` and then set the `CLOUDFLARE_INCLUDE_PROCESS_ENV` environment variable to `"true"`.

## Environment variables and Node.js compatibility

When you enable both the [`nodejs_compat`](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) and [`nodejs_compat_populate_process_env`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs_compat_populate_process_env) compatibility flags, and the `disallow_importable_env` compatibility flag is not set, environment variables will also be available via the global `process.env`. Note that the `nodejs_compat_populate_process_env` flag is enabled automatically when `nodejs_compat` is used with a compatibility date on or after April 1st, 2025.

The `process.env` will be populated lazily the first time that `process` is accessed in the worker.

Text variable values are exposed directly.

JSON variable values that evaluate to string values are exposed as the parsed value.

JSON variable values that do not evaluate to string values are exposed as the raw JSON string.

For example, imagine a Worker with three environment variables, two text values, and one JSON value:

```plaintext
[vars]
FOO =  "abc"
BAR =  "abc"
BAZ = { "a": 123 }
```

Environment variables can be added using either the `wrangler.{json|jsonc|toml}` file or via the Cloudflare dashboard UI.

The values of `process.env.FOO` and `process.env.BAR` will each be the JavaScript string `"abc"`.

The value of `process.env.BAZ` will be the JSON-encoded string `"{ \"a\": 123 }"`.

Note

Note also that because secrets are a form of environment variable within the runtime, secrets are also exposed via `process.env`.

## Related resources

* Migrating environment variables from [Service Worker format to ES modules syntax](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/#environment-variables).
