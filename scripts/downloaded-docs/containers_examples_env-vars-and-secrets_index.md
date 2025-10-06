---
title: Env Vars and Secrets · Cloudflare Containers docs
description: Pass in environment variables and secrets to your container
lastUpdated: 2025-09-24T21:18:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/
  md: https://developers.cloudflare.com/containers/examples/env-vars-and-secrets/index.md
---

Environment variables can be passed into a Container using the `envVars` field in the [`Container`](https://developers.cloudflare.com/containers/container-package) class, or by setting manually when the Container starts.

Secrets can be passed into a Container by using [Worker Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) or the [Secret Store](https://developers.cloudflare.com/secrets-store/integrations/workers/), then passing them into the Container as environment variables.

KV values can be passed into a Container by using [Workers KV](https://developers.cloudflare.com/kv/), then reading the values and passing them into the Container as environment variables.

These examples show the various ways to pass in secrets, KV values, and environment variables. In each, we will be passing in:

* the variable `"ENV_VAR"` as a hard-coded environment variable
* the secret `"WORKER_SECRET"` as a secret from Worker Secrets
* the secret `"SECRET_STORE_SECRET"` as a secret from the Secret Store
* the value `"KV_VALUE"` as a value from Workers KV

In practice, you may just use one of the methods for storing secrets and data, but we will show all methods for completeness.

## Creating secrets and KV data

First, let's create the `"WORKER_SECRET"` secret in Worker Secrets:

* npm

  ```sh
  npx wrangler secret put WORKER_SECRET
  ```

* yarn

  ```sh
  yarn wrangler secret put WORKER_SECRET
  ```

* pnpm

  ```sh
  pnpm wrangler secret put WORKER_SECRET
  ```

Then, let's create a store called "demo" in the Secret Store, and add the `"SECRET_STORE_SECRET"` secret to it:

* npm

  ```sh
  npx wrangler secrets-store store create demo --remote
  ```

* yarn

  ```sh
  yarn wrangler secrets-store store create demo --remote
  ```

* pnpm

  ```sh
  pnpm wrangler secrets-store store create demo --remote
  ```

- npm

  ```sh
  npx wrangler secrets-store secret create demo --name SECRET_STORE_SECRET --scopes workers --remote
  ```

- yarn

  ```sh
  yarn wrangler secrets-store secret create demo --name SECRET_STORE_SECRET --scopes workers --remote
  ```

- pnpm

  ```sh
  pnpm wrangler secrets-store secret create demo --name SECRET_STORE_SECRET --scopes workers --remote
  ```

Next, let's create a KV namespace called `DEMO_KV` and add a key-value pair:

* npm

  ```sh
  npx wrangler kv namespace create DEMO_KV
  ```

* yarn

  ```sh
  yarn wrangler kv namespace create DEMO_KV
  ```

* pnpm

  ```sh
  pnpm wrangler kv namespace create DEMO_KV
  ```

- npm

  ```sh
  npx wrangler kv key put --binding DEMO_KV KV_VALUE 'Hello from KV!'
  ```

- yarn

  ```sh
  yarn wrangler kv key put --binding DEMO_KV KV_VALUE 'Hello from KV!'
  ```

- pnpm

  ```sh
  pnpm wrangler kv key put --binding DEMO_KV KV_VALUE 'Hello from KV!'
  ```

For full details on how to create secrets, see the [Workers Secrets documentation](https://developers.cloudflare.com/workers/configuration/secrets/) and the [Secret Store documentation](https://developers.cloudflare.com/secrets-store/integrations/workers/). For KV setup, see the [Workers KV documentation](https://developers.cloudflare.com/kv/).

## Adding bindings

Next, we need to add bindings to access our secrets, KV values, and environment variables in Wrangler configuration.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-container-worker",
    "vars": {
      "ENV_VAR": "my-env-var"
    },
    "secrets_store_secrets": [
      {
        "binding": "SECRET_STORE",
        "store_id": "demo",
        "secret_name": "SECRET_STORE_SECRET"
      }
    ],
    "kv_namespaces": [
      {
        "binding": "DEMO_KV",
        "id": "<your-kv-namespace-id>"
      }
    ]
    // rest of the configuration...
  }
  ```

* wrangler.toml

  ```toml
  name = "my-container-worker"


  [vars]
  ENV_VAR = "my-env-var"


  [[secrets_store_secrets]]
  binding = "SECRET_STORE"
  store_id = "demo"
  secret_name = "SECRET_STORE_SECRET"


  [[kv_namespaces]]
  binding = "DEMO_KV"
  id = "<your-kv-namespace-id>"
  ```

Note that `"WORKER_SECRET"` does not need to be specified in the Wrangler config file, as it is automatically added to `env`.

Also note that we did not configure anything specific for environment variables, secrets, or KV values in the *container-related* portion of the Wrangler configuration file.

## Using `envVars` on the Container class

Now, let's pass the env vars and secrets to our container using the `envVars` field in the `Container` class:

```js
// https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global
import { env } from "cloudflare:workers";
export class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "10s";
  envVars = {
    WORKER_SECRET: env.WORKER_SECRET,
    ENV_VAR: env.ENV_VAR,
    // we can't set the secret store binding or KV values as defaults here, as getting their values is asynchronous
  };
}
```

Every instance of this `Container` will now have these variables and secrets set as environment variables when it launches.

## Setting environment variables per-instance

But what if you want to set environment variables on a per-instance basis?

In this case, use the `startAndWaitForPorts()` method to pass in environment variables for each instance.

```js
export class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "10s";
}


export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/launch-instances") {
      let instanceOne = env.MY_CONTAINER.getByName("foo");
      let instanceTwo = env.MY_CONTAINER.getByName("bar");


      // Each instance gets a different set of environment variables


      await instanceOne.startAndWaitForPorts({
        startOptions: {
          envVars: {
            ENV_VAR: env.ENV_VAR + "foo",
            WORKER_SECRET: env.WORKER_SECRET,
            SECRET_STORE_SECRET: await env.SECRET_STORE.get(),
            KV_VALUE: await env.DEMO_KV.get("KV_VALUE"),
          },
        },
      });


      await instanceTwo.startAndWaitForPorts({
        startOptions: {
          envVars: {
            ENV_VAR: env.ENV_VAR + "bar",
            WORKER_SECRET: env.WORKER_SECRET,
            SECRET_STORE_SECRET: await env.SECRET_STORE.get(),
            KV_VALUE: await env.DEMO_KV.get("KV_VALUE"),
            // You can also read different KV keys for different instances
            INSTANCE_CONFIG: await env.DEMO_KV.get("instance-bar-config"),
          },
        },
      });
      return new Response("Container instances launched");
    }


    // ... etc ...
  },
};
```

## Reading KV values in containers

KV values are particularly useful for configuration data that changes infrequently but needs to be accessible to your containers. Since KV operations are asynchronous, you must read the values at runtime when starting containers.

Here are common patterns for using KV with containers:

### Configuration data

```js
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/configure-container") {
      // Read configuration from KV
      const config = await env.DEMO_KV.get("container-config", "json");
      const apiUrl = await env.DEMO_KV.get("api-endpoint");


      let container = env.MY_CONTAINER.getByName("configured");


      await container.startAndWaitForPorts({
        startOptions: {
          envVars: {
            CONFIG_JSON: JSON.stringify(config),
            API_ENDPOINT: apiUrl,
            DEPLOYMENT_ENV: await env.DEMO_KV.get("deployment-env"),
          },
        },
      });


      return new Response("Container configured and launched");
    }
  },
};
```

### Feature flags

```js
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/launch-with-features") {
      // Read feature flags from KV
      const featureFlags = {
        ENABLE_FEATURE_A: await env.DEMO_KV.get("feature-a-enabled"),
        ENABLE_FEATURE_B: await env.DEMO_KV.get("feature-b-enabled"),
        DEBUG_MODE: await env.DEMO_KV.get("debug-enabled"),
      };


      let container = env.MY_CONTAINER.getByName("features");


      await container.startAndWaitForPorts({
        startOptions: {
          envVars: {
            ...featureFlags,
            CONTAINER_VERSION: "1.2.3",
          },
        },
      });


      return new Response("Container launched with feature flags");
    }
  },
};
```

## Build-time environment variables

Finally, you can also set build-time environment variables that are only available when building the container image via the `image_vars` field in the Wrangler configuration.
