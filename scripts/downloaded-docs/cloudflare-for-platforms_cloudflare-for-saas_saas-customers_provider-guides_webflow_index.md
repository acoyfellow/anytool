---
title: Webflow · Cloudflare for Platforms docs
description: Learn how to configure your Enterprise zone with Webflow.
lastUpdated: 2025-08-26T16:56:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/webflow/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/webflow/index.md
---

Cloudflare partners with Webflow to provide Webflow customers’ websites with Cloudflare’s performance and security benefits.

If you use Webflow and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then Webflow's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as WAF, Bot Management, Waiting Room, and more — on the traffic destined for your Webflow environment.

## How it works

For more details about how O2O is different than other Cloudflare setups, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

Webflow customers can enable O2O on any Cloudflare zone plan.

To enable O2O for a specific hostname within a Cloudflare Zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied `CNAME` DNS record with your Webflow site name as the target Webflow's domain addition setup will walk you through other validation steps.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_DOMAIN>` | `cdn.webflow.com` | Proxied |

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a Webflow customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult Webflow if there are technical issues that Cloudflare cannot resolve.

### DNS CAA records

Webflow issues SSL/TLS certificates for merchant domains using Let’s Encrypt and Google Trust Services. If you add any DNS CAA records, you must select **Let’s Encrypt** or **Google Trust Services** as the Certificate Authority (CA) or HTTPS connections may fail.

For more details, refer to [CAA records](https://developers.cloudflare.com/ssl/edge-certificates/caa-records/#caa-records-added-by-cloudflare).
