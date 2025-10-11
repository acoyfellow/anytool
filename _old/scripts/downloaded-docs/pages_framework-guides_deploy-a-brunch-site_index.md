---
title: Brunch · Cloudflare Pages docs
description: Brunch is a fast front-end web application build tool with simple
  declarative configuration and seamless incremental compilation for rapid
  development.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-brunch-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-brunch-site/index.md
---

[Brunch](https://brunch.io/) is a fast front-end web application build tool with simple declarative configuration and seamless incremental compilation for rapid development.

## Install Brunch

To begin, install Brunch:

```sh
npm install -g brunch
```

## Create a Brunch project

Brunch maintains a library of community-provided [skeletons](https://brunch.io/skeletons) to offer you a boilerplate for your project. Run Brunch's recommended `es6` skeleton with the `brunch new` command:

```sh
brunch new proj -s es6
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

## Learn more

By completing this guide, you have successfully deployed your site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npx brunch build --production` |
| Build directory | `public` |

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`.

Every time you commit new code to your Brunch site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests and be able to preview how changes look to your site before deploying them to production.

## Learn more

By completing this guide, you have successfully deployed your Brunch site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
