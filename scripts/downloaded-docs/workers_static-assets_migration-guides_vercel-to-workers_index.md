---
title: Migrate from Vercel to Workers · Cloudflare Workers docs
description: In this tutorial, you will learn how to migrate your Vercel
  application to Cloudflare Workers.
lastUpdated: 2025-08-19T18:37:36.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/
  md: https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/index.md
---

In this tutorial, you will learn how to migrate your Vercel application to Cloudflare Workers.

You should already have an existing project deployed on Vercel that you would like to host on Cloudflare Workers. Vercel specific features are not supported by Cloudflare Workers. Review the [Workers compatibility matrix](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/#compatibility-matrix) for more information on what is supported.

## Frameworks

Some frameworks like Next.js, Astro with on demand rendering, and others have specific guides for migrating to Cloudflare Workers. Refer to our [framework guides](https://developers.cloudflare.com/workers/framework-guides/) for more information. If your framework has a **Deploy an existing project on Workers** guide, follow that guide for specific instructions. Otherwise, continue with the steps below.

## Find your build command and build directory

To move your application to Cloudflare Workers, you will need to know your build command and build directory. Cloudflare Workers will use this information to build and deploy your application. We'll cover how to find these values in the Vercel Dashboard below.

In your Vercel Dashboard, find the project you want to migrate to Workers. Go to the **Settings** tab for your specific project and find the **Build & Development settings** panel. You will find the **Build Command** and **Output Directory** fields there. If you are using a framework, these values may not be filled in but will show the defaults used by the framework. Save these for deploying to Cloudflare Workers. In the below image, the **Build Command** is `npm run build`, and the **Output Directory** is `dist`.

![Finding the Build Command and Output Directory fields](https://developers.cloudflare.com/_astro/vercel-deploy-1.DrHD4fam_Z2wPpBu.webp)

## Create a wrangler file

In the root of your project, create a `wrangler.jsonc` or `wrangler.toml` file (`wrangler.jsonc` is recommended). What goes in the file depends on what type of application you are deploying: static or single-page application.

For each case, be sure to update the `<your-project-name>` value with the name of your project and `<your-build-directory>` value with the build directory from Vercel. Be sure to set the right pathing, for example `./dist` if the build directory is `dist` or `./build` if your build directory is `build`.

For a **static site**, you will need to add the following to your wrangler file.

* wrangler.jsonc

  ```jsonc
  {
    "name": "<your-project-name>",
    "compatibility_date": "2025-04-23",
    "assets": {
      "directory": "<your-build-directory>",
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "<your-project-name>"
  compatibility_date = "2025-04-23"


  [assets]
  directory = "<your-build-directory>"
  ```

For a **single page application**, you will need to add the following to your wrangler file, which includes the `not_found_handling` field.

* wrangler.jsonc

  ```jsonc
  {
    "name": "<your-project-name>",
    "compatibility_date": "2025-04-23",
    "assets": {
      "directory": "<your-build-directory>",
      "not_found_handling": "single-page-application"
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "<your-project-name>"
  compatibility_date = "2025-04-23"


  [assets]
  directory = "<your-build-directory>"
  not_found_handling = "single-page-application"
  ```

Some frameworks provide specific guides for migrating to Cloudflare Workers. Please refer to our [framework guides](https://developers.cloudflare.com/workers/framework-guides/) for more information. If your framework includes a “Deploy an existing project on Workers” guide, follow it for detailed instructions.

## Create a new Workers project

Your application has the proper configuration to be built and deployed to Cloudflare Workers.

The [Connect a new Worker](https://developers.cloudflare.com/workers/ci-cd/builds/#connect-a-new-worker) guide will instruct you how to connect your GitHub project to Cloudflare Workers. In the configuration step, ensure your build command is the same as the command you found on Vercel. Also, the deploy command should be the default `npx wrangler deploy`.

## Add a custom domain

Workers Custom Domains only supports domains that are configured as zones on your account. A zone refers to a domain (such as example.com) that Cloudflare manages for you, including its DNS and traffic.

Follow these instructions for [adding a custom domain to your Workers project](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#add-a-custom-domain). You will also find additional information on creating a zone for your domain.

## Delete your Vercel app

Once your custom domain is set up and sending requests to Cloudflare Workers, you can safely delete your Vercel application.

## Troubleshooting

For additional migration instructions, review the [Cloudflare Pages to Workers migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/). While not Vercel specific, it does cover some additional steps that may be helpful.
