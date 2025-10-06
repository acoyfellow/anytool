---
title: Shopify · Cloudflare for Platforms docs
description: Learn how to configure your zone with Shopify.
lastUpdated: 2025-09-15T17:01:01.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/shopify/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/shopify/index.md
---

Cloudflare partners with Shopify to provide Shopify customers’ websites with Cloudflare’s performance and security benefits.

If you use Shopify and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then Shopify's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O routing also enables you to take advantage of Cloudflare zones specifically customized for Shopify traffic.

## How it works

For more details about how O2O is different than other Cloudflare setups, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

When you [set up O2O routing for your Shopify website](#enable), Cloudflare enables specific configurations for this SaaS provider. Currently, this includes the following:

* Workers and Snippets are disabled on the `/checkout` URI path.

## Enable

You can enable O2O on any Cloudflare zone plan.

To enable O2O on your account, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a `CNAME` DNS record.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_SHOP_DOMAIN>` | `shops.myshopify.com` | Proxied |

Once you save the new DNS record, the Cloudflare dashboard will show a Shopify icon next to the CNAME record value. For example:

![](https://developers.cloudflare.com/_astro/shopify-dns-entry.BVBaRuE6_Z1HKFdM.webp)

Note

For questions about Shopify setup, refer to their [support guide](https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-domain-manual).

If you cannot activate your domain using [proxied DNS records](https://developers.cloudflare.com/dns/proxy-status/), reach out to your account team or the [Cloudflare Community](https://community.cloudflare.com).

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a Shopify customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult Shopify if there are technical issues that Cloudflare cannot resolve.

### DNS CAA records

For details about CAA records refer to the [Shopify documentation](https://help.shopify.com/manual/domains/add-a-domain/connecting-domains/considerations).
