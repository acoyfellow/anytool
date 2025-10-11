---
title: Build branches · Cloudflare Workers docs
description: Configure which git branches should trigger a Workers Build
lastUpdated: 2025-05-26T07:39:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
  md: https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/index.md
---

When you connect a git repository to Workers, commits made on the production git branch will produce a Workers Build. If you want to take advantage of [preview URLs](https://developers.cloudflare.com/workers/configuration/previews/) and [pull request comments](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/#pull-request-comment), you can additionally enable "non-production branch builds" in order to trigger a build on all branches of your repository.

## Change production branch

To change the production branch of your project:

1. In **Overview**, select your Workers project.
2. Go to **Settings** > **Build** > **Branch control**. Workers will default to the default branch of your git repository, but this can be changed in the dropdown.

Every push event made to this branch will trigger a build and execute the [build command](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-command), followed by the [deploy command](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#deploy-command).

## Configure non-production branch builds

To enable or disable non-production branch builds:

1. In **Overview**, select your Workers project.
2. Go to **Settings** > **Build** > **Branch control**. The checkbox allows you to enable or disable builds for non-production branches.

When enabled, every push event made to a non-production branch will trigger a build and execute the [build command](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-command), followed by the [non-production branch deploy command](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#non-production-branch-deploy-command).
