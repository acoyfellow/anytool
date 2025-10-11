---
title: Elder.js · Cloudflare Pages docs
description: Elder.js is an SEO-focused framework for building static sites with SvelteKit.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-an-elderjs-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-an-elderjs-site/index.md
---

[Elder.js](https://elderguide.com/tech/elderjs/) is an SEO-focused framework for building static sites with [SvelteKit](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/).

In this guide, you will create a new Elder.js application and deploy it using Cloudflare Pages.

## Setting up a new project

Create a new project using [`npx degit Elderjs/template`](https://docs.npmjs.com/cli/v6/commands/npm-init), giving it a project name:

```sh
npx degit Elderjs/template elderjs-app
cd elderjs-app
```

The Elder.js template includes a number of pages and examples showing how to build your static site, but by simply generating the project, it is already ready to be deployed to Cloudflare Pages.

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

6. In the **Build settings** section, select *Elder.js* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npm run build` |
| Build directory | `public` |

Optionally, you can customize the **Project name** field. It defaults to the GitHub repository's name, but it does not need to match. The **Project name** value is assigned as your `*.pages.dev` subdomain.

### Finalize Setup

After completing configuration, click the **Save and Deploy** button.

You will see your first deploy pipeline in progress. Pages installs all dependencies and builds the project as specified.

Cloudflare Pages will automatically rebuild your project and deploy it on every new pushed commit.

Additionally, you will have access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), which repeat the build-and-deploy process for pull requests. With these, you can preview changes to your project with a real URL before deploying them to production.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

## Learn more

By completing this guide, you have successfully deployed your Elder.js site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
