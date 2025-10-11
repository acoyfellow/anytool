---
title: WP Engine · Cloudflare for Platforms docs
description: Learn how to configure your zone with WP Engine.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/wpengine/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/wpengine/index.md
---

Cloudflare partners with WP Engine to provide WP Engine customers’ websites with Cloudflare’s performance and security benefits.

If you use WP Engine and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then WP Engine's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your WP Engine environment.

## How it works

For more details about how O2O is different than other Cloudflare setups, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

WP Engine customers can enable O2O on any Cloudflare zone plan.

To enable O2O for a specific hostname within a Cloudflare zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied `CNAME` DNS record with a target of one of the following WP Engine CNAMEs. Which WP Engine CNAME is used will depend on your current [WP Engine network type](https://wpengine.com/support/network/).

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `wp.wpewaf.com` (Global Edge Security) or `wp.wpenginepowered.com` (Advanced Network) | Proxied |

Note

For questions about WP Engine setup, refer to their [support guide](https://wpengine.com/support/wordpress-best-practice-configuring-dns-for-wp-engine/#Point_DNS_Using_CNAME_Flattening).

If you cannot activate your domain using [proxied DNS records](https://developers.cloudflare.com/dns/proxy-status/), reach out to your account team.

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Zone hold

If your own Cloudflare zone is on the Enterprise plan, you have access to the [zone hold feature](https://developers.cloudflare.com/fundamentals/account/account-security/zone-holds/), which is a toggle that prevents your domain name from being created as a zone in a different Cloudflare account. Additionally, if the zone hold is enabled, it prevents the activation of custom hostnames onboarded to WP Engine. WP Engine would receive the following error message for your custom hostname: `The hostname is associated with a held zone. Please contact the owner of this domain to have the hold removed.`

To successfully activate the custom hostname on WP Engine, the owner of the zone needs to [temporarily release the hold](https://developers.cloudflare.com/fundamentals/account/account-security/zone-holds/#release-zone-holds). If you are only onboarding a subdomain as a custom hostname to WP Engine, only the subfeature titled `Also prevent Subdomains` needs to be temporarily disabled.

Once the zone hold is temporarily disabled, follow WP Engine's instructions to refresh the custom hostname and it should activate.

## Additional support

If you are a WP Engine customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult WP Engine if there are technical issues that Cloudflare cannot resolve.

### Resolving SSL errors

If you encounter SSL errors, check if you have a `CAA` record.

If you do have a `CAA` record, check that it permits SSL certificates to be issued by `letsencrypt.org`.

For more details, refer to [CAA records](https://developers.cloudflare.com/ssl/edge-certificates/troubleshooting/caa-records/#what-caa-records-are-added-by-cloudflare).
