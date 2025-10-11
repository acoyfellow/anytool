---
title: Limits · Cloudflare Email Routing docs
description: When you process emails with Email Workers and you are on Workers’
  free pricing tier you might encounter an allocation error. This may happen due
  to the size of the emails you are processing and/or the complexity of your
  Email Worker. Refer to Worker limits for more information.
lastUpdated: 2024-09-29T02:03:11.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/email-routing/limits/
  md: https://developers.cloudflare.com/email-routing/limits/index.md
---

## Email Workers size limits

When you process emails with Email Workers and you are on [Workers’ free pricing tier](https://developers.cloudflare.com/workers/platform/pricing/) you might encounter an allocation error. This may happen due to the size of the emails you are processing and/or the complexity of your Email Worker. Refer to [Worker limits](https://developers.cloudflare.com/workers/platform/limits/#worker-limits) for more information.

You can use the [log functionality for Workers](https://developers.cloudflare.com/workers/observability/logs/) to look for messages related to CPU limits (such as `EXCEEDED_CPU`) and troubleshoot any issues regarding allocation errors.

If you encounter these error messages frequently, consider upgrading to the [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/) for higher usage limits.

## Message size

Currently, Email Routing does not support messages bigger than 25 MiB.

## Rules and addresses

| Feature | Limit |
| - | - |
| [Rules](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/) | 200 |
| [Addresses](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#destination-addresses) | 200 |

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

## Email Routing summary for emails sent through Workers

Emails sent through Workers will show up in the Email Routing summary page as dropped even if they were successfully delivered.
