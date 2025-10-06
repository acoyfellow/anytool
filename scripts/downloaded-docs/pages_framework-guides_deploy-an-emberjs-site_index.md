---
title: Ember · Cloudflare Pages docs
description: Ember.js is a productive, battle-tested JavaScript framework for
  building modern web applications. It includes everything you need to build
  rich UIs that work on any device.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-an-emberjs-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-an-emberjs-site/index.md
---

[Ember.js](https://emberjs.com) is a productive, battle-tested JavaScript framework for building modern web applications. It includes everything you need to build rich UIs that work on any device.

## Install Ember

To begin, install Ember:

```sh
npm install -g ember-cli
```

## Create an Ember project

Use the `ember new` command to create a new application:

```sh
npx ember new ember-quickstart --lang en
```

After the application is generated, change the directory to your project and run your project by running the following commands:

```sh
cd ember-quickstart
npm start
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

6. In the **Build settings** section, select *Ember.js* as your **Framework preset**. Your selection will provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx ember-cli build` |
| Build directory | `dist` |

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`.

Every time you commit new code to your Ember site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests and be able to preview how changes to your site look before deploying them to production.

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

## Learn more

By completing this guide, you have successfully deployed your Ember site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
