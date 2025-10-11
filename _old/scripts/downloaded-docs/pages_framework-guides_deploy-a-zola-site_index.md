---
title: Zola · Cloudflare Pages docs
description: Zola is a fast static site generator in a single binary with
  everything built-in. In this guide, you will create a new Zola application and
  deploy it using Cloudflare Pages. You will use the zola CLI to create a new
  Zola site.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-zola-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-zola-site/index.md
---

[Zola](https://www.getzola.org/) is a fast static site generator in a single binary with everything built-in. In this guide, you will create a new Zola application and deploy it using Cloudflare Pages. You will use the `zola` CLI to create a new Zola site.

## Installing Zola

First, [install](https://www.getzola.org/documentation/getting-started/installation/) the `zola` CLI, using the specific instructions for your operating system below:

### macOS (Homebrew)

If you use the package manager [Homebrew](https://brew.sh), run the `brew install` command in your terminal to install Zola:

```sh
brew install zola
```

### Windows (Chocolatey)

If you use the package manager [Chocolatey](https://chocolatey.org/), run the `choco install` command in your terminal to install Zola:

```sh
choco install zola
```

### Windows (Scoop)

If you use the package manager [Scoop](https://scoop.sh/), run the `scoop install` command in your terminal to install Zola:

```sh
scoop install zola
```

### Linux (pkg)

Your Linux distro's package manager may include Zola. If this is the case, you can install it directly using your distro's package manager -- for example, using `pkg`, run the following command in your terminal:

```sh
pkg install zola
```

If your package manager does not include Zola or you would like to download a release directly, refer to the [**Manual**](https://developers.cloudflare.com/pages/framework-guides/deploy-a-zola-site/#manual-installation) section below.

### Manual installation

The Zola GitHub repository contains pre-built versions of the Zola command-line tool for various operating systems, which can be found on [the Releases page](https://github.com/getzola/zola/releases).

For more instruction on installing these releases, refer to [Zola's install guide](https://www.getzola.org/documentation/getting-started/installation/).

## Creating a new project

With Zola installed, create a new project by running the `zola init` command in your terminal using the default template:

```sh
zola init my-zola-project
```

Upon running `zola init`, you will prompted with three questions:

1. What is the URL of your site? (<https://example.com>): You can leave this one blank for now.

2. Do you want to enable Sass compilation? \[Y/n]: Y

3. Do you want to enable syntax highlighting? \[y/N]: y

4. Do you want to build a search index of the content? \[y/N]: y

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

## Learn more

By completing this guide, you have successfully deployed your site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `zola build` |
| Build directory | `public` |

Below the configuration, make sure to set the **Environment Variables (advanced)** for specifying the `ZOLA_VERSION`.

For example, `ZOLA_VERSION`: `0.17.2`.

After configuring your site, you can begin your first deploy. You should see Cloudflare Pages installing `zola`, your project dependencies, and building your site, before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`.

You can now add that subdomain as the `base_url` in your `config.toml` file.

For example:

```yaml
# The URL the site will be built for
base_url = "https://my-zola-project.pages.dev"
```

Every time you commit new code to your Zola site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

### Handling Preview Deployments

When working with Cloudflare Pages, you might use preview deployments for testing changes before merging to your main branch. However, these preview deployments use different URLs (like `https://your-branch-name.my-zola-project.pages.dev`), which can cause issues with asset loading if your `base_url` is hardcoded.

To fix this, modify your build command in the Cloudflare Pages configuration to dynamically set the base URL depending on the environment:

```sh
if [ "$CF_PAGES_BRANCH" = "main" ]; then zola build; else zola build --base-url $CF_PAGES_URL; fi
```

This command uses:

* The `base_url` set in `config.toml` when building from the `main` branch
* The preview deployment URL (automatically provided by Cloudflare Pages as `$CF_PAGES_URL`) for all other branches

## Learn more

By completing this guide, you have successfully deployed your Zola site to Cloudflare Pages. To get started with other frameworks, [refer to the list of Framework guides](https://developers.cloudflare.com/pages/framework-guides/).
