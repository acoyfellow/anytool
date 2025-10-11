---
title: Error codes - Custom Hostname Validation · Cloudflare for Platforms docs
description: When you validate a custom hostname, you might encounter the
  following error codes.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/error-codes/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/error-codes/index.md
---

When you [validate a custom hostname](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/), you might encounter the following error codes.

| Error | Cause |
| - | - |
| Zone does not have a fallback origin set. | Fallback is not active. |
| Fallback origin is in a status of `initializing`, `pending_deployment`, `pending_deletion`, or `deleted`. | Fallback is not active. |
| Custom hostname does not `CNAME` to this zone. | Zone does not have [apex proxying entitlement](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/apex-proxying/) and custom hostname does not CNAME to zone. |
| None of the `A` or `AAAA` records are owned by this account and the pre-generated ownership validation token was not found. | Account has [apex proxying enabled](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/apex-proxying/) but the custom hostname failed the hostname validation check on the `A` record. |
| This account and the pre-generated ownership validation token was not found. | Hostname does not `CNAME` to zone or none of the `A`/`AAAA` records match reserved IPs for zone. |
