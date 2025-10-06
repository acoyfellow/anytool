---
title: Analog · Cloudflare Pages docs
description: The fullstack Angular meta-framework
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-an-analog-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-an-analog-site/index.md
---

[Analog](https://analogjs.org/) is a fullstack meta-framework for Angular, powered by [Vite](https://vitejs.dev/) and [Nitro](https://nitro.unjs.io/).

In this guide, you will create a new Analog application and deploy it using Cloudflare Pages.

## Create a new project with `create-cloudflare`

The easiest way to create a new Analog project and deploy to Cloudflare Pages is to use the [`create-cloudflare`](https://www.npmjs.com/package/create-cloudflare) CLI (also known as C3). To get started, open a terminal and run:

* npm

  ```sh
  npm create cloudflare@latest -- my-analog-app --framework=analog --platform=pages
  ```

* yarn

  ```sh
  yarn create cloudflare my-analog-app --framework=analog --platform=pages
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-analog-app --framework=analog --platform=pages
  ```

C3 will walk you through the setup process and create a new project using `create-analog`, the official Analog creation tool. It will also install the necessary adapters along with the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/#check-your-wrangler-version).

Deployment

The final step of the C3 workflow will offer to deploy your application to Cloudflare. For more information on deployment options, see the [Deployment](#deployment) section below.

## Bindings

A [binding](https://developers.cloudflare.com/pages/functions/bindings/) allows your application to interact with Cloudflare developer products, such as [KV](https://developers.cloudflare.com/kv/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), [R2](https://developers.cloudflare.com/r2/), and [D1](https://developers.cloudflare.com/d1/).

If you intend to use bindings in your project, you must first set up your bindings for local and remote development.

In Analog, server-side code can be added via [API Routes](https://analogjs.org/docs/features/api/overview). The `defineEventHandler()` method is used to define your API endpoints in which you can access Cloudflare's context via the provided `context` field. The `context` field allows you to access any bindings set for your application.

The following code block shows an example of accessing a KV namespace in Analog.

```typescript
export default defineEventHandler(async ({ context }) => {
  const { MY_KV } = context.cloudflare.env;
  const greeting = (await MY_KV.get("greeting")) ?? "hello";


  return {
    greeting,
  };
});
```

### Setup bindings in development

Projects created via C3 come installed with a Nitro module that simplifies the process of working with bindings during development:

```typescript
const devBindingsModule = async (nitro: Nitro) => {
  if (nitro.options.dev) {
    nitro.options.plugins.push('./src/dev-bindings.ts');
  }
};


export default defineConfig({
  ...
  plugins: [analog({
    nitro: {
      preset: "cloudflare-pages",
      modules: [devBindingsModule]
    }
  })],
  ...
});
```

This module in turn loads a plugin which adds bindings to the request context in dev:

```typescript
import { NitroApp } from "nitropack";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";


export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    const _pkg = "wrangler"; // Bypass bundling!
    const { getPlatformProxy } = (await import(
      _pkg
    )) as typeof import("wrangler");
    const platform = await getPlatformProxy();


    event.context.cf = platform["cf"];
    event.context.cloudflare = {
      env: platform["env"] as unknown as Env,
      context: platform["ctx"],
    };
  });
});
```

In the code above, the `getPlatformProxy` helper function will automatically detect any bindings defined in your project's Wrangler file and emulate those bindings in local development. You may wish to refer to [Wrangler configuration information on bindings](https://developers.cloudflare.com/workers/wrangler/configuration/#bindings).

A new type definition for the `Env` type (used by `context.cloudflare.env`) can be generated from the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) with the following command:

```sh
npm run cf-typegen
```

This should be done any time you add new bindings to your Wrangler configuration.

### Setup bindings in deployed applications

In order to access bindings in a deployed application, you will need to [configure your bindings](https://developers.cloudflare.com/pages/functions/bindings/) in the Cloudflare dashboard.

## Deployment

When creating your new project, C3 will give you the option of deploying an initial version of your application via [Direct Upload](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/). You can redeploy your application at any time by running following command inside your project directory:

```sh
npm run deploy
```

## Git integration

In addition to [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) deployments, you can deploy projects via [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration). Git integration allows you to connect a GitHub or GitLab repository to your Pages application and have your Pages application automatically built and deployed after each new commit is pushed to it.

Git integration

Currently, you cannot add Git integration to existing Pages applications. If you have already deployed your application, you need to create a new Pages application in order to add Git integration to it.

Setup requires a basic understanding of [Git](https://git-scm.com/). If you are new to Git, refer to GitHub's [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

### Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, go to your newly created project directory to prepare and push your local application to GitHub by running the following commands in your terminal:

```sh
# Skip the following three commands if you have built your application
# using C3 or already committed your changes
git init
git add .
git commit -m "Initial commit"


git branch -M main
git remote add origin https://github.com/<YOUR_GH_USERNAME>/<REPOSITORY_NAME>
git push -u origin main
```

### Create a Pages project

## Learn more

By completing this guide, you have successfully deployed your site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npm run build` |
| Build directory | `dist/analog/public` |

Optionally, you can customize the **Project name** field. It defaults to the GitHub repository's name, but it does not need to match. The **Project name** value is assigned as your `*.pages.dev` subdomain.

1. After completing configuration, select the **Save and Deploy**.

Review your first deploy pipeline in progress. Pages installs all dependencies and builds the project as specified. Cloudflare Pages will automatically rebuild your project and deploy it on every new pushed commit.

Additionally, you will have access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), which repeat the build-and-deploy process for pull requests. With these, you can preview changes to your project with a real URL before deploying your changes to production.
