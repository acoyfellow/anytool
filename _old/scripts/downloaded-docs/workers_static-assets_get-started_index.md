---
title: Get Started · Cloudflare Workers docs
description: Run front-end websites — static or dynamic — directly on
  Cloudflare's global network.
lastUpdated: 2025-06-05T13:25:05.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/get-started/
  md: https://developers.cloudflare.com/workers/static-assets/get-started/index.md
---

For most front-end applications, you'll want to use a framework. Workers supports number of popular [frameworks](https://developers.cloudflare.com/workers/framework-guides/) that come with ready-to-use components, a pre-defined and structured architecture, and community support. View [framework specific guides](https://developers.cloudflare.com/workers/framework-guides/) to get started using a framework.

Alternatively, you may prefer to build your website from scratch if:

* You're interested in learning by implementing core functionalities on your own.
* You're working on a simple project where you might not need a framework.
* You want to optimize for performance by minimizing external dependencies.
* You require complete control over every aspect of the application.
* You want to build your own framework.

This guide will instruct you through setting up and deploying a static site or a full-stack application without a framework on Workers.

## Deploy a static site

This guide will instruct you through setting up and deploying a static site on Workers.

### 1. Create a new Worker project using the CLI

[C3 (`create-cloudflare-cli`)](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare) is a command-line tool designed to help you set up and deploy new applications to Cloudflare. Open a terminal window and run C3 to create your Worker project:

* npm

  ```sh
  npm create cloudflare@latest -- my-static-site
  ```

* yarn

  ```sh
  yarn create cloudflare my-static-site
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-static-site
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `Static site`.
* For *Which language do you want to use?*, choose `TypeScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

After setting up your project, change your directory by running the following command:

```sh
cd my-static-site
```

### 2. Develop locally

After you have created your Worker, run the [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) in the project directory to start a local server. This will allow you to preview your project locally during development.

```sh
npx wrangler dev
```

### 3. Deploy your project

Your project can be deployed to a `*.workers.dev` subdomain or a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), from your own machine or from any CI/CD system, including [Cloudflare's own](https://developers.cloudflare.com/workers/ci-cd/builds/).

The [`wrangler deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) will build and deploy your project. If you're using CI, ensure you update your ["deploy command"](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings) configuration appropriately.

```sh
npx wrangler deploy
```

Note

Learn about how assets are configured and how routing works from [Routing configuration](https://developers.cloudflare.com/workers/static-assets/routing/).

## Deploy a full-stack application

This guide will instruct you through setting up and deploying dynamic and interactive server-side rendered (SSR) applications on Cloudflare Workers.

When building a full-stack application, you can use any [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/), [including assets' own](https://developers.cloudflare.com/workers/static-assets/binding/), to interact with resources on the Cloudflare Developer Platform.

### 1. Create a new Worker project

[C3 (`create-cloudflare-cli`)](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare) is a command-line tool designed to help you set up and deploy new applications to Cloudflare.

Open a terminal window and run C3 to create your Worker project:

* npm

  ```sh
  npm create cloudflare@latest -- my-dynamic-site
  ```

* yarn

  ```sh
  yarn create cloudflare my-dynamic-site
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-dynamic-site
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `SSR / full-stack app`.
* For *Which language do you want to use?*, choose `TypeScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

After setting up your project, change your directory by running the following command:

```sh
cd my-dynamic-site
```

### 2. Develop locally

After you have created your Worker, run the [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) in the project directory to start a local server. This will allow you to preview your project locally during development.

```sh
npx wrangler dev
```

### 3. Modify your Project

With your new project generated and running, you can begin to write and edit your project:

* The `src/index.ts` file is populated with sample code. Modify its content to change the server-side behavior of your Worker.
* The `public/index.html` file is populated with sample code. Modify its content, or anything else in `public/`, to change the static assets of your Worker.

Then, save the files and reload the page. Your project's output will have changed based on your modifications.

### 4. Deploy your Project

Your project can be deployed to a `*.workers.dev` subdomain or a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), from your own machine or from any CI/CD system, including [Cloudflare's own](https://developers.cloudflare.com/workers/ci-cd/builds/).

The [`wrangler deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) will build and deploy your project. If you're using CI, ensure you update your ["deploy command"](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings) configuration appropriately.

```sh
npx wrangler deploy
```

Note

Learn about how assets are configured and how routing works from [Routing configuration](https://developers.cloudflare.com/workers/static-assets/routing/).
