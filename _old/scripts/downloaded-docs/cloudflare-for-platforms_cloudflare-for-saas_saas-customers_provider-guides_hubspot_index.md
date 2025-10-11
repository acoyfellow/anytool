---
title: HubSpot · Cloudflare for Platforms docs
description: Learn how to configure your zone with HubSpot.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/hubspot/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/hubspot/index.md
---

Cloudflare partners with HubSpot to provide HubSpot customers’ websites with Cloudflare’s performance and security benefits.

If you use HubSpot and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then HubSpot's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your HubSpot environment.

## How it works

For more details about how O2O is different than other Cloudflare setups, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

O2O is enabled per hostname, so to enable O2O for a specific hostname within your Cloudflare zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied `CNAME` DNS record with a target of your corresponding HubSpot CNAME. Which HubSpot CNAME is targeted will depend on your current [HubSpot proxy settings](https://developers.hubspot.com/docs/cms/developer-reference/reverse-proxy-support#configure-the-proxy).

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `<HUBID>.sites-proxy.hscoscdn<##>.net` | Proxied |

Note

For questions about your HubSpot setup, refer to [HubSpot's reverse proxy support guide](https://developers.hubspot.com/docs/cms/developer-reference/reverse-proxy-support).

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Zone hold

Because you have your own Cloudflare zone, you have access to the zone hold feature, which is a toggle that prevents your domain name from being created as a zone in a different Cloudflare account. Additionally, if the zone hold feature is enabled, it prevents the activation of custom hostnames onboarded to HubSpot. HubSpot would receive the following error message for your custom hostname: `The hostname is associated with a held zone. Please contact the owner of this domain to have the hold removed.`

To successfully activate the custom hostname on HubSpot, the owner of the zone needs to [temporarily release the hold](https://developers.cloudflare.com/fundamentals/account/account-security/zone-holds/#release-zone-holds). If you are only onboarding a subdomain as a custom hostname to HubSpot, only the subfeature titled `Also prevent Subdomains` needs to be temporarily disabled.

Once the zone hold is temporarily disabled, follow HubSpot's instructions to refresh the custom hostname and it should activate.

## Additional support

If you are a HubSpot customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult HubSpot if there are technical issues that Cloudflare cannot resolve.
