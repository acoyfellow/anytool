---
title: Infrastructure as Code (IaC) · Cloudflare Workers docs
description: While Wrangler makes it easy to upload and manage Workers, there
  are times when you need a more programmatic approach. This could involve using
  Infrastructure as Code (IaC) tools or interacting directly with the Workers
  API. Examples include build and deploy scripts, CI/CD pipelines, custom
  developer tools, and automated testing.
lastUpdated: 2025-09-04T18:00:21.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/platform/infrastructure-as-code/
  md: https://developers.cloudflare.com/workers/platform/infrastructure-as-code/index.md
---

While [Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration) makes it easy to upload and manage Workers, there are times when you need a more programmatic approach. This could involve using Infrastructure as Code (IaC) tools or interacting directly with the [Workers API](https://developers.cloudflare.com/api/resources/workers/). Examples include build and deploy scripts, CI/CD pipelines, custom developer tools, and automated testing.

To make this easier, Cloudflare provides SDK libraries for popular languages such as [cloudflare-typescript](https://github.com/cloudflare/cloudflare-typescript) and [cloudflare-python](https://github.com/cloudflare/cloudflare-python). For IaC, you can use tools like HashiCorp's Terraform and the [Cloudflare Terraform Provider](https://developers.cloudflare.com/terraform) to manage Workers resources.

Below are examples of deploying a Worker using different tools and languages, along with important considerations for managing Workers with IaC.

All of these examples need an [account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids) and [API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token) (not Global API key) to work.

## Workers Bundling

None of the examples below do [Workers Bundling](https://developers.cloudflare.com/workers/wrangler/bundling). This is usually done with Wrangler or a tool like [esbuild](https://esbuild.github.io).

Generally, you'd run this bundling step before applying your Terraform plan or using the API for script upload:

```bash
wrangler deploy --dry-run --outdir build
```

When using Wrangler for building and a different method for uploading, make sure to copy all of your config from `wrangler.json` into your Terraform config or API request. This is especially important with `compatibility_date` or flags your script relies on.

## Terraform

In this example, you need a local file named `my-script.mjs` with script content similar to the below examples. Learn more about the Cloudflare Terraform Provider [here](https://developers.cloudflare.com/terraform), and see an example with all the Workers script resource settings [here](https://github.com/cloudflare/terraform-provider-cloudflare/blob/main/examples/resources/cloudflare_workers_script/resource.tf).

```tf
variable "account_id" {
  default = "replace_me"
}


resource "cloudflare_worker" "my_worker" {
  account_id = var.account_id
  name = "my-worker"
  observability = {
    enabled = true
  }
}


resource "cloudflare_worker_version" "my_worker_version" {
  account_id = var.account_id
  worker_id = cloudflare_worker.my_worker.id
  compatibility_date = "$today"
  main_module = "my-script.mjs"
  modules = [
    {
      name = "my-script.mjs"
      content_type = "application/javascript+module"
      # Replacement (version creation) is triggered whenever this file changes
      content_file = "my-script.mjs"
    }
  ]
}


resource "cloudflare_workers_deployment" "my_worker_deployment" {
  account_id = var.account_id
  script_name = cloudflare_worker.my_worker.name
  strategy = "percentage"
  versions = [{
    percentage = 100
    version_id = cloudflare_worker_version.my_worker_version.id
  }]
}
```

Notice how you don't have to manage all of these resources in Terraform. For example, you could just the `cloudflare_worker` resource and seamlessly use Wrangler or your own deployment tools for Versions or Deployments.

## Cloudflare API Libraries

This example uses the [cloudflare-typescript](https://github.com/cloudflare/cloudflare-typescript) SDK which provides convenient access to the Cloudflare REST API from server-side JavaScript or TypeScript.

* JavaScript

  ```js
  #!/usr/bin/env -S npm run tsn -T


  /**
   * Create and deploy a Worker
   *
   * Docs:
   * - https://developers.cloudflare.com/workers/configuration/versions-and-deployments/
   * - https://developers.cloudflare.com/workers/platform/infrastructure-as-code/
   *
   * Prerequisites:
   * 1. Generate an API token: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
   * 2. Find your account ID: https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/
   * 3. Find your workers.dev subdomain: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
   *
   * Environment variables:
   *   - CLOUDFLARE_API_TOKEN (required)
   *   - CLOUDFLARE_ACCOUNT_ID (required)
   *   - CLOUDFLARE_SUBDOMAIN (optional)
   *
   * Usage:
   *   Run this script to deploy a simple "Hello World" Worker.
   *   Access it at: my-hello-world-worker.$subdomain.workers.dev
   */


  import { exit } from "node:process";


  import Cloudflare from "cloudflare";


  const WORKER_NAME = "my-hello-world-worker";
  const SCRIPT_FILENAME = `${WORKER_NAME}.mjs`;


  function loadConfig() {
    const apiToken = process.env["CLOUDFLARE_API_TOKEN"];
    if (!apiToken) {
      throw new Error(
        "Missing required environment variable: CLOUDFLARE_API_TOKEN",
      );
    }


    const accountId = process.env["CLOUDFLARE_ACCOUNT_ID"];
    if (!accountId) {
      throw new Error(
        "Missing required environment variable: CLOUDFLARE_ACCOUNT_ID",
      );
    }


    const subdomain = process.env["CLOUDFLARE_SUBDOMAIN"];


    return {
      apiToken,
      accountId,
      subdomain: subdomain || undefined,
      workerName: WORKER_NAME,
    };
  }


  const config = loadConfig();
  const client = new Cloudflare({
    apiToken: config.apiToken,
  });


  async function main() {
    try {
      console.log("🚀 Starting Worker creation and deployment...");


      const scriptContent = `
        export default {
          async fetch(request, env, ctx) {
            return new Response(env.MESSAGE, { status: 200 });
          },
        }`.trim();


      let worker;
      try {
        worker = await client.workers.beta.workers.get(config.workerName, {
          account_id: config.accountId,
        });
        console.log(`♻️  Worker ${config.workerName} already exists. Using it.`);
      } catch (error) {
        if (!(error instanceof Cloudflare.NotFoundError)) {
          throw error;
        }
        console.log(`✏️  Creating Worker ${config.workerName}...`);
        worker = await client.workers.beta.workers.create({
          account_id: config.accountId,
          name: config.workerName,
          subdomain: {
            enabled: config.subdomain !== undefined,
          },
          observability: {
            enabled: true,
          },
        });
      }


      console.log(`⚙️  Worker id: ${worker.id}`);
      console.log("✏️  Creating Worker version...");


      // Create the first version of the Worker
      const version = await client.workers.beta.workers.versions.create(
        worker.id,
        {
          account_id: config.accountId,
          main_module: SCRIPT_FILENAME,
          compatibility_date: new Date().toISOString().split("T")[0],
          bindings: [
            {
              type: "plain_text",
              name: "MESSAGE",
              text: "Hello World!",
            },
          ],
          modules: [
            {
              name: SCRIPT_FILENAME,
              content_type: "application/javascript+module",
              content_base64: Buffer.from(scriptContent).toString("base64"),
            },
          ],
        },
      );


      console.log(`⚙️  Version id: ${version.id}`);
      console.log("🚚 Creating Worker deployment...");


      // Create a deployment and point all traffic to the version we created
      await client.workers.scripts.deployments.create(config.workerName, {
        account_id: config.accountId,
        strategy: "percentage",
        versions: [
          {
            percentage: 100,
            version_id: version.id,
          },
        ],
      });


      console.log("✅ Deployment successful!");


      if (config.subdomain) {
        console.log(`
  🌍 Your Worker is live!
  📍 URL: https://${config.workerName}.${config.subdomain}.workers.dev/
  `);
      } else {
        console.log(`
  ⚠️  Set up a route, custom domain, or workers.dev subdomain to access your Worker.
  Add CLOUDFLARE_SUBDOMAIN to your environment variables to set one up automatically.
  `);
      }
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      exit(1);
    }
  }


  main();
  ```

* TypeScript

  ```ts
  #!/usr/bin/env -S npm run tsn -T


  /**
   * Create and deploy a Worker
   *
   * Docs:
   * - https://developers.cloudflare.com/workers/configuration/versions-and-deployments/
   * - https://developers.cloudflare.com/workers/platform/infrastructure-as-code/
   *
   * Prerequisites:
   * 1. Generate an API token: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
   * 2. Find your account ID: https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/
   * 3. Find your workers.dev subdomain: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
   *
   * Environment variables:
   *   - CLOUDFLARE_API_TOKEN (required)
   *   - CLOUDFLARE_ACCOUNT_ID (required)
   *   - CLOUDFLARE_SUBDOMAIN (optional)
   *
   * Usage:
   *   Run this script to deploy a simple "Hello World" Worker.
   *   Access it at: my-hello-world-worker.$subdomain.workers.dev
   */


  import { exit } from 'node:process';


  import Cloudflare from 'cloudflare';


  interface Config {
    apiToken: string;
    accountId: string;
    subdomain: string | undefined;
    workerName: string;
  }


  const WORKER_NAME = 'my-hello-world-worker';
  const SCRIPT_FILENAME = `${WORKER_NAME}.mjs`;


  function loadConfig(): Config {
    const apiToken = process.env['CLOUDFLARE_API_TOKEN'];
    if (!apiToken) {
      throw new Error('Missing required environment variable: CLOUDFLARE_API_TOKEN');
    }


    const accountId = process.env['CLOUDFLARE_ACCOUNT_ID'];
    if (!accountId) {
      throw new Error('Missing required environment variable: CLOUDFLARE_ACCOUNT_ID');
    }


    const subdomain = process.env['CLOUDFLARE_SUBDOMAIN'];


    return {
      apiToken,
      accountId,
      subdomain: subdomain || undefined,
      workerName: WORKER_NAME,
    };
  }


  const config = loadConfig();
  const client = new Cloudflare({
    apiToken: config.apiToken,
  });


  async function main(): Promise<void> {
    try {
      console.log('🚀 Starting Worker creation and deployment...');


      const scriptContent = `
        export default {
          async fetch(request, env, ctx) {
            return new Response(env.MESSAGE, { status: 200 });
          },
        }`.trim();


      let worker;
      try {
        worker = await client.workers.beta.workers.get(config.workerName, {
          account_id: config.accountId,
        });
        console.log(`♻️  Worker ${config.workerName} already exists. Using it.`);
      } catch (error) {
        if (!(error instanceof Cloudflare.NotFoundError)) { throw error; }
        console.log(`✏️  Creating Worker ${config.workerName}...`);
        worker = await client.workers.beta.workers.create({
          account_id: config.accountId,
          name: config.workerName,
          subdomain: {
            enabled: config.subdomain !== undefined,
          },
          observability: {
            enabled: true,
          },
        });
      }


      console.log(`⚙️  Worker id: ${worker.id}`);
      console.log('✏️  Creating Worker version...');


      // Create the first version of the Worker
      const version = await client.workers.beta.workers.versions.create(worker.id, {
        account_id: config.accountId,
        main_module: SCRIPT_FILENAME,
        compatibility_date: new Date().toISOString().split('T')[0]!,
        bindings: [
          {
            type: 'plain_text',
            name: 'MESSAGE',
            text: 'Hello World!',
          },
        ],
        modules: [
          {
            name: SCRIPT_FILENAME,
            content_type: 'application/javascript+module',
            content_base64: Buffer.from(scriptContent).toString('base64'),
          },
        ],
      });


      console.log(`⚙️  Version id: ${version.id}`);
      console.log('🚚 Creating Worker deployment...');


      // Create a deployment and point all traffic to the version we created
      await client.workers.scripts.deployments.create(config.workerName, {
        account_id: config.accountId,
        strategy: 'percentage',
        versions: [
          {
              percentage: 100,
              version_id: version.id,
            },
          ],
      });


      console.log('✅ Deployment successful!');


      if (config.subdomain) {
        console.log(`
  🌍 Your Worker is live!
  📍 URL: https://${config.workerName}.${config.subdomain}.workers.dev/
  `);
      } else {
        console.log(`
  ⚠️  Set up a route, custom domain, or workers.dev subdomain to access your Worker.
  Add CLOUDFLARE_SUBDOMAIN to your environment variables to set one up automatically.
  `);
      }
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      exit(1);
    }
  }


  main();
  ```

## Cloudflare REST API

Open a terminal or create a shell script to upload a Worker and manage versions and deployments with curl. Workers scripts are JavaScript [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), but we also support [Python Workers](https://developers.cloudflare.com/workers/languages/python/) (open beta) and [Rust Workers](https://developers.cloudflare.com/workers/languages/rust/).

Warning

This API is in beta. See the multipart/form-data API below for the stable API.

* ES Module

  ```bash
  account_id="replace_me"
  api_token="replace_me"
  worker_name="my-hello-world-worker"


  worker_script_base64=$(echo '
  export default {
    async fetch(request, env, ctx) {
      return new Response(env.MESSAGE, { status: 200 });
    }
  };
  ' | base64)


  # Note the below will fail if the worker already exists!
  # Here's how to delete the Worker
  #
  # worker_id="replace-me"
  # curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers/$worker_id" \
  #   -X DELETE \
  #   -H "Authorization: Bearer $api_token"


  # Create the Worker
  worker_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "'$worker_name'"
    }' \
    | jq -r '.result.id')


  echo "\nWorker ID: $worker_id\n"


  # Upload the Worker's first version
  version_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers/$worker_id/versions" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "compatibility_date": "2025-08-06",
      "main_module": "'$worker_name'.mjs",
      "modules": [
        {
          "name": "'$worker_name'.mjs",
          "content_type": "application/javascript+module",
          "content_base64": "'$worker_script_base64'"
        }
      ],
      "bindings": [
        {
          "type": "plain_text",
          "name": "MESSAGE",
          "text": "Hello World!"
        }
      ]
    }' \
    | jq -r '.result.id')


  echo "\nVersion ID: $version_id\n"


  # Create a deployment for the Worker
  deployment_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/scripts/$worker_name/deployments" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "strategy": "percentage",
      "versions": [
        {
          "percentage": 100,
          "version_id": "'$version_id'"
        }
      ]
    }' \
    | jq -r '.result.id')


  echo "\nDeployment ID: $deployment_id\n"
  ```

* Python

  [Python Workers](https://developers.cloudflare.com/workers/languages/python/) have their own special `text/x-python` content type and `python_workers` compatibility flag.

  ```bash
  account_id="replace_me"
  api_token="replace_me"
  worker_name="my-hello-world-worker"


  worker_script_base64=$(echo '
  from workers import Response


  def on_fetch(request, env):
      return Response(env.MESSAGE)
  ' | base64)


  # Note the below will fail if the worker already exists!
  # Here's how to delete the Worker
  #
  # worker_id="replace-me"
  # curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers/$worker_id" \
  #   -X DELETE \
  #   -H "Authorization: Bearer $api_token"


  # Create the Worker
  worker_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "'$worker_name'"
    }' \
    | jq -r '.result.id')


  echo "\nWorker ID: $worker_id\n"


  # Upload the Worker's first version
  version_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/workers/$worker_id/versions" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "compatibility_date": "2025-08-06",
      "compatibility_flags": [
        "python_workers"
      ],
      "main_module": "'$worker_name'.py",
      "modules": [
        {
          "name": "'$worker_name'.py",
          "content_type": "text/x-python",
          "content_base64": "'$worker_script_base64'"
        }
      ],
      "bindings": [
        {
          "type": "plain_text",
          "name": "MESSAGE",
          "text": "Hello World!"
        }
      ]
    }' \
    | jq -r '.result.id')


  echo "\nVersion ID: $version_id\n"


  # Create a deployment for the Worker
  deployment_id=$(curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/scripts/$worker_name/deployments" \
    -X POST \
    -H "Authorization: Bearer $api_token" \
    -H "Content-Type: application/json" \
    -d '{
      "strategy": "percentage",
      "versions": [
        {
          "percentage": 100,
          "version_id": "'$version_id'"
        }
      ]
    }' \
    | jq -r '.result.id')


  echo "\nDeployment ID: $deployment_id\n"
  ```

### multipart/form-data upload API

This API uses [multipart/form-data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST) to upload a Worker and will implicitly create a version and deployment. The above API is recommended for direct management of versions and deployments.

* Workers

  ```bash
  account_id="replace_me"
  api_token="replace_me"
  worker_name="my-hello-world-script"


  script_content='export default {
    async fetch(request, env, ctx) {
      return new Response(env.MESSAGE, { status: 200 });
    }
  };'


  # Upload the Worker
  curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/scripts/$worker_name" \
    -X PUT \
    -H "Authorization: Bearer $api_token" \
    -F "metadata={
      'main_module': '"$worker_name".mjs',
      'bindings': [
        {
          'type': 'plain_text',
          'name': 'MESSAGE',
          'text': 'Hello World!'
        }
      ],
      'compatibility_date': '$today'
    };type=application/json" \
    -F "$worker_name.mjs=@-;filename=$worker_name.mjs;type=application/javascript+module" <<EOF
  $script_content
  EOF
  ```

* Workers for Platforms

  For [Workers for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms), you can upload a [User Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/user-workers) to a [dispatch namespace](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dispatch-namespace). Note the [API endpoint](https://developers.cloudflare.com/api/resources/workers_for_platforms/subresources/dispatch/subresources/namespaces/subresources/scripts/methods/update/) is on `/workers/dispatch/namespaces/$DISPATCH_NAMESPACE/scripts/$SCRIPT_NAME`.

  ```bash
  account_id="replace_me"
  api_token="replace_me"
  dispatch_namespace="replace_me"
  worker_name="my-hello-world-script"


  script_content='export default {
    async fetch(request, env, ctx) {
      return new Response(env.MESSAGE, { status: 200 });
    }
  };'


  # Create a dispatch namespace
  curl https://api.cloudflare.com/client/v4/accounts/$account_id/workers/dispatch/namespaces \
    -X POST \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $api_token" \
    -d '{
      "name": "'$dispatch_namespace'"
    }'


  # Upload the Worker
  curl "https://api.cloudflare.com/client/v4/accounts/$account_id/workers/dispatch/namespaces/$dispatch_namespace/scripts/$worker_name" \
    -X PUT \
    -H "Authorization: Bearer $api_token" \
    -F "metadata={
      'main_module': '"$worker_name".mjs',
      'bindings': [
        {
          'type': 'plain_text',
          'name': 'MESSAGE',
          'text': 'Hello World!'
        }
      ],
      'compatibility_date': '$today'
    };type=application/json" \
    -F "$worker_name.mjs=@-;filename=$worker_name.mjs;type=application/javascript+module" <<EOF
  $script_content
  EOF
  ```

### Python Workers

[Python Workers](https://developers.cloudflare.com/workers/languages/python/) (open beta) have their own special `text/x-python` content type and `python_workers` compatibility flag for uploading using the multipart/form-data API.

```bash
curl https://api.cloudflare.com/client/v4/accounts/<account_id>/workers/scripts/my-hello-world-script \
  -X PUT \
  -H 'Authorization: Bearer <api_token>' \
  -F 'metadata={
        "main_module": "my-hello-world-script.py",
        "bindings": [
          {
            "type": "plain_text",
            "name": "MESSAGE",
            "text": "Hello World!"
          }
        ],
        "compatibility_date": "$today",
        "compatibility_flags": [
          "python_workers"
        ]
      };type=application/json' \
  -F 'my-hello-world-script.py=@-;filename=my-hello-world-script.py;type=text/x-python' <<EOF
from workers import WorkerEntrypoint, Response


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return Response(self.env.MESSAGE)
EOF
```

## Considerations with Durable Objects

[Durable Object](https://developers.cloudflare.com/durable-objects/) migrations are applied with deployments. This means you can't bind to a Durable Object in a Version if a deployment doesn't exist i.e. migrations haven't been applied. For example, running this in Terraform will fail the first time the plan is applied:

```tf
resource "cloudflare_worker" "my_worker" {
  account_id = var.account_id
  name = "my-worker"
}


resource "cloudflare_worker_version" "my_worker_version" {
  account_id = var.account_id
  worker_id = cloudflare_worker.my_worker.id
  bindings = [
    {
      type = "durable_object"
      name = "my_durable_object"
      class_name = "MyDurableObjectClass"
    }
  ]
  migrations = {
    new_sqlite_classes = [
      "MyDurableObjectClass"
    ]
  }
  # ...version props ommitted for brevity
}


resource "cloudflare_workers_deployment" "my_worker_deployment" {
  # ...deployment props ommitted for brevity
}
```

To make this succeed, you first have to comment out the `durable_object` binding block, apply the plan, uncomment it, comment out the `migrations` block, then apply again. This time the plan will succeed. This also applies to the API or SDKs. This is an example where it makes sense to just manage the `cloudflare_worker` and/or `cloudflare_workers_deployment` resources while using Wrangler for build and Version management.
