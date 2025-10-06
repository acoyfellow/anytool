---
title: Cron Container · Cloudflare Containers docs
description: Running a container on a schedule using Cron Triggers
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/examples/cron/
  md: https://developers.cloudflare.com/containers/examples/cron/index.md
---

To launch a container on a schedule, you can use a Workers [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/).

For a full example, see the [Cron Container Template](https://github.com/mikenomitch/cron-container/tree/main).

Use a cron expression in your Wrangler config to specify the schedule:

* wrangler.jsonc

  ```jsonc
  {
    "name": "cron-container",
    "main": "src/index.ts",
    "triggers": {
      "crons": [
        "*/2 * * * *" // Run every 2 minutes
      ]
    },
    "containers": [
      {
        "class_name": "CronContainer",
        "image": "./Dockerfile"
      }
    ],
    "durable_objects": {
      "bindings": [
        {
          "class_name": "CronContainer",
          "name": "CRON_CONTAINER"
        }
      ]
    },
    "migrations": [
      {
        "new_sqlite_classes": ["CronContainer"],
        "tag": "v1"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "cron-container"
  main = "src/index.ts"


  [triggers]
  crons = [ "*/2 * * * *" ]


  [[containers]]
  class_name = "CronContainer"
  image = "./Dockerfile"


  [[durable_objects.bindings]]
  class_name = "CronContainer"
  name = "CRON_CONTAINER"


  [[migrations]]
  new_sqlite_classes = [ "CronContainer" ]
  tag = "v1"
  ```

Then in your Worker, call your Container from the "scheduled" handler:

```ts
import { Container, getContainer } from "@cloudflare/containers";


export class CronContainer extends Container {
  sleepAfter = "5m";
}


export default {
  async fetch(): Promise<Response> {
    return new Response(
      "This Worker runs a cron job to execute a container on a schedule.",
    );
  },


  // scheduled is called when a cron trigger fires
  async scheduled(
    _controller: any,
    env: { CRON_CONTAINER: DurableObjectNamespace<CronContainer> },
  ) {
    await getContainer(env.CRON_CONTAINER).startAndWaitForPorts({
      startOptions: {
        envVars: {
          MESSAGE: "Start Time: " + new Date().toISOString(),
        },
      },
    });
  },
};
```
