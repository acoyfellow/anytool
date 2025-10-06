---
title: Gridsome · Cloudflare Pages docs
description: Gridsome is a Vue.js powered Jamstack framework for building static
  generated websites and applications that are fast by default. In this guide,
  you will create a new Gridsome project and deploy it using Cloudflare Pages.
  You will use the @gridsome/cli, a command line tool for creating new Gridsome
  projects.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-gridsome-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-gridsome-site/index.md
---

[Gridsome](https://gridsome.org) is a Vue.js powered Jamstack framework for building static generated websites and applications that are fast by default. In this guide, you will create a new Gridsome project and deploy it using Cloudflare Pages. You will use the [`@gridsome/cli`](https://github.com/gridsome/gridsome/tree/master/packages/cli), a command line tool for creating new Gridsome projects.

## Install Gridsome

Install the `@gridsome/cli` by running the following command in your terminal:

```sh
npm install --global @gridsome/cli
```

## Set up a new project

With Gridsome installed, set up a new project by running `gridsome create`. The `create` command accepts a name that defines the directory of the project created and an optional starter kit name. You can review more starters in the [Gridsome starters section](https://gridsome.org/docs/starters/).

```sh
npx gridsome create my-gridsome-website
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

To deploy your site to Pages:

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Build settings** section, select *Gridsome* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx gridsome build` |
| Build directory | `dist` |

After configuring your site, you can begin your first deploy. You should see Cloudflare Pages installing `vuepress`, your project dependencies, and building your site, before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Gridsome project, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes to your site look before deploying them to production.

## Learn more

By completing this guide, you have successfully deployed your Gridsome site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
