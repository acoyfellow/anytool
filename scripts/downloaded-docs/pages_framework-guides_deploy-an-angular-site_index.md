---
title: Angular · Cloudflare Pages docs
description: Angular is an incredibly popular framework for building reactive
  and powerful front-end applications.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-an-angular-site/index.md
---

[Angular](https://angular.io/) is an incredibly popular framework for building reactive and powerful front-end applications.

In this guide, you will create a new Angular application and deploy it using Cloudflare Pages.

## Create a new project using the `create-cloudflare` CLI (C3)

Use the [`create-cloudflare`](https://www.npmjs.com/package/create-cloudflare) CLI (C3) to set up a new project. C3 will create a new project directory, initiate Angular's official setup tool, and provide the option to deploy instantly.

To use `create-cloudflare` to create a new Angular project, run the following command:

* npm

  ```sh
  npm create cloudflare@latest -- my-angular-app --framework=angular --platform=pages
  ```

* yarn

  ```sh
  yarn create cloudflare my-angular-app --framework=angular --platform=pages
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-angular-app --framework=angular --platform=pages
  ```

`create-cloudflare` will install dependencies, including the [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/#check-your-wrangler-version) CLI and the Cloudflare Pages adapter, and ask you setup questions.

Git integration

The initial deployment created via C3 is referred to as a [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/). To set up a deployment via the Pages Git integration, refer to the [Git Integration](#git-integration) section below.

## Git integration

In addition to [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) deployments, you can deploy projects via [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration). Git integration allows you to connect a GitHub or GitLab repository to your Pages application and have your Pages application automatically built and deployed after each new commit is pushed to it.

Git integration

Currently, you cannot add Git integration to existing Pages applications. If you have already deployed your application, you need to create a new Pages application in order to add Git integration to it.

Setup requires a basic understanding of [Git](https://git-scm.com/). If you are new to Git, refer to GitHub's [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

### Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, go to your newly created project directory to prepare and push your local application to GitHub by running the following commands in your terminal:



```sh
# Skip the following three commands if you have built your application
# using C3 or already committed your changes
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
| Build directory | `dist/cloudflare` |

On some versions of Angular, you may need to:

Change the `Build command` to `npx ng build --output-path dist/cloudflare`\
Change the `Build directory` to `dist/cloudflare/browser`

Optionally, you can customize the **Project name** field. It defaults to the GitHub repository's name, but it does not need to match. The **Project name** value is assigned as your `*.pages.dev` subdomain.

1. After completing configuration, select the **Save and Deploy**.

Review your first deploy pipeline in progress. Pages installs all dependencies and builds the project as specified. Cloudflare Pages will automatically rebuild your project and deploy it on every new pushed commit.

Additionally, you will have access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), which repeat the build-and-deploy process for pull requests. With these, you can preview changes to your project with a real URL before deploying your changes to production.

## Learn more

By completing this guide, you have successfully deployed your Angular site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
