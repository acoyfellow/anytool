---
title: Get started · Cloudflare Pages docs
description: Deploy a static site built using Next.js to Cloudflare Pages
lastUpdated: 2025-09-17T18:05:52.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
  md: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/index.md
---

Note

Do not use this guide unless you have a specific use case for static exports. Cloudflare recommends using Workers to deploy your Next.js site, for more instructions refer the [Next.js Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs).

[Next.js](https://nextjs.org) is an open-source React framework for creating websites and applications. In this guide, you will create a new Next.js application and deploy it using Cloudflare Pages.

This guide will instruct you how to deploy a static site Next.js project with [static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

## Before you continue

All of the framework guides assume you already have a fundamental understanding of [Git](https://git-scm.com/). If you are new to Git, refer to this [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

If you clone with SSH, you must [generate SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on each computer you use to push or pull from GitHub.

Refer to the [GitHub documentation](https://guides.github.com/introduction/git-handbook/) and [Git documentation](https://git-scm.com/book/en/v2) for more information.

## Select your Next.js project

If you already have a Next.js project that you wish to deploy, ensure that it is [configured for static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), change to its directory, and proceed to the next step. Otherwise, use `create-next-app` to create a new Next.js project.

```sh
npx create-next-app --example with-static-export my-app
```

After creating your project, a new `my-app` directory will be generated using the official [`with-static-export`](https://github.com/vercel/next.js/tree/canary/examples/with-static-export) example as a template. Change to this directory to continue.

```sh
cd my-app
```

### Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, prepare and push your local application to GitHub by running the following commands in your terminal:

```sh
git remote add origin https://github.com/<GH_USERNAME>/<REPOSITORY_NAME>.git
git branch -M main
git push -u origin main
```

### Deploy your application to Cloudflare Pages

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Build settings** section, select *Next.js (Static HTML Export)* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx next build` |
| Build directory | `out` |

After configuring your site, you can begin your first deploy. Cloudflare Pages will install `next`, your project dependencies, and build your site before deploying it.

## Preview your site

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`.

Every time you commit new code to your Next.js site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).
