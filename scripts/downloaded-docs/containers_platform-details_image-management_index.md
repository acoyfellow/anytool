---
title: Image Management · Cloudflare Containers docs
description: >-
  When running wrangler deploy, if you set the image attribute in your Wrangler
  configuration to a path to a Dockerfile, Wrangler will build your container
  image locally using Docker, then push it to a registry run by Cloudflare.

  This registry is integrated with your Cloudflare account and is backed by R2.
  All authentication is handled automatically by

  Cloudflare both when pushing and pulling images.
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/containers/platform-details/image-management/
  md: https://developers.cloudflare.com/containers/platform-details/image-management/index.md
---

## Pushing images during `wrangler deploy`

When running `wrangler deploy`, if you set the `image` attribute in your [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#containers) to a path to a Dockerfile, Wrangler will build your container image locally using Docker, then push it to a registry run by Cloudflare. This registry is integrated with your Cloudflare account and is backed by [R2](https://developers.cloudflare.com/r2/). All authentication is handled automatically by Cloudflare both when pushing and pulling images.

Just provide the path to your Dockerfile:

* wrangler.jsonc

  ```jsonc
  {
    "containers": {
      "image": "./Dockerfile"
      // ...rest of config...
    }
  }
  ```

* wrangler.toml

  ```toml
  [containers]
  image = "./Dockerfile"
  ```

And deploy your Worker with `wrangler deploy`. No other image management is necessary.

On subsequent deploys, Wrangler will only push image layers that have changed, which saves space and time.

Note

Docker or a Docker-compatible CLI tool must be running for Wrangler to build and push images. This is not necessary if you are using a pre-built image, as described below.

## Using pre-built container images

Currently, all images must use `registry.cloudflare.com`.

Note

We plan to allow other image registries. Cloudflare will download your image, optionally using auth credentials, then cache it globally in the Cloudflare Registry.

This is not yet available.

If you wish to use a pre-built image, first, make sure it exists locally, then push it to the Cloudflare Registry:

```plaintext
docker pull <public-image>
docker tag <public-image> <image>:<tag>
```

Wrangler provides a command to push images to the Cloudflare Registry:

* npm

  ```sh
  npx wrangler containers push <image>:<tag>
  ```

* yarn

  ```sh
  yarn wrangler containers push <image>:<tag>
  ```

* pnpm

  ```sh
  pnpm wrangler containers push <image>:<tag>
  ```

Or, you can use the `-p` flag with `wrangler containers build` to build and push an image in one step:

* npm

  ```sh
  npx wrangler containers build -p -t <tag> .
  ```

* yarn

  ```sh
  yarn wrangler containers build -p -t <tag> .
  ```

* pnpm

  ```sh
  pnpm wrangler containers build -p -t <tag> .
  ```

This will output an image registry URI that you can then use in your Wrangler configuration:

* wrangler.jsonc

  ```jsonc
  {
    "containers": {
      "image": "registry.cloudflare.com/your-account-id/your-image:tag"
      // ...rest of config...
    }
  }
  ```

* wrangler.toml

  ```toml
  [containers]
  image = "registry.cloudflare.com/your-account-id/your-image:tag"
  ```

Note

Currently, the Cloudflare Vite-plugin does not support registry links in local development, unlike `wrangler dev`. As a workaround, you can create a minimal Dockerfile that uses `FROM <registry-link>`. Make sure to `EXPOSE` a port in local dev as well.

## Pushing images with CI

To use an image built in a continuous integration environment, install `wrangler` then build and push images using either `wrangler containers build` with the `--push` flag, or using the `wrangler containers push` command.

## Registry Limits

Images are limited to 2 GB in size and you are limited to 50 total GB in your account's registry.

Note

These limits will likely increase in the future.

Delete images with `wrangler containers images delete` to free up space, but reverting a Worker to a previous version that uses a deleted image will then error.
