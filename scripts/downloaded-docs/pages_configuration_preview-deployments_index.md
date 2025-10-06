---
title: Preview deployments · Cloudflare Pages docs
description: "Preview deployments allow you to preview new versions of your
  project without deploying it to production. To view preview deployments:"
lastUpdated: 2025-09-29T16:19:48.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/configuration/preview-deployments/
  md: https://developers.cloudflare.com/pages/configuration/preview-deployments/index.md
---

Preview deployments allow you to preview new versions of your project without deploying it to production. To view preview deployments:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your project and find the deployment you would like to view.

Every time you open a new pull request on your GitHub repository, Cloudflare Pages will create a unique preview URL, which will stay updated as you continue to push new commits to the branch. This is only true when pull requests originate from the repository itself.

![GitHub Preview URLs](https://developers.cloudflare.com/_astro/ghpreviewurls.DuZwczMZ_18Cm2.webp)

For example, if you have a repository called `user-example` connected to Pages, this will give you a `user-example.pages.dev` subdomain. If `main` is your default branch, then any commits to the `main` branch will update your `user-example.pages.dev` content, as well as any [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) attached to the project.

![User-example repository's deployment status and preview](https://developers.cloudflare.com/_astro/preview-deployment-mergedone.CyZvkVv1_1lgtKi.webp)

While developing `user-example`, you may push new changes to a `development` branch, for example.

In this example, after you create the new `development` branch, Pages will automatically generate a preview deployment for these changes available at `373f31e2.user-example.pages.dev` - where `373f31e2` is a randomly generated hash.

Each new branch you create will receive a new, randomly-generated hash in front of your `pages.dev` subdomain.

![User-example repository's newly generated preview deployment link and status](https://developers.cloudflare.com/_astro/preview-deployment-generated.CslHDdSO_24Lj7F.webp)

Any additional changes to the `development` branch will continue to update this `373f31e2.user-example.pages.dev` preview address until the `development` branch is merged with the `main` production branch.

Any custom domains, as well as your `user-example.pages.dev` site, will not be affected by preview deployments.

## Customize preview deployments access

You can use [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) to manage access to your deployment previews. By default, these deployment URLs are public. Enabling the access policy will restrict viewing project deployments to your Cloudflare account.

Once enabled, you can [set up a multi-user account](https://developers.cloudflare.com/fundamentals/manage-members/) to allow other members of your team to view preview deployments.

By default, preview deployments are enabled and available publicly. In your project's settings, you can require visitors to authenticate to view preview deployment. This allows you to lock down access to these preview deployments to your teammates, organization, or anyone else you specify via [Access policies](https://developers.cloudflare.com/cloudflare-one/policies/).

To protect your preview deployments behind Cloudflare Access:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Pages project.

3. Go to **Settings** > **General** > and select **Enable access policy**.

Note that this will only protect your preview deployments (for example, `373f31e2.user-example.pages.dev` and every other randomly generated preview link) and not your `*.pages.dev` domain or custom domain.

Note

If you want to enable Access for your `*.pages.dev` domain and your custom domain along with your preview deployments, review [Known issues](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain) for instructions.

## Preview aliases

When a preview deployment is published, it is given a unique, hash-based address — for example, `<hash>.<project>.pages.dev`. These are atomic and may always be visited in the future. However, Pages also creates an alias for `git` branch's name and updates it so that the alias always maps to the latest commit of that branch.

For example, if you push changes to a `development` branch (which is not associated with your Production environment), then Pages will deploy to `abc123.<project>.pages.dev` and alias `development.<project>.pages.dev` to it. Later, you may push new work to the `development` branch, which creates the `xyz456.<project>.pages.dev` deployment. At this point, the `development.<project>.pages.dev` alias points to the `xyz456` deployment, but `abc123.<project>.pages.dev` remains accessible directly.

Branch name aliases are lowercased and non-alphanumeric characters are replaced with a hyphen — for example, the `fix/api` branch creates the `fix-api.<project>.pages.dev` alias.

To view branch aliases within your Pages project, select **View build** for any preview deployment. **Deployment details** will display all aliases associated with that deployment.

You can attach a Preview alias to a custom domain by [adding a custom domain to a branch](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/).

## Preview indexing by search engines

To maintain a healthy SEO profile, it's vital to prevent search engines from finding duplicate content across the web. Because preview deployments are designed to be an exact replica of your production environment, they inherently create this exact situation. Cloudflare Pages by default ensures your search rankings are not harmed by these temporary previews.

### X-Robots-Tag: noindex on Preview Deployments

By default, every preview deployment generated by Cloudflare Pages includes the X-Robots-Tag: noindex HTTP response header. This header acts as a clear directive to search engine crawlers, instructing them to disregard the page and not include it in their search results.

You can easily confirm that your preview deployments are correctly configured to block indexing. Run the following curl command in your terminal, replacing the placeholder with your unique preview URL:

```plaintext
curl -I https://<your-preview-url>.pages.dev
```

Inspect the output for the x-robots-tag: noindex line to verify that your preview site is not being indexed.
