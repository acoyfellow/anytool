---
title: Secrets · Cloudflare Workers docs
description: Using secrets with the Vite plugin
lastUpdated: 2025-04-04T07:52:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/vite-plugin/reference/secrets/
  md: https://developers.cloudflare.com/workers/vite-plugin/reference/secrets/index.md
---

[Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) are typically used for storing sensitive information such as API keys and auth tokens. For deployed Workers, they are set via the dashboard or Wrangler CLI.

In local development, secrets can be provided to your Worker by using a [`.dev.vars`](https://developers.cloudflare.com/workers/configuration/secrets/#local-development-with-secrets) file. If you are using [Cloudflare Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/) then the relevant `.dev.vars` file will be selected. For example, `CLOUDFLARE_ENV=staging vite dev` will load `.dev.vars.staging` if it exists and fall back to `.dev.vars`.

Note

The `vite build` command copies the relevant `.dev.vars` file to the output directory. This is only used when running `vite preview` and is not deployed with your Worker.
