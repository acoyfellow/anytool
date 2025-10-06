---
title: SolidStart · Cloudflare Pages docs
description: Solid is an open-source web application framework focused on
  generating performant applications with a modern developer experience based on
  JSX.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-solid-start-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-solid-start-site/index.md
---

[Solid](https://www.solidjs.com/) is an open-source web application framework focused on generating performant applications with a modern developer experience based on JSX.

In this guide, you will create a new Solid application implemented via [SolidStart](https://start.solidjs.com/getting-started/what-is-solidstart) (Solid's meta-framework) and deploy it using Cloudflare Pages.

## Create a new project

Use the [`create-cloudflare`](https://www.npmjs.com/package/create-cloudflare) CLI (C3) to set up a new project. C3 will create a new project directory, initiate Solid's official setup tool, and provide the option to deploy instantly.

To use `create-cloudflare` to create a new Solid project, run the following command:

* npm

  ```sh
  npm create cloudflare@latest -- my-solid-app --framework=solid
  ```

* yarn

  ```sh
  yarn create cloudflare my-solid-app --framework=solid
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-solid-app --framework=solid
  ```

You will be prompted to select a starter. Choose any of the available options. You will then be asked if you want to enable Server Side Rendering. Reply `yes`. Finally, you will be asked if you want to use TypeScript, choose either `yes` or `no`.

`create-cloudflare` will then install dependencies, including the [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/#check-your-wrangler-version) CLI and the SolidStart Cloudflare Pages adapter, and ask you setup questions.

After you have installed your project dependencies, start your application:

```sh
npm run dev
```

## SolidStart Cloudflare configuration

Note

If using [`create-cloudflare` (C3)](https://www.npmjs.com/package/create-cloudflare), you can bypass adding an adapter as C3 automatically installs any necessary adapters and configures them when creating your project.

In order to configure SolidStart so that it can be deployed to Cloudflare pages, update its config file like so:

```diff
import { defineConfig } from "@solidjs/start/config";


export default defineConfig({
  server: {
    preset: "cloudflare-pages",


    rollupConfig: {
      external: ["node:async_hooks"]
    }
  }
});
```

## Before you continue

All of the framework guides assume you already have a fundamental understanding of [Git](https://git-scm.com/). If you are new to Git, refer to this [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

If you clone with SSH, you must [generate SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on each computer you use to push or pull from GitHub.

Refer to the [GitHub documentation](https://guides.github.com/introduction/git-handbook/) and [Git documentation](https://git-scm.com/book/en/v2) for more information.

## Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, go to your newly created project directory to prepare and push your local application to GitHub by running the following commands in your terminal:

```sh
git init
git remote add origin https://github.com/<your-gh-username>/<repository-name>
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## Deploy with Cloudflare Pages

### Deploy via the `create-cloudflare` CLI (C3)

If you use [`create-cloudflare`(C3)](https://www.npmjs.com/package/create-cloudflare) to create your new Solid project, C3 will install all dependencies needed for your project and prompt you to deploy your project via the CLI. If you deploy, your site will be live and you will be provided with a deployment URL.

### Deploy via the Cloudflare dashboard

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Set up builds and deployments** section, provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npm run build` |
| Build directory | `dist` |

After configuring your site, you can begin your first deploy. You should see Cloudflare Pages installing `npm`, your project dependencies, and building your site before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Solid repository, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, to preview how changes look to your site before deploying them to production.

## Learn more

By completing this guide, you have successfully deployed your Solid site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
