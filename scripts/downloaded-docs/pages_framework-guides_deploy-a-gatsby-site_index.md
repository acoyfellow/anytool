---
title: Gatsby · Cloudflare Pages docs
description: Gatsby is an open-source React framework for creating websites and
  apps. In this guide, you will create a new Gatsby application and deploy it
  using Cloudflare Pages. You will be using the gatsby CLI to create a new
  Gatsby site.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-gatsby-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-gatsby-site/index.md
---

[Gatsby](https://www.gatsbyjs.com/) is an open-source React framework for creating websites and apps. In this guide, you will create a new Gatsby application and deploy it using Cloudflare Pages. You will be using the `gatsby` CLI to create a new Gatsby site.

## Install Gatsby

Install the `gatsby` CLI by running the following command in your terminal:

```sh
npm install -g gatsby-cli
```

## Create a new project

With Gatsby installed, you can create a new project using `gatsby new`. The `new` command accepts a GitHub URL for using an existing template. As an example, use the `gatsby-starter-lumen` template by running the following command in your terminal. You can find more in [Gatsby's Starters section](https://www.gatsbyjs.com/starters/?v=2):

```sh
npx gatsby new my-gatsby-site https://github.com/alxshelepenok/gatsby-starter-lumen
```

## Before you continue

All of the framework guides assume you already have a fundamental understanding of [Git](https://git-scm.com/). If you are new to Git, refer to this [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

If you clone with SSH, you must [generate SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on each computer you use to push or pull from GitHub.

Refer to the [GitHub documentation](https://guides.github.com/introduction/git-handbook/) and [Git documentation](https://git-scm.com/book/en/v2) for more information.

## Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, go to your newly created project directory to prepare and push your local application to GitHub by running the following commands in your terminal:

```sh
git remote add origin https://github.com/<your-gh-username>/<repository-name>
git branch -M main
git push -u origin main
```

## Deploy with Cloudflare Pages

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Build settings** section, select *Gatsby* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx gatsby build` |
| Build directory | `public` |

After configuring your site, you can begin your first deploy. You should see Cloudflare Pages installing `gatsby`, your project dependencies, and building your site, before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Gatsby site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

## Dynamic routes

If you are using [dynamic routes](https://www.gatsbyjs.com/docs/reference/functions/routing/#dynamic-routing) in your Gatsby project, set up a [proxy redirect](https://developers.cloudflare.com/pages/configuration/redirects/#proxying) for these routes to take effect.

If you have a dynamic route, such as `/users/[id]`, create your proxy redirect by referring to the following example:

```plaintext
/users/* /users/:id 200
```

## Learn more

By completing this guide, you have successfully deployed your Gatsby site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
