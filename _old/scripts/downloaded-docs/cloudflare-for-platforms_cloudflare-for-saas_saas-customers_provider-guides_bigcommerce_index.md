---
title: BigCommerce · Cloudflare for Platforms docs
description: Learn how to configure your Enterprise zone with BigCommerce.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/bigcommerce/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/bigcommerce/index.md
---

Cloudflare partners with BigCommerce to provide BigCommerce customers’ websites with Cloudflare’s performance and security benefits.

If you use BigCommerce and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then BigCommerce's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your BigCommerce environment.

## How it works

For more details about how O2O is different than other Cloudflare setups, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

BigCommerce customers can enable O2O on any Cloudflare zone plan.

To enable O2O on your account, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a `CNAME` DNS record.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `shops.mybigcommerce.com` | Proxied |

Note

For more details about a BigCommerce setup, refer to their [support guide](https://support.bigcommerce.com/s/article/Cloudflare-for-Performance-and-Security?language=en_US#orange-to-orange).

If you cannot activate your domain using [proxied DNS records](https://developers.cloudflare.com/dns/proxy-status/), reach out to your account team.

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a BigCommerce customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult BigCommerce if there are technical issues that Cloudflare cannot resolve.
