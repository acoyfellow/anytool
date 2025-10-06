---
title: Salesforce Commerce Cloud · Cloudflare for Platforms docs
description: Learn how to configure your Enterprise zone with Salesforce Commerce Cloud.
lastUpdated: 2025-08-22T14:24:45.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/salesforce-commerce-cloud/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/salesforce-commerce-cloud/index.md
---

Cloudflare partners with Salesforce Commerce Cloud to provide Salesforce Commerce Cloud customers’ websites with Cloudflare’s performance and security benefits.

If you use Salesforce Commerce Cloud and also have a Cloudflare plan, you can use your own Cloudflare zone to proxy web traffic to your zone first, then Salesforce Commerce Cloud's (the SaaS Provider) zone second. This configuration option is called [Orange-to-Orange (O2O)](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Benefits

O2O's benefits include applying your own Cloudflare zone's services and settings — such as [WAF](https://developers.cloudflare.com/waf/), [Bot Management](https://developers.cloudflare.com/bots/plans/bm-subscription/), [Waiting Room](https://developers.cloudflare.com/waiting-room/), and more — on the traffic destined for your Salesforce Commerce Cloud environment.

## How it works

For additional detail about how traffic routes when O2O is enabled, refer to [How O2O works](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/).

## Enable

To enable O2O requires the following:

1. You must configure your SFCC environment as an "SFCC Proxy Zone". If you currently have an "SFCC Legacy Zone", you cannot enable O2O.

   * For more details on the different types of SFCC configurations, refer to the [Salesforce FAQ on SFCC Proxy Zones](https://help.salesforce.com/s/articleView?id=cc.b2c_ecdn_proxy_zone_faq.htm\&type=5).
   * For instructions on how to migrate your SFCC environment to an "SFCC Proxy Zone", refer to the [SFCC Legacy Zone to SFCC Proxy Zone migration guide](https://help.salesforce.com/s/articleView?id=cc.b2c_migrate_legacy_zone_to_proxy_zone.htm\&type=5).

2. Your own Cloudflare zone on an Enterprise plan.

If you meet the above requirements, O2O can then be enabled per hostname. To enable O2O for a specific hostname within your Cloudflare zone, [create](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#create-dns-records) a Proxied CNAME DNS record with a target of the CNAME provided by SFCC Business Manager, which is the dashboard used by SFCC customers to configure their storefront environment.

The CNAME provided by SFCC Business Manager will resemble `commcloud.prod-abcd-example-com.cc-ecdn.net` and contains 3 distinct parts. For each hostname routing traffic to SFCC, be sure to update each part of the example CNAME to match your SFCC environment:

1. **Environment**: `prod` should be changed to `prod` or `dev` or `stg`.
2. **Realm**: `abcd` should be changed to the Realm ID assigned to you by SFCC.
3. **Domain Name**: `example-com` should be changed to match your domain name in a hyphenated format.

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `<YOUR_HOSTNAME>` | `commcloud.prod-abcd-example-com.cc-ecdn.net` | Proxied |

For O2O to be configured properly, make sure your Proxied DNS record targets your SFCC CNAME **directly**. Do not indirectly target the SFCC CNAME by targeting another Proxied DNS record in your Cloudflare zone which targets the SFCC CNAME.

Correct configuration

For example, if the hostnames routing traffic to SFCC are `www.example.com` and `preview.example.com`, the following is a **correct** configuration in your Cloudflare zone:

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `www.example.com` | `commcloud.prod-abcd-example-com.cc-ecdn.net` | Proxied |
| `CNAME` | `preview.example.com` | `commcloud.prod-abcd-example-com.cc-ecdn.net` | Proxied |

Incorrect configuration

And, the following is an **incorrect** configuration because `preview.example.com` indirectly targets the SFCC CNAME via the `www.example.com` Proxied DNS record, which means O2O will not be properly enabled for hostname `preview.example.com`:

| Type | Name | Target | Proxy status |
| - | - | - | - |
| `CNAME` | `www.example.com` | `commcloud.prod-abcd-example-com.cc-ecdn.net` | Proxied |
| `CNAME` | `preview.example.com` | `www.example.com` | Proxied |

## Product compatibility

When a hostname within your Cloudflare zone has O2O enabled, you assume additional responsibility for the traffic on that hostname because you can now configure various Cloudflare products to affect that traffic. Some of the Cloudflare products compatible with O2O are:

* [Caching](https://developers.cloudflare.com/cache/)
* [Workers](https://developers.cloudflare.com/workers/)
* [Rules](https://developers.cloudflare.com/rules/)

For a full list of compatible products and potential limitations, refer to [Product compatibility](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility/).

## Additional support

If you are a Salesforce Commerce Cloud customer and have set up your own Cloudflare zone with O2O enabled on specific hostnames, contact your Cloudflare Account Team or [Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) for help resolving issues in your own zone.

Cloudflare will consult Salesforce Commerce Cloud if there are technical issues that Cloudflare cannot resolve.

### Resolving SSL errors using Cloudflare Managed Certificates

If you encounter SSL errors when attempting to activate a Cloudflare Managed Certificate, verify if you have a `CAA` record on your domain name with command `dig +short example.com CAA`.

If you do have a `CAA` record, verify that it permits SSL certificates to be issued by the [certificate authorities supported by Cloudflare](https://developers.cloudflare.com/ssl/reference/certificate-authorities/).

### Best practice Zone-level configuration

1. Set **Minimum TLS version** to **TLS 1.2**
   1. Navigate to **SSL/TLS > Edge Certificates**, scroll down the page to find **Minimum TLS Version**, and set it to *TLS 1.2*. This setting applies to every Proxied DNS record in your Zone.

2. Match the **Security Level** set in **SFCC Business Manager**

   1. *Option 1: Zone-level* - Navigate to **Security > Settings**, find **Security Level** and set **Security Level** to match what is configured in **SFCC Business Manager**. This setting applies to every Proxied DNS record in your Cloudflare zone.

   2. *Option 2: Per Proxied DNS record* - If the **Security Level** differs between the Proxied DNS records targeting your SFCC environment and other Proxied DNS records in your Cloudflare zone, use a **Configuration Rule** to set the **Security Level** specifically for the Proxied DNS records targeting your SFCC environment. For example:

      1. Create a new **Configuration Rule** by navigating to **Rules** > **Overview** and selecting **Create rule** next to **Configuration Rules**:

         1. **Rule name:** `Match Security Level on SFCC hostnames`
         2. **Field:** *Hostname*
         3. **Operator:** *is in* (this will match against multiple hostnames specified in the **Value** field)
         4. **Value:** `www.example.com` `dev.example.com`
         5. Scroll down to **Security Level** and click **+ Add**
            1. **Select Security Level:** *Medium* (this should match the **Security Level** set in **SFCC Business Manager**)
         6. Scroll to the bottom of the page and click **Deploy**

3. Disable **Browser Integrity Check**

   1. *Option 1: Zone-level* - Navigate to **Security > Settings**, find **Browser Integrity Check** and toggle it off to disable it. This setting applies to every Proxied DNS record in your Cloudflare zone.

   2. *Option 2: Per Proxied DNS record* - If you want to keep **Browser Integrity Check** enabled for other Proxied DNS records in your Cloudflare zone but want to disable it on Proxied DNS records targeting your SFCC environment, keep the Zone-level **Browser Integrity Check** feature enabled and use a **Configuration Rule** to disable **Browser Integrity Check** specifically for the hostnames targeting your SFCC environment. For example:

      1. Create a new **Configuration Rule** by navigating to **Rules** > **Overview** and selecting **Create rule** next to **Configuration Rules**:

         1. **Rule name:** `Disable Browser Integrity Check on SFCC hostnames`
         2. **Field:** *Hostname*
         3. **Operator:** *is in* (this will match against multiple hostnames specified in the **Value** field)
         4. **Value:** `www.example.com` `dev.example.com`
         5. Scroll down to **Browser Integrity Check** and click the **+ Add** button:
            1. Set the toggle to **Off** (a grey X will be displayed)
         6. Scroll to the bottom of the page and click **Deploy**

4. Bypass **Cache** on Proxied DNS records targeting your SFCC environment

   1. Your SFCC environment, also called a **Realm**, will contain one to many SFCC Proxy Zones, which is where caching will always occur. In the corresponding SFCC Proxy Zone for your domain, SFCC performs their own cache optimization, so it is recommended to bypass the cache on the Proxied DNS records in your Cloudflare zone which target your SFCC environment to prevent a "double caching" scenario. This can be accomplished with a **Cache Rule**.

   2. If the **Cache Rule** is not created, caching will occur in both your Cloudflare zone and your corresponding SFCC Proxy Zone, which can cause issues if and when the cache is invalidated or purged in your SFCC environment.
      1. Additional information on caching in your SFCC environment can be found in [SFCC's Content Cache Documentation](https://developer.salesforce.com/docs/commerce/b2c-commerce/guide/b2c-content-cache.html)

   3. Create a new **Cache Rule** by navigating to **Rules** > **Overview** and selecting **Create rule** next to **Cache Rules**:

      1. **Rule name:** `Bypass cache on SFCC hostnames`
      2. **Field:** *Hostname*
      3. **Operator:** *is in* (this will match against multiple hostnames specified in the **Value** field)
      4. **Value:** `www.example.com` `dev.example.com`
      5. **Cache eligibility:** Select **Bypass cache**.
      6. Scroll to the bottom of the page and select **Deploy**.

5. *Optional* - Upload your Custom Certificate from **SFCC Business Manager** to your Cloudflare zone:

   1. The Custom Certificate you uploaded via **SFCC Business Manager** or **SFCC CDN-API**, which exists within your corresponding SFCC Proxy Zone, will terminate TLS connections for your SFCC storefront hostnames. Because of that, it is optional if you want to upload the same Custom Certificate to your own Cloudflare zone. Doing so will allow Cloudflare users with specific roles in your Cloudflare account to receive expiration notifications for your Custom Certificates. Please read [renew custom certificates](https://developers.cloudflare.com/ssl/edge-certificates/custom-certificates/renewing/#renew-custom-certificates) for further details.
   2. Additionally, since you now have your own Cloudflare zone, you have access to Cloudflare's various edge certificate products which means you could have more than one certificate covering the same SANs. In that scenario, a certificate priority process occurs to determine which certificate to serve at the Cloudflare edge. If you find your SFCC storefront hostnames are presenting a different certificate compared to what you uploaded via **SFCC Business Manager** or **SFCC CDN-API**, the certificate priority process is likely the reason. Please read [certificate priority](https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/#certificate-deployment) for further details.
