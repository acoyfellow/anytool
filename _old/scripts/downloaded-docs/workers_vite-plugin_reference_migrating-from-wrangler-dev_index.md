---
title: Migrating from wrangler dev · Cloudflare Workers docs
description: Migrating from wrangler dev to the Vite plugin
lastUpdated: 2025-06-18T17:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/vite-plugin/reference/migrating-from-wrangler-dev/
  md: https://developers.cloudflare.com/workers/vite-plugin/reference/migrating-from-wrangler-dev/index.md
---

In most cases, migrating from [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) is straightforward and you can follow the instructions in [Get started](https://developers.cloudflare.com/workers/vite-plugin/get-started/). There are a few key differences to highlight:

## Input and output Worker config files

With the Cloudflare Vite plugin, your [Worker config file](https://developers.cloudflare.com/workers/wrangler/configuration/) (for example, `wrangler.jsonc`) is the input configuration and a separate output configuration is created as part of the build. This output file is a snapshot of your configuration at the time of the build and is modified to reference your build artifacts. It is the configuration that is used for preview and deployment. Once you have run `vite build`, running `wrangler deploy` or `vite preview` will automatically locate this output configuration file.

## Cloudflare Environments

With the Cloudflare Vite plugin, [Cloudflare Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/) are applied at dev and build time. Running `wrangler deploy --env some-env` is therefore not applicable and the environment to deploy should instead be set by running `CLOUDFLARE_ENV=some-env vite build`.

## Redundant fields in the Wrangler config file

There are various options in the [Worker config file](https://developers.cloudflare.com/workers/wrangler/configuration/) that are ignored when using Vite, as they are either no longer applicable or are replaced by Vite equivalents. If these options are provided, then warnings will be printed to the console with suggestions for how to proceed. Examples where the Vite configuration should be used instead include `alias` and `define`. See [Vite Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/vite-environments/) for more information about configuring your Worker environments in Vite.

## No remote mode

The Vite plugin does not support [remote mode](https://developers.cloudflare.com/workers/development-testing/#remote-bindings). We will be adding support for accessing remote resources in local development in a future update.
