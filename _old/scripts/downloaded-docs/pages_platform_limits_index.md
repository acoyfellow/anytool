---
title: Limits · Cloudflare Pages docs
description: Below are limits observed by the Cloudflare Free plan. For more
  details on removing these limits, refer to the Cloudflare plans page.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/platform/limits/
  md: https://developers.cloudflare.com/pages/platform/limits/index.md
---

Below are limits observed by the Cloudflare Free plan. For more details on removing these limits, refer to the [Cloudflare plans](https://www.cloudflare.com/plans) page.

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

## Builds

Each time you push new code to your Git repository, Pages will build and deploy your site. You can build up to 500 times per month on the Free plan. Refer to the Pro and Business plans in [Pricing](https://pages.cloudflare.com/#pricing) if you need more builds.

Builds will timeout after 20 minutes. Concurrent builds are counted per account.

## Custom domains

Based on your Cloudflare plan type, a Pages project is limited to a specific number of custom domains. This limit is on a per-project basis.

| Free | Pro | Business | Enterprise |
| - | - | - | - |
| 100 | 250 | 500 | 500[1](#user-content-fn-1) |

## Files

Pages uploads each file on your site to Cloudflare's globally distributed network to deliver a low latency experience to every user that visits your site. Cloudflare Pages sites can contain up to 20,000 files.

## File size

The maximum file size for a single Cloudflare Pages site asset is 25 MiB.

Larger Files

To serve larger files, consider uploading them to [R2](https://developers.cloudflare.com/r2/) and utilizing the [public bucket](https://developers.cloudflare.com/r2/buckets/public-buckets/) feature. You can also use [custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/#connect-a-bucket-to-a-custom-domain), such as `static.example.com`, for serving these files.

## Functions

Requests to [Pages functions](https://developers.cloudflare.com/pages/functions/) count towards your quota for Workers plans, including requests from your Function to KV or Durable Object bindings.

Pages supports the [Standard usage model](https://developers.cloudflare.com/workers/platform/pricing/#example-pricing-standard-usage-model).

## Headers

A `_headers` file can have a maximum of 100 header rules.

An individual header in a `_headers` file can have a maximum of 2,000 characters. For managing larger headers, it is recommended to implement [Pages Functions](https://developers.cloudflare.com/pages/functions/).

## Preview deployments

You can have an unlimited number of [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) active on your project at a time.

## Redirects

A `_redirects` file can have a maximum of 2,000 static redirects and 100 dynamic redirects, for a combined total of 2,100 redirects. It is recommended to use [Bulk Redirects](https://developers.cloudflare.com/pages/configuration/redirects/#surpass-_redirects-limits) when you have a need for more than the `_redirects` file supports.

## Users

Your Pages site can be managed by an unlimited number of users via the Cloudflare dashboard. Note that this does not correlate with your Git project – you can manage both public and private repositories, open issues, and accept pull requests via without impacting your Pages site.

## Projects

Cloudflare Pages has a soft limit of 100 projects within your account in order to prevent abuse. If you need this limit raised, contact your Cloudflare account team or use the Limit Increase Request Form at the top of this page.

In order to protect against abuse of the service, Cloudflare may temporarily disable your ability to create new Pages projects, if you are deploying a large number of applications in a short amount of time. Contact support if you need this limit increased.

## Footnotes

1. If you need more custom domains, contact your account team. [↩](#user-content-fnref-1)
