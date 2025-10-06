---
title: Local Development · Cloudflare Containers docs
description: You can run both your container and your Worker locally by simply
  running npx wrangler dev (or vite dev for Vite projects using the Cloudflare
  Vite plugin) in your project's directory.
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/local-dev/
  md: https://developers.cloudflare.com/containers/local-dev/index.md
---

You can run both your container and your Worker locally by simply running [`npx wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) (or `vite dev` for Vite projects using the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)) in your project's directory.

To develop Container-enabled Workers locally, you will need to first ensure that a Docker compatible CLI tool and Engine are installed. For instance, you could use [Docker Desktop](https://docs.docker.com/desktop/) or [Colima](https://github.com/abiosoft/colima).

When you start a dev session, your container image will be built or downloaded. If your [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#containers) sets the `image` attribute to a local path, the image will be built using the local Dockerfile. If the `image` attribute is set to a URL, the image will be pulled from the Cloudflare registry.

Note

Currently, the Cloudflare Vite-plugin does not support registry links in local development, unlike `wrangler dev`. As a workaround, you can create a minimal Dockerfile that uses `FROM <registry-link>`. Make sure to `EXPOSE` a port for local dev as well.

Container instances will be launched locally when your Worker code calls to create a new container. Requests will then automatically be routed to the correct locally-running container.

When the dev session ends, all associated container instances should be stopped, but local images are not removed, so that they can be reused in subsequent builds.

Note

If your Worker app creates many container instances, your local machine may not be able to run as many containers concurrently as is possible when you deploy to Cloudflare.

Also, `max_instances` configuration option does not apply during local development.

Additionally, if you regularly rebuild containers locally, you may want to clear out old container images (using `docker image prune` or similar) to reduce disk used.

## Iterating on Container code

When you develop with Wrangler or Vite, your Worker's code is automatically reloaded each time you save a change, but code running within the container is not.

To rebuild your container with new code changes, you can hit the `[r]` key on your keyboard, which triggers a rebuild. Container instances will then be restarted with the newly built images.

You may prefer to set up your own code watchers and reloading mechanisms, or mount a local directory into the local container images to sync code changes. This can be done, but there is no built-in mechanism for doing so, and best-practices will depend on the languages and frameworks you are using in your container code.

## Troubleshooting

### Exposing Ports

In production, all of your container's ports will be accessible by your Worker, so you do not need to specifically expose ports using the [`EXPOSE` instruction](https://docs.docker.com/reference/dockerfile/#expose) in your Dockerfile.

But for local development you will need to declare any ports you need to access in your Dockerfile with the EXPOSE instruction; for example: `EXPOSE 4000`, if you will be accessing port 4000.

If you have not exposed any ports, you will see the following error in local development:

```txt
The container "MyContainer" does not expose any ports. In your Dockerfile, please expose any ports you intend to connect to.
```

And if you try to connect to any port that you have not exposed in your `Dockerfile` you will see the following error:

```txt
connect(): Connection refused: container port not found. Make sure you exposed the port in your container definition.
```

You may also see this while the container is starting up and no ports are available yet. You should retry until the ports become available. This retry logic should be handled for you if you are using the [containers package](https://github.com/cloudflare/containers/tree/main/src).

### Socket configuration - `internal error`

If you see an opaque `internal error` when attempting to connect to your container, you may need to set the `DOCKER_HOST` environment variable to the socket path your container engine is listening on. Wrangler or Vite will attempt to automatically find the correct socket to use to communicate with your container engine, but if that does not work, you may have to set this environment variable to the appropriate socket path.
