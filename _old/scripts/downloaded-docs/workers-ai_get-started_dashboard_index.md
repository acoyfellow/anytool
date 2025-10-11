---
title: Get started - Dashboard · Cloudflare Workers AI docs
description: Follow this guide to create a Workers AI application using the
  Cloudflare dashboard.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/get-started/dashboard/
  md: https://developers.cloudflare.com/workers-ai/get-started/dashboard/index.md
---

Follow this guide to create a Workers AI application using the Cloudflare dashboard.

## Prerequisites

Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages) if you have not already.

## Setup

To create a Workers AI application:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Under **Select a template**, select **LLM Chat App**.

4. Select **Deploy**.

5. Name your Worker, then select **Create and deploy**.

6. Preview your Worker at its provided [`workers.dev`](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) subdomain.

## Development

### Dashboard

Editing in the dashboard is helpful for simpler use cases.

Once you have created your Worker script, you can edit and deploy your Worker using the Cloudflare dashboard:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your application.

3. Select **Edit Code**.

![Edit code directly within the Cloudflare dashboard](https://developers.cloudflare.com/_astro/workers-edit-code.CKxxvQSe_Z2kkiqb.webp)

### Wrangler CLI

To develop more advanced applications or [implement tests](https://developers.cloudflare.com/workers/testing/), start working in the Wrangler CLI.

1. Install [`npm`](https://docs.npmjs.com/getting-started).
2. Install [`Node.js`](https://nodejs.org/en/).

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), discussed later in this guide, requires a Node version of `16.17.0` or later.

1. Run the following command, replacing the value of `[<DIRECTORY>]` which the location you want to put your Worker Script.

* npm

  ```sh
  npm create cloudflare@latest -- [<DIRECTORY>] --type=pre-existing
  ```

* yarn

  ```sh
  yarn create cloudflare [<DIRECTORY>] --type=pre-existing
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest [<DIRECTORY>] --type=pre-existing
  ```

After you run this command - and work through the prompts - your local changes will not automatically sync with dashboard. So, once you download your script, continue using the CLI.
