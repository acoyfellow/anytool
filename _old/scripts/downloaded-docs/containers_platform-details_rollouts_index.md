---
title: Rollouts · Cloudflare Containers docs
description: >-
  When you run wrangler deploy, the Worker code is updated immediately and
  Container

  instances are updated using a rolling deploy strategy. The default rollout
  configuration is two steps,

  where the first step updates 10% of the instances, and the second step updates
  the remaining 90%.

  This can be configured in your Wrangler config file using the
  rollout_step_percentage property.
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/platform-details/rollouts/
  md: https://developers.cloudflare.com/containers/platform-details/rollouts/index.md
---

## How rollouts work

When you run `wrangler deploy`, the Worker code is updated immediately and Container instances are updated using a rolling deploy strategy. The default rollout configuration is two steps, where the first step updates 10% of the instances, and the second step updates the remaining 90%. This can be configured in your Wrangler config file using the [`rollout_step_percentage`](https://developers.cloudflare.com/workers/wrangler/configuration#containers) property.

When deploying a change, you can also configure a [`rollout_active_grace_period`](https://developers.cloudflare.com/workers/wrangler/configuration#containers), which is the minimum number of seconds to wait before an active container instance becomes eligible for updating during a rollout. At that point, the container will be sent at `SIGTERM`, and still has 15 minutes to shut down gracefully. If the instance does not stop within 15 minutes, it is forcefully stopped with a `SIGKILL` signal. If you have cleanup that must occur before a Container instance is stopped, you should do it during this 15 minute period.

Once stopped, the instance is replaced with a new instance running the updated code. Requests may hang while the container is starting up again.

Here is an example configuration that sets a 5 minute grace period and a two step rollout where the first step updates 10% of instances and the second step updates 100% of instances:

* wrangler.jsonc

  ```jsonc
  {
    "containers": [
      {
        "max_instances": 10,
        "class_name": "MyContainer",
        "image": "./Dockerfile",
        "rollout_active_grace_period": 300,
        "rollout_step_percentage": [
          10,
          100
        ]
      }
    ],
    "durable_objects": {
      "bindings": [
        {
          "name": "MY_CONTAINER",
          "class_name": "MyContainer"
        }
      ]
    },
    "migrations": [
      {
        "tag": "v1",
        "new_sqlite_classes": [
          "MyContainer"
        ]
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  [[containers]]
  max_instances = 10
  class_name = "MyContainer"
  image = "./Dockerfile"
  rollout_active_grace_period = 300
  rollout_step_percentage = [10, 100]


  [[durable_objects.bindings]]
  name = "MY_CONTAINER"
  class_name = "MyContainer"


  [[migrations]]
  tag = "v1"
  new_sqlite_classes = ["MyContainer"]
  ```
