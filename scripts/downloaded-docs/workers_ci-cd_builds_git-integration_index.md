---
title: Git integration · Cloudflare Workers docs
description: Learn how to add and manage your Git integration for Workers Builds
lastUpdated: 2025-09-17T11:26:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/
  md: https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/index.md
---

Cloudflare supports connecting your [GitHub](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) and [GitLab](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/gitlab-integration/) repository to your Cloudflare Worker, and will automatically deploy your code every time you push a change.

Adding a Git integration also lets you monitor build statuses directly in your Git provider using [pull request comments](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/#pull-request-comment), [check runs](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/#check-run), or [commit statuses](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/gitlab-integration/#commit-status), so you can manage deployments without leaving your workflow.

## Supported Git Providers

Cloudflare supports connecting Cloudflare Workers to your GitHub and GitLab repositories. Workers Builds does not currently support connecting self-hosted instances of GitHub or GitLab.

If you using a different Git provider (e.g. Bitbucket), you can use an [external CI/CD provider (e.g. GitHub Actions)](https://developers.cloudflare.com/workers/ci-cd/external-cicd/) and deploy using [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/#deploy).

## Add a Git Integration

Workers Builds provides direct integration with GitHub and GitLab accounts, including both individual and organization accounts, that are *not* self-hosted.

If you do not have a Git account linked to your Cloudflare account, you will be prompted to set up an installation to GitHub or GitLab when [connecting a repository](https://developers.cloudflare.com/workers/ci-cd/builds/#get-started) for the first time, or when adding a new Git account. Follow the prompts and authorize the Cloudflare Git integration.

![Git providers](https://developers.cloudflare.com/_astro/workers-git-provider.aIMoWcJE_Z1TBi8Q.webp)

You can check the following pages to see if your Git integration has been installed:

* [GitHub Applications page](https://github.com/settings/installations) (if you are in an organization, select **Switch settings context** to access your GitHub organization settings)
* [GitLab Authorized Applications page](https://gitlab.com/-/profile/applications)

For details on providing access to organization accounts, see [GitHub organizational access](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/#organizational-access) and [GitLab organizational access](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/gitlab-integration/#organizational-access).

## Manage a Git Integration

To manage your Git installation:

1. Go to the **Workers & Pages** page in the Cloudflare dashboard.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Worker.

3. Go to **Settings** > **Builds**.

4. Under **Git Repository**, select **Manage**.

This can be useful for managing repository access or troubleshooting installation issues by reinstalling. For more details, see the [GitHub](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration) and [GitLab](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/gitlab-integration) guides for how to manage your installation.
