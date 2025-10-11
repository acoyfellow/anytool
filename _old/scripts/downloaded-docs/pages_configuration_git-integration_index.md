---
title: Git integration · Cloudflare Pages docs
description: You can connect each Cloudflare Pages project to a GitHub or GitLab
  repository, and Cloudflare will automatically deploy your code every time you
  push a change to a branch.
lastUpdated: 2025-09-17T11:00:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/configuration/git-integration/
  md: https://developers.cloudflare.com/pages/configuration/git-integration/index.md
---

You can connect each Cloudflare Pages project to a [GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration) or [GitLab](https://developers.cloudflare.com/pages/configuration/git-integration/gitlab-integration) repository, and Cloudflare will automatically deploy your code every time you push a change to a branch.

Note

Cloudflare Workers now also supports Git integrations to automatically build and deploy Workers from your connected Git repository. Learn more in [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/).

When you connect a git repository to your Cloudflare Pages project, Cloudflare will also:

* **Preview deployments for custom branches**, generating preview URLs for a commit to any branch in the repository without affecting your production deployment.
* **Preview URLs in pull requests** (PRs) to the repository.
* **Build and deployment status checks** within the Git repository.
* **Skipping builds using a commit message**.

These features allow you to manage your deployments directly within GitHub or GitLab without leaving your team's regular development workflow.

You cannot switch to Direct Upload later

If you deploy using the Git integration, you cannot switch to [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) later. However, if you already use a Git-integrated project and do not want to trigger deployments every time you push a commit, you can [disable automatic deployments](https://developers.cloudflare.com/pages/configuration/git-integration/#disable-automatic-deployments) on all branches. Then, you can use Wrangler to deploy directly to your Pages projects and make changes to your Git repository without automatically triggering a build.

## Supported Git providers

Cloudflare supports connecting Cloudflare Pages to your GitHub and GitLab repositories. Pages does not currently support connecting self-hosted instances of GitHub or GitLab.

If you using a different Git provider (e.g. Bitbucket) or a self-hosted instance, you can start with a Direct Upload project and deploy using a CI/CD provider (e.g. GitHub Actions) with [Wrangler CLI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Add a Git integration

If you do not have a Git account linked to your Cloudflare account, you will be prompted to set up an installation to GitHub or GitLab when [connecting to Git](https://developers.cloudflare.com/pages/get-started/git-integration/) for the first time, or when adding a new Git account. Follow the prompts and authorize the Cloudflare Git integration.

You can check the following pages to see if your Git integration has been installed:

* [GitHub Applications page](https://github.com/settings/installations) (if you're in an organization, select **Switch settings context** to access your GitHub organization settings)
* [GitLab Authorized Applications page](https://gitlab.com/-/profile/applications)

For details on providing access to organization accounts, see the [GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#organizational-access) and [GitLab](https://developers.cloudflare.com/pages/configuration/git-integration/gitlab-integration/#organizational-access) guides.

## Manage a Git integration

You can manage the Git installation associated with your repository connection by navigating to the Pages project, then going to **Settings** > **Builds** and selecting **Manage** under **Git Repository**.

This can be useful for managing repository access or troubleshooting installation issues by reinstalling. For more details, see the [GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#managing-access) and [GitLab](https://developers.cloudflare.com/pages/configuration/git-integration/gitlab-integration/#managing-access) guides.

## Disable automatic deployments

If you are using a Git-integrated project and do not want to trigger deployments every time you push a commit, you can use [branch control](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) to disable/pause builds:

1. Go to **Workers & Pages** in the Cloudflare dashboard.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Pages project.

3. Navigate to **Build** > edit **Branch control** > turn off **Enable automatic production branch deployments**.

4. You can also change your Preview branch to **None (Disable automatic branch deployments)** to pause automatic preview deployments.

Then, you can use Wrangler to deploy directly to your Pages project and make changes to your Git repository without automatically triggering a build.
