---
title: Render · Cloudflare for Platforms docs
description: Learn how to configure your Enterprise zone with Render.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/render/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/render/index.md
---

Cloudflare partners with [Render](https://render.com) to provide Render customers’ web services and static sites with Cloudflare’s performance and security benefits.

If you use Render and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then Render's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your Render services.

## How it works

For additional detail about how traffic routes when O2O is enabled, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

Render customers can enable O2O on any Cloudflare zone plan. Cloudflare support for O2O setups is only available for Enterprise customers.

To enable O2O for a specific hostname within a Cloudflare zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied `CNAME` DNS record with your Render site name as the target. Render's domain addition setup will walk you through other validation steps.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `<RENDER_SUBDOMAIN>` (for example, `example.onrender.com`) | Proxied |

Note

For more details about Render setup, refer to their [documentation](https://render.com/docs/configure-cloudflare-dns).

If you cannot activate your domain using [proxied DNS records](https://developers.cloudflare.com/dns/proxy-status/), reach out to your Cloudflare account team or your Render support team.

### Additional requirements for wildcard subdomains

With O2O enabled, adding a wildcard subdomain to a Render service requires that the corresponding root domain is also routed to Render. If the root domain is routed elsewhere, wildcard routing will fail.

If your root domain needs to route somewhere besides Render, add individual subdomains to your Render service instead of a wildcard.

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a Render customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult Render if there are technical issues that Cloudflare cannot resolve.

### Resolving SSL errors

If you encounter SSL errors, check if you have a `CAA` record.

If you have a `CAA` record, verify that it permits SSL certificates to be issued by Google Trust Services (`pki.goog`).

For more details, refer to [CAA records](https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/caa-records/#what-caa-records-are-added-by-cloudflare).
