---
title: Product compatibility · Cloudflare for Platforms docs
description: As a general rule, settings on the customer zone will override
  settings on the SaaS zone. In addition, Orange-to-Orange does not permit
  traffic directed to a custom hostname zone into another custom hostname zone.
lastUpdated: 2025-09-15T16:47:39.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/index.md
---

As a general rule, settings on the customer zone will override settings on the SaaS zone. In addition, [Orange-to-Orange](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/) does not permit traffic directed to a custom hostname zone into another custom hostname zone.

The following table provides a list of compatibility guidelines for various Cloudflare products and features.

Note

This is not an exhaustive list of Cloudflare products and features.

| Product | Customer zone | SaaS provider zone | Notes |
| - | - | - | - |
| [Access](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/secure-with-access/) | Yes | Yes | |
| [API Shield](https://developers.cloudflare.com/api-shield/) | Yes | No | |
| [Argo Smart Routing](https://developers.cloudflare.com/argo-smart-routing/) | No | Yes | Customer zones can still use Smart Routing for non-O2O traffic. |
| [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/) | Yes | Yes | |
| [Browser Integrity Check](https://developers.cloudflare.com/waf/tools/browser-integrity-check/) | Yes | Yes | |
| [Cache](https://developers.cloudflare.com/cache/) | Yes\* | Yes | Though caching is possible on a customer zone, it is generally discouraged (especially for HTML). Your SaaS provider likely performs its own caching outside of Cloudflare and caching on your zone might lead to out-of-sync or stale cache states. Customer zones can still cache content that are not routed through a SaaS provider's zone. |
| [China Network](https://developers.cloudflare.com/china-network/) | No | No | |
| [DNS](https://developers.cloudflare.com/dns/) | Yes\* | Yes | As a SaaS customer, do not remove the records related to your Cloudflare for SaaS setup. Otherwise, your traffic will begin routing away from your SaaS provider. |
| [HTTP/2 prioritization](https://blog.cloudflare.com/better-http-2-prioritization-for-a-faster-web/) | Yes | Yes\* | This feature must be enabled on the customer zone to function. |
| [Image resizing](https://developers.cloudflare.com/images/transform-images/) | Yes | Yes | |
| IPv6 | Yes | Yes | |
| [IPv6 Compatibility](https://developers.cloudflare.com/network/ipv6-compatibility/) | Yes | Yes\* | If the customer zone has **IPv6 Compatibility** enabled, generally the SaaS zone should as well. If not, make sure the SaaS zone enables [Pseudo IPv4](https://developers.cloudflare.com/network/pseudo-ipv4/). |
| [Load Balancing](https://developers.cloudflare.com/load-balancing/) | No | Yes | Customer zones can still use Load Balancing for non-O2O traffic. |
| [Page Rules](https://developers.cloudflare.com/rules/page-rules/) | Yes\* | Yes | Page Rules that match the subdomain used for O2O may block or interfere with the flow of visitors to your website. |
| [Mirage](https://developers.cloudflare.com/speed/optimization/images/mirage/) (deprecated) | Yes | Yes | |
| [Origin Rules](https://developers.cloudflare.com/rules/origin-rules/) | Yes | Yes | Enterprise zones can configure Origin Rules, by setting the Host Header and DNS Overrides to direct traffic to a SaaS zone. |
| [Page Shield](https://developers.cloudflare.com/page-shield/) | Yes | Yes | |
| [Polish](https://developers.cloudflare.com/images/polish/) | Yes\* | Yes | Polish only runs on cached assets. If the customer zone is bypassing cache for SaaS zone destined traffic, then images optimized by Polish will not be loaded from origin. |
| [Rate Limiting](https://developers.cloudflare.com/waf/rate-limiting-rules/) | Yes\* | Yes | Rate Limiting rules that match the subdomain used for O2O may block or interfere with the flow of visitors to your website. |
| [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/) | No | No | |
| [Security Level](https://developers.cloudflare.com/waf/tools/security-level/) | Yes | Yes | |
| [Spectrum](https://developers.cloudflare.com/spectrum/) | No | No | |
| [Transform Rules](https://developers.cloudflare.com/rules/transform/) | Yes\* | Yes | Transform Rules that match the subdomain used for O2O may block or interfere with the flow of visitors to your website. |
| [WAF custom rules](https://developers.cloudflare.com/waf/custom-rules/) | Yes | Yes | WAF custom rules that match the subdomain used for O2O may block or interfere with the flow of visitors to your website. |
| [WAF managed rules](https://developers.cloudflare.com/waf/managed-rules/) | Yes | Yes | |
| [Waiting Room](https://developers.cloudflare.com/waiting-room/) | Yes | Yes | |
| [WebSockets](https://developers.cloudflare.com/network/websockets/) | No | No | |
| [Workers](https://developers.cloudflare.com/workers/) | Yes\* | Yes | Similar to Page Rules, Workers that match the subdomain used for O2O may block or interfere with the flow of visitors to your website. |
| [Zaraz](https://developers.cloudflare.com/zaraz/) | Yes | No | |
