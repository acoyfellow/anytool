---
title: Get started - Dashboard · Cloudflare Workers docs
description: Follow this guide to create a Workers application using the
  Cloudflare dashboard.
lastUpdated: 2025-09-09T12:12:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/get-started/dashboard/
  md: https://developers.cloudflare.com/workers/get-started/dashboard/index.md
---

Follow this guide to create a Workers application using the Cloudflare dashboard.

Try the Playground

The quickest way to experiment with Cloudflare Workers is in the [Playground](https://workers.cloudflare.com/playground). The Playground does not require any setup. It is an instant way to preview and test a Worker directly in the browser.

## Prerequisites

[Create a Cloudflare account](https://developers.cloudflare.com/fundamentals/account/create-account/), if you have not already.

## Setup

To get started with a new Workers application:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**. From here, you can:

   * Select from the gallery of production-ready templates
   * Import an existing Git repository on your own account
   * Let Cloudflare clone and bootstrap a public repository containing a Workers application.

3. Once you have connected to your chosen [Git provider](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/), configure your project and select **Deploy**.

4. Cloudflare will kick off a new build and deployment. Once deployed, preview your Worker at its provided `workers.dev` subdomain.

## Continue development

Applications started in the dashboard are set up with Git to help kickstart your development workflow. To continue developing on your repository, you can run:

```bash
# clone you repository locally
git clone <git repo URL>


# be sure you are in the root directory
cd <directory>
```

Now, you can preview and test your changes by [running Wrangler in your local development environment](https://developers.cloudflare.com/workers/development-testing/). Once you are ready to deploy you can run:

```bash
# adds the files to git tracking
git add .


# commits the changes
git commit -m "your message"


# push the changes to your Git provider
git push origin main
```

To do more:

* Review our [Examples](https://developers.cloudflare.com/workers/examples/) and [Tutorials](https://developers.cloudflare.com/workers/tutorials/) for inspiration.
* Set up [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) to allow your Worker to interact with other resources and unlock new functionality.
* Learn how to [test and debug](https://developers.cloudflare.com/workers/testing/) your Workers.
* Read about [Workers limits and pricing](https://developers.cloudflare.com/workers/platform/).
