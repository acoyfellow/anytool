---
title: CI/CD · Cloudflare Workers docs
description: Set up continuous integration and continuous deployment for your Workers.
lastUpdated: 2025-02-05T10:06:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/ci-cd/
  md: https://developers.cloudflare.com/workers/ci-cd/index.md
---

You can set up continuous integration and continuous deployment (CI/CD) for your Workers by using either the integrated build system, [Workers Builds](#workers-builds), or using [external providers](#external-cicd) to optimize your development workflow.

## Why use CI/CD?

Using a CI/CD pipeline to deploy your Workers is a best practice because it:

* Automates the build and deployment process, removing the need for manual `wrangler deploy` commands.
* Ensures consistent builds and deployments across your team by using the same source control management (SCM) system.
* Reduces variability and errors by deploying in a uniform environment.
* Simplifies managing access to production credentials.

## Which CI/CD should I use?

Choose [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds) if you want a fully integrated solution within Cloudflare's ecosystem that requires minimal setup and configuration for GitHub or GitLab users.

We recommend using [external CI/CD providers](https://developers.cloudflare.com/workers/ci-cd/external-cicd) if:

* You have a self-hosted instance of GitHub or GitLabs, which is currently not supported in Workers Builds' [Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)
* You are using a Git provider that is not GitHub or GitLab

## Workers Builds

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds) is Cloudflare's native CI/CD system that allows you to integrate with GitHub or GitLab to automatically deploy changes with each new push to a selected branch (e.g. `main`).

![Workers Builds Workflow Diagram](https://developers.cloudflare.com/_astro/workers-builds-workflow.Bmy3qIVc_dylLs.webp)

Ready to streamline your Workers deployments? Get started with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/#get-started).

## External CI/CD

You can also choose to set up your CI/CD pipeline with an external provider.

* [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
* [GitLab CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/gitlab-cicd/)
