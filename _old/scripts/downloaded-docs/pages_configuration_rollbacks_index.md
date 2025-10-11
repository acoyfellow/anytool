---
title: Rollbacks · Cloudflare Pages docs
description: Rollbacks allow you to instantly revert your project to a previous
  production deployment.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/configuration/rollbacks/
  md: https://developers.cloudflare.com/pages/configuration/rollbacks/index.md
---

Rollbacks allow you to instantly revert your project to a previous production deployment.

Any production deployment that has been successfully built is a valid rollback target. When your project has rolled back to a previous deployment, you may still rollback to deployments that are newer than your current version. Note that preview deployments are not valid rollback targets.

In order to perform a rollback, go to **Deployments** in your Pages project. Browse the **All deployments** list and select the three dotted actions menu for the desired target. Select **Rollback to this deployment** for a confirmation window to appear. When confirmed, your project's production deployment will change instantly.

![Deployments for your Pages project that can be used for rollbacks](https://developers.cloudflare.com/_astro/rollbacks.DNHeRPOm_ZSEvgH.webp)

## Related resources

* [Preview Deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
* [Branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
