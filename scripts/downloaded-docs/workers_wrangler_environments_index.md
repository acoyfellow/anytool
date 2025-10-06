---
title: Environments · Cloudflare Workers docs
description: Use environments to create different configurations for the same
  Worker application.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/wrangler/environments/
  md: https://developers.cloudflare.com/workers/wrangler/environments/index.md
---

Wrangler allows you to use environments to create different configurations for the same Worker application. Environments are configured in the Worker's [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).

When you create an environment, Cloudflare effectively creates a new Worker with the name `<top-level-name>-<environment-name>`. For example, a Worker project named `my-worker` with an environment `dev` would deploy as a Worker named `my-worker-dev`.

Review the following environments flow:

1. Create a Worker, named `my-worker` for example.

2. Create an environment, for example `dev`, in the Worker's [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/), by adding a `[env.<ENV_NAME>]` section.

   * wrangler.jsonc

     ```jsonc
     {
       "name": "my-worker",
       "env": {
         "<ENV_NAME>": {
           // environment-specific configuration goes here
         }
       }
     }
     ```

   * wrangler.toml

     ```toml
     name = "my-worker"


     [env]
     "<ENV_NAME>" = { }
     ```

3. You can configure the `dev` environment with different values to the top-level environment. Refer [here](https://developers.cloudflare.com/workers/wrangler/configuration/#environments) for how different options are inherited - or not inherited - between environments. For example, to set a different route for a Worker in the `dev` environment:

   * wrangler.jsonc

     ```jsonc
     {
       "name": "your-worker",
       "route": "example.com",
       "env": {
         "dev": {
           "route": "dev.example.com"
         }
       }
     }
     ```

   * wrangler.toml

     ```toml
     name = "your-worker"
     route = "example.com"


     [env.dev]
     route = "dev.example.com"
     ```

4. Environments are used with the `--env` or `-e` flag on Wrangler commands. For example, you can develop the Worker in the `dev` environment by running `npx wrangler dev -e=dev`, and deploy it with `npx wrangler deploy -e=dev`.

   Note

   If you're using the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), you select the environment at dev or build time via the `CLOUDFLARE_ENV` environment variable rather than the `--env` flag. Otherwise, environments are defined in your Worker config file as usual. For more detail on using environments with the Cloudflare Vite plugin, refer to the [plugin documentation](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/).

## Non-inheritable keys and environments

[Non-inheritable keys](https://developers.cloudflare.com/workers/wrangler/configuration/#non-inheritable-keys) are configurable at the top-level, but cannot be inherited by environments and must be specified for each environment.

For example, [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) and [environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/) are non-inheritable, and must be specified per [environment](https://developers.cloudflare.com/workers/wrangler/environments/) in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).

Review the following example Wrangler file:

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "vars": {
      "API_HOST": "example.com"
    },
    "kv_namespaces": [
      {
        "binding": "<BINDING_NAME>",
        "id": "<KV_NAMESPACE_ID_DEV>"
      }
    ],
    "env": {
      "production": {
        "vars": {
          "API_HOST": "production.example.com"
        },
        "kv_namespaces": [
          {
            "binding": "<BINDING_NAME>",
            "id": "<KV_NAMESPACE_ID_PRODUCTION>"
          }
        ]
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"


  vars = { API_HOST = "example.com" }


  kv_namespaces = [
    { binding = "<BINDING_NAME>", id = "<KV_NAMESPACE_ID_DEV>" }
  ]


  [env.production]


  vars = { API_HOST = "production.example.com" }


  kv_namespaces = [
    { binding = "<BINDING_NAME>", id = "<KV_NAMESPACE_ID_PRODUCTION>" }
  ]
  ```

### Service bindings

To use a [service binding](https://developers.cloudflare.com/workers/wrangler/configuration/#service-bindings) that targets a Worker in a specific environment, you need to append the environment name to the target Worker name in the `service` field. This should be in the format `<worker-name>-<environment-name>`. In the example below, we have two Workers, both with a `staging` environment. `worker-b` has a service binding to `worker-a`. Note how the `service` field in the `staging` environment points to `worker-a-staging`, whereas the top-level service binding points to `worker-a`.

* wrangler.jsonc

  ```jsonc
  {
    "name": "worker-a",
    "vars": {
      "FOO": "<top-level-var>"
    },
    "env": {
      "staging": {
        "vars": {
          "FOO": "<staging-var>"
        }
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "worker-a"


  vars = { FOO = "<top-level-var>" }
  [env.staging.vars]
  FOO = "<staging-var>"
  ```

- wrangler.jsonc

  ```jsonc
  {
    "name": "worker-b",
    "services": {
      "binding": "<BINDING_NAME>",
      "service": "worker-a"
    },
    "env": {
      "staging": {
        "service": {
          "binding": "<BINDING_NAME>",
          "service": "worker-a-staging"
        }
      }
    }
  }
  ```

- wrangler.toml

  ```toml
  name = "worker-b"


  services = { binding = "<BINDING_NAME>", service = "worker-a" }


  # Note how `service = "worker-a-staging"`
  env.staging.service ={ binding = "<BINDING_NAME>", service = "worker-a-staging" }
  ```

### Secrets for production

You may assign environment-specific [secrets](https://developers.cloudflare.com/workers/configuration/secrets/) by running the command [`wrangler secret put <KEY> -env`](https://developers.cloudflare.com/workers/wrangler/commands/#put). You can also create `dotenv` type files named `.dev.vars.<environment-name>`.

Like other environment variables, secrets are [non-inheritable](https://developers.cloudflare.com/workers/wrangler/configuration/#non-inheritable-keys) and must be defined per environment.

### Secrets in local development

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

***

## Examples

### Staging and production environments

The following Wrangler file adds two environments, `[env.staging]` and `[env.production]`, to the Wrangler file. If you are deploying to a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) or [route](https://developers.cloudflare.com/workers/configuration/routing/routes/), you must provide a [`route` or `routes` key](https://developers.cloudflare.com/workers/wrangler/configuration/) for each environment.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "route": "dev.example.com/*",
    "vars": {
      "ENVIRONMENT": "dev"
    },
    "env": {
      "staging": {
        "vars": {
          "ENVIRONMENT": "staging"
        },
        "route": "staging.example.com/*"
      },
      "production": {
        "vars": {
          "ENVIRONMENT": "production"
        },
        "routes": [
          "example.com/foo/*",
          "example.com/bar/*"
        ]
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"
  route = "dev.example.com/*"
  vars = { ENVIRONMENT = "dev" }


  [env.staging]
  vars = { ENVIRONMENT = "staging" }
  route = "staging.example.com/*"


  [env.production]
  vars = { ENVIRONMENT = "production" }
  routes = [
    "example.com/foo/*",
    "example.com/bar/*"
  ]
  ```

You can pass the name of the environment via the `--env` flag to run commands in a specific environment.

With this configuration, Wrangler will behave in the following manner:

```sh
npx wrangler deploy
```

```sh
Uploaded my-worker
Published my-worker
  dev.example.com/*
```

```sh
npx wrangler deploy --env staging
```

```sh
Uploaded my-worker-staging
Published my-worker-staging
  staging.example.com/*
```

```sh
npx wrangler deploy --env production
```

```sh
Uploaded my-worker-production
Published my-worker-production
  example.com/*
```

Any defined [environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/) (the [`vars`](https://developers.cloudflare.com/workers/wrangler/configuration/) key) are exposed as global variables to your Worker.

With this configuration, the `ENVIRONMENT` variable can be used to call specific code depending on the given environment:

```js
if (ENVIRONMENT === "staging") {
  // staging-specific code
} else if (ENVIRONMENT === "production") {
  // production-specific code
}
```

### Staging environment with \*.workers.dev

To deploy your code to your `*.workers.dev` subdomain, include `workers_dev = true` in the desired environment. Your Wrangler file may look like this:

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "route": "example.com/*",
    "env": {
      "staging": {
        "workers_dev": true
      }
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"
  route = "example.com/*"


  [env.staging]
  workers_dev = true
  ```

With this configuration, Wrangler will behave in the following manner:

```sh
npx wrangler deploy
```

```sh
Uploaded my-worker
Published my-worker
  example.com/*
```

```sh
npx wrangler deploy --env staging
```

```sh
Uploaded my-worker
Published my-worker
  https://my-worker-staging.<YOUR_SUBDOMAIN>.workers.dev
```

Warning

When you create a Worker via an environment, Cloudflare automatically creates an SSL certification for it. SSL certifications are discoverable and a matter of public record. Be careful when naming your environments that they do not contain sensitive information, such as, `migrating-service-from-company1-to-company2` or `company1-acquisition-load-test`.
