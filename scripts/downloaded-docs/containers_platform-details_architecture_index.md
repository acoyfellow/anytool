---
title: Lifecycle of a Container · Cloudflare Containers docs
description: >-
  After you deploy an application with a Container, your image is uploaded to

  Cloudflare's Registry and distributed globally to Cloudflare's Network.

  Cloudflare will pre-schedule instances and pre-fetch images across the globe
  to ensure quick start

  times when scaling up the number of concurrent container instances.
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/platform-details/architecture/
  md: https://developers.cloudflare.com/containers/platform-details/architecture/index.md
---

## Deployment

After you deploy an application with a Container, your image is uploaded to [Cloudflare's Registry](https://developers.cloudflare.com/containers/platform-details/image-management) and distributed globally to Cloudflare's Network. Cloudflare will pre-schedule instances and pre-fetch images across the globe to ensure quick start times when scaling up the number of concurrent container instances.

Unlike Workers, which are updated immediately on deploy, container instances are updated using a rolling deploy strategy. This allows you to gracefully shutdown any running instances during a rollout. Refer to [rollouts](https://developers.cloudflare.com/containers/platform-details/rollouts/) for more details.

## Lifecycle of a Request

### Client to Worker

Recall that Containers are backed by Durable Objects and Workers. Requests are first routed through a Worker, which is generally handled by a datacenter in a location with the best latency between itself and the requesting user. A different datacenter may be selected to optimize overall latency, if [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement/) is on, or if the nearest location is under heavy load.

Because all Container requests are passed through a Worker, end-users cannot make non-HTTP TCP or UDP requests to a Container instance. If you have a use case that requires inbound TCP or UDP from an end-user, please [let us know](https://forms.gle/AGSq54VvUje6kmKu8).

### Worker to Durable Object

From the Worker, a request passes through a Durable Object instance (the [Container package](https://developers.cloudflare.com/containers/container-package) extends a Durable Object class). Each Durable Object instance is a globally routable isolate that can execute code and store state. This allows developers to easily address and route to specific container instances (no matter where they are placed), define and run hooks on container status changes, execute recurring checks on the instance, and store persistent state associated with each instance.

### Starting a Container

When a Durable Object instance requests to start a new container instance, the **nearest location with a pre-fetched image** is selected.

Note

Currently, Durable Objects may be co-located with their associated Container instance, but often are not.

Cloudflare is currently working on expanding the number of locations in which a Durable Object can run, which will allow container instances to always run in the same location as their Durable Object.

Starting additional container instances will use other locations with pre-fetched images, and Cloudflare will automatically begin prepping additional machines behind the scenes for additional scaling and quick cold starts. Because there are a finite number of pre-warmed locations, some container instances may be started in locations that are farther away from the end-user. This is done to ensure that the container instance starts quickly. You are only charged for actively running instances and not for any unused pre-warmed images.

#### Cold starts

A cold start is when a container instance is started from a completely stopped state. If you call `env.MY_CONTAINER.get(id)` with a completely novel ID and launch this instance for the first time, it will result in a cold start. This will start the container image from its entrypoint for the first time. Depending on what this entrypoint does, it will take a variable amount of time to start.

Container cold starts can often be the 2-3 second range, but this is dependent on image size and code execution time, among other factors.

### Requests to running Containers

When a request *starts* a new container instance, the nearest location with a pre-fetched image is selected. Subsequent requests to a particular instance, regardless of where they originate, will be routed to this location as long as the instance stays alive.

However, once that container instance stops and restarts, future requests could be routed to a *different* location. This location will again be the nearest location to the originating request with a pre-fetched image.

### Container runtime

Each container instance runs inside its own VM, which provides strong isolation from other workloads running on Cloudflare's network. Containers should be built for the `linux/amd64` architecture, and should stay within [size limits](https://developers.cloudflare.com/containers/platform-details/limits).

[Logging](https://developers.cloudflare.com/containers/faq/#how-do-container-logs-work), metrics collection, and [networking](https://developers.cloudflare.com/containers/faq/#how-do-i-allow-or-disallow-egress-from-my-container) are automatically set up on each container, as configured by the developer.

### Container shutdown

If you do not set [`sleepAfter`](https://github.com/cloudflare/containers/blob/main/README.md#properties) on your Container class, or stop the instance manually, the container will shut down soon after the container stops receiving requests. By setting `sleepAfter`, the container will stay alive for approximately the specified duration.

You can manually shutdown a container instance by calling `stop()` or `destroy()` on it - refer to the [Container package docs](https://github.com/cloudflare/containers/blob/main/README.md#container-methods) for more details.

When a container instance is going to be shut down, it is sent a `SIGTERM` signal, and then a `SIGKILL` signal after 15 minutes. You should perform any necessary cleanup to ensure a graceful shutdown in this time.

#### Persistent disk

All disk is ephemeral. When a Container instance goes to sleep, the next time it is started, it will have a fresh disk as defined by its container image. Persistent disk is something the Cloudflare team is exploring in the future, but is not slated for the near term.

## An example request

* A developer deploys a Container. Cloudflare automatically readies instances across its Network.
* A request is made from a client in Bariloche, Argentina. It reaches the Worker in a nearby Cloudflare location in Neuquen, Argentina.
* This Worker request calls `getContainer(env.MY_CONTAINER, "session-1337")`. Under the hood, this brings up a Durable Object, which then calls `this.ctx.container.start`.
* This requests the nearest free Container instance. Cloudflare recognizes that an instance is free in Buenos Aires, Argentina, and starts it there.
* A different user needs to route to the same container. This user's request reaches the Worker running in Cloudflare's location in San Diego, US.
* The Worker again calls `getContainer(env.MY_CONTAINER, "session-1337")`.
* If the initial container instance is still running, the request is routed to the original location in Buenos Aires. If the initial container has gone to sleep, Cloudflare will once again try to find the nearest "free" instance of the Container, likely one in North America, and start an instance there.
