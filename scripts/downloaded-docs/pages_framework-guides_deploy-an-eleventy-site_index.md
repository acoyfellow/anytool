---
title: Eleventy · Cloudflare Pages docs
description: Eleventy is a simple static site generator. In this guide, you will
  create a new Eleventy site and deploy it using Cloudflare Pages. You will be
  using the eleventy CLI to create a new Eleventy site.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-an-eleventy-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-an-eleventy-site/index.md
---

[Eleventy](https://www.11ty.dev/) is a simple static site generator. In this guide, you will create a new Eleventy site and deploy it using Cloudflare Pages. You will be using the `eleventy` CLI to create a new Eleventy site.

## Installing Eleventy

Install the `eleventy` CLI by running the following command in your terminal:

```sh
npm install -g @11ty/eleventy
```

## Creating a new project

There are a lot of [starter projects](https://www.11ty.dev/docs/starter/) available on the Eleventy website. As an example, use the `eleventy-base-blog` project by running the following commands in your terminal:

```sh
git clone https://github.com/11ty/eleventy-base-blog.git my-blog-name
cd my-blog-name
npm install
```

## Before you continue

All of the framework guides assume you already have a fundamental understanding of [Git](https://git-scm.com/). If you are new to Git, refer to this [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

If you clone with SSH, you must [generate SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on each computer you use to push or pull from GitHub.

Refer to the [GitHub documentation](https://guides.github.com/introduction/git-handbook/) and [Git documentation](https://git-scm.com/book/en/v2) for more information.

## Creating a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, prepare and push your local application to GitHub by running the following command in your terminal:

```sh
git remote set-url origin https://github.com/yourgithubusername/githubrepo
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

6. In the **Build settings** section, select *Eleventy* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx @11ty/eleventy` |
| Build directory | `_site` |

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Eleventy site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

## Learn more

By completing this guide, you have successfully deployed your Eleventy site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
