---
title: Validation status - Custom Hostname Validation · Cloudflare for Platforms docs
description: When you validate a custom hostname, that hostname can be in
  several different statuses.
lastUpdated: 2025-02-19T18:44:35.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/validation-status/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/validation-status/index.md
---

When you [validate a custom hostname](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/), that hostname can be in several different statuses.

| Status | Description |
| - | - |
| Pending | Custom hostname is pending hostname validation. |
| Active | Custom hostname has completed hostname validation and is active. |
| Active re-deploying | Customer hostname is active and the changes have been processed. |
| Blocked | Custom hostname cannot be added to Cloudflare at this time. Custom hostname was likely associated with Cloudflare previously and flagged for abuse. If you are an Enterprise customer, contact your Customer Success Manager. Otherwise, email `abusereply@cloudflare.com` with the name of the web property and a detailed explanation of your association with this web property. |
| Moved | Custom hostname is not active after **Pending** for the entirety of the [Validation Backoff Schedule](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/backoff-schedule/) or it no longer points to the fallback origin. |
| Deleted | Custom hostname was deleted from the zone. Occurs when status is **Moved** for more than seven days. |

## Refresh validation

To run the custom hostname validation check again, select **Refresh** on the dashboard or send a `PATCH` request to the [Edit custom hostname endpoint](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/edit/). If using the API, make sure that the `--data` field contains an `ssl` object with the same `method` and `type` as the original request.

If the hostname is in a **Moved** or **Deleted** state, the refresh will set the custom hostname back to **Pending validation**.
