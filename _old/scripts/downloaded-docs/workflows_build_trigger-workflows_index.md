---
title: Trigger Workflows · Cloudflare Workflows docs
description: "You can trigger Workflows both programmatically and via the
  Workflows APIs, including:"
lastUpdated: 2025-09-23T20:48:09.000Z
chatbotDeprioritize: false
tags: Bindings
source_url:
  html: https://developers.cloudflare.com/workflows/build/trigger-workflows/
  md: https://developers.cloudflare.com/workflows/build/trigger-workflows/index.md
---

You can trigger Workflows both programmatically and via the Workflows APIs, including:

1. With [Workers](https://developers.cloudflare.com/workers) via HTTP requests in a `fetch` handler, or bindings from a `queue` or `scheduled` handler
2. Using the [Workflows REST API](https://developers.cloudflare.com/api/resources/workflows/methods/list/)
3. Via the [wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/#workflows) in your terminal

## Workers API (Bindings)

You can interact with Workflows programmatically from any Worker script by creating a binding to a Workflow. A Worker can bind to multiple Workflows, including Workflows defined in other Workers projects (scripts) within your account.

You can interact with a Workflow:

* Directly over HTTP via the [`fetch`](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/) handler
* From a [Queue consumer](https://developers.cloudflare.com/queues/configuration/javascript-apis/#consumer) inside a `queue` handler
* From a [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/) inside a `scheduled` handler
* Within a [Durable Object](https://developers.cloudflare.com/durable-objects/)

Note

New to Workflows? Start with the [Workflows tutorial](https://developers.cloudflare.com/workflows/get-started/guide/) to deploy your first Workflow and familiarize yourself with Workflows concepts.

To bind to a Workflow from your Workers code, you need to define a [binding](https://developers.cloudflare.com/workers/wrangler/configuration/) to a specific Workflow. For example, to bind to the Workflow defined in the [get started guide](https://developers.cloudflare.com/workflows/get-started/guide/), you would configure the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) with the below:

* wrangler.jsonc

  ```jsonc
  {
    "name": "workflows-tutorial",
    "main": "src/index.ts",
    "compatibility_date": "2024-10-22",
    "workflows": [
      {
        "name": "workflows-tutorial",
        "binding": "MY_WORKFLOW",
        "class_name": "MyWorkflow"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "workflows-tutorial"
  main = "src/index.ts"
  compatibility_date = "2024-10-22"


  [[workflows]]
  # The name of the Workflow
  name = "workflows-tutorial"
  # The binding name, which must be a valid JavaScript variable name.  This will
  # be how you call (run) your Workflow from your other Workers handlers or
  # scripts.
  binding = "MY_WORKFLOW"
  # Must match the class defined in your code that extends the Workflow class
  class_name = "MyWorkflow"
  ```

The `binding = "MY_WORKFLOW"` line defines the JavaScript variable that our Workflow methods are accessible on, including `create` (which triggers a new instance) or `get` (which returns the status of an existing instance).

The following example shows how you can manage Workflows from within a Worker, including:

* Retrieving the status of an existing Workflow instance by its ID
* Creating (triggering) a new Workflow instance
* Returning the status of a given instance ID

```ts
interface Env {
  MY_WORKFLOW: Workflow;
}


export default {
  async fetch(req: Request, env: Env) {
    // Get instanceId from query parameters
    const instanceId = new URL(req.url).searchParams.get("instanceId")


    // If an ?instanceId=<id> query parameter is provided, fetch the status
    // of an existing Workflow by its ID.
    if (instanceId) {
      let instance = await env.MY_WORKFLOW.get(instanceId);
      return Response.json({
        status: await instance.status(),
      });
    }


    // Else, create a new instance of our Workflow, passing in any (optional)
    // params and return the ID.
    const newId = await crypto.randomUUID();
    let instance = await env.MY_WORKFLOW.create({ id: newId });
    return Response.json({
      id: instance.id,
      details: await instance.status(),
    });
  },
};
```

### Inspect a Workflow's status

You can inspect the status of any running Workflow instance by calling `status` against a specific instance ID. This allows you to programmatically inspect whether an instance is queued (waiting to be scheduled), actively running, paused, or errored.

```ts
let instance = await env.MY_WORKFLOW.get("abc-123")
let status = await instance.status() // Returns an InstanceStatus
```

The possible values of status are as follows:

```ts
  status:
    | "queued" // means that instance is waiting to be started (see concurrency limits)
    | "running"
    | "paused"
    | "errored"
    | "terminated" // user terminated the instance while it was running
    | "complete"
    | "waiting" // instance is hibernating and waiting for sleep or event to finish
    | "waitingForPause" // instance is finishing the current work to pause
    | "unknown";
  error?: string;
  output?: object;
};
```

### Stop a Workflow

You can stop/terminate a Workflow instance by calling `terminate` against a specific instance ID.

```ts
let instance = await env.MY_WORKFLOW.get("abc-123")
await instance.terminate() // Returns Promise<void>
```

Once stopped/terminated, the Workflow instance *cannot* be resumed.

### Restart a Workflow

Warning

**Known issue**: Restarting a Workflow via the `restart()` method is not currently supported and will throw an exception (error).

```ts
let instance = await env.MY_WORKFLOW.get("abc-123")
await instance.restart() // Returns Promise<void>
```

Restarting an instance will immediately cancel any in-progress steps, erase any intermediate state, and treat the Workflow as if it was run for the first time.

## REST API (HTTP)

Refer to the [Workflows REST API documentation](https://developers.cloudflare.com/api/resources/workflows/subresources/instances/methods/create/).

## Command line (CLI)

Refer to the [CLI quick start](https://developers.cloudflare.com/workflows/get-started/cli-quick-start/) to learn more about how to manage and trigger Workflows via the command-line.
