---
title: Kinsta · Cloudflare for Platforms docs
description: Learn how to configure your Enterprise zone with Kinsta.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/kinsta/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/kinsta/index.md
---

Cloudflare partners with Kinsta to provide Kinsta customers’ websites with Cloudflare’s performance and security benefits.

If you use Kinsta and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then Kinsta's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your Kinsta environment.

## How it works

For additional detail about how traffic routes when O2O is enabled, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

Kinsta customers can enable O2O on any Cloudflare zone plan.

To enable O2O for a specific hostname within a Cloudflare zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied `CNAME` DNS record with your Kinsta site name as the target. Kinsta’s domain addition setup will walk you through other validation steps.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `sitename.hosting.kinsta.cloud` | Proxied |

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a Kinsta customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult Kinsta if there are technical issues that Cloudflare cannot resolve.

### Resolving SSL errors using Cloudflare Managed Certificates

If you encounter SSL errors when attempting to activate a Cloudflare Managed Certificate, verify if you have a `CAA` record on your domain name with command `dig +short example.com CAA`.

If you do have a `CAA` record, verify that it permits SSL certificates to be issued by the [certificate authorities supported by Cloudflare](https://developers.cloudflare.com/ssl/reference/certificate-authorities/).
