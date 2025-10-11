---
title: VitePress · Cloudflare Pages docs
description: VitePress is a static site generator (SSG) designed for building
  fast, content-centric websites. VitePress takes your source content written in
  Markdown, applies a theme to it, and generates static HTML pages that can be
  easily deployed anywhere.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vitepress-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vitepress-site/index.md
---

[VitePress](https://vitepress.dev/) is a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG) designed for building fast, content-centric websites. VitePress takes your source content written in [Markdown](https://en.wikipedia.org/wiki/Markdown), applies a theme to it, and generates static HTML pages that can be easily deployed anywhere.

In this guide, you will create a new VitePress project and deploy it using Cloudflare Pages.

## Set up a new project

VitePress ships with a command line setup wizard that will help you scaffold a basic project.

Run the following command in your terminal to create a new VitePress project:

* npm

  ```sh
  npx vitepress@latest init
  ```

* yarn

  ```sh
  yarn dlx vitepress@latest init
  ```

* pnpm

  ```sh
  pnpx vitepress@latest init
  ```

Amongst other questions, the setup wizard will ask you in which directory to save your new project, make sure to be in the project's directory and then install the `vitepress` dependency with the following command:

* npm

  ```sh
  npm i -D vitepress@latest
  ```

* yarn

  ```sh
  yarn add -D vitepress@latest
  ```

* pnpm

  ```sh
  pnpm add -D vitepress@latest
  ```

Note

If you encounter errors, make sure your local machine meets the [Prerequisites for VitePress](https://vitepress.dev/guide/getting-started#prerequisites).

Finally create a `.gitignore` file with the following content:

```plaintext
node_modules
.vitepress/cache
.vitepress/dist
```

This step makes sure that unnecessary files are not going to be included in the project's git repository (which we will set up next).

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

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Build settings** section, select *VitePress* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx vitepress build` |
| Build directory | `.vitepress/dist` |

After configuring your site, you can begin your first deploy. Cloudflare Pages will install `vitepress`, your project dependencies, and build your site, before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit and push new code to your VitePress project, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes to your site look before deploying them to production.

## Learn more

By completing this guide, you have successfully deployed your VitePress site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
