---
title: Remove custom hostnames · Cloudflare for Platforms docs
description: Learn how to remove custom hostnames for inactive customers.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/remove-custom-hostnames/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/remove-custom-hostnames/index.md
---

As a SaaS provider, your customers may decide to no longer participate in your service offering. If that happens, you need to stop routing traffic through those custom hostnames.

## Domains using Cloudflare

If your customer's domain is also using Cloudflare, they can stop routing their traffic through your custom hostname by updating their Cloudflare DNS.

If they update their [`CNAME` record](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#3-have-customer-create-cname-record) so that it no longer points to your `CNAME` target:

* The domain's traffic will not route through your custom hostname.
* The custom hostname will enter into a **Moved** state.

If the custom hostname is in a **Moved** state for seven days, it will transition into a **Deleted** state.

## Domains not using Cloudflare

If your customer's domain is not using Cloudflare, you must remove a customer's custom hostname from your zone if they decide to churn.

This is especially important if your end customers are using Cloudflare because if the custom hostname changes the DNS target to point away from your SaaS zone, the custom hostname will continue to route to your service. This is a result of the [custom hostname priority logic](https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/#hostname-priority).

* Dashboard

  1. In the Cloudflare dashboard, go to the **Account home** page and select your account and website.

     [Go to **Account home**](https://dash.cloudflare.com/?to=/:account/home)

  2. Select **SSL/TLS** > **Custom Hostnames**.

  3. Select the custom hostname and select **Delete**.

  4. A confirmation window will appear. Acknowledge the warning and select **Delete** again.

* API

  To delete a custom hostname and any issued certificates using the API, send a [`DELETE` request](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/delete/).

## For end customers

If your SaaS domain is also a [domain using Cloudflare](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/), you can use your Cloudflare DNS to remove your domain from your SaaS provider.

This means that - if you [remove the DNS records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/#delete-dns-records) pointing to your SaaS provider - Cloudflare will stop routing domain traffic through your SaaS provider and the associated custom hostname will enter a **Moved** state.

This also means that you need to keep DNS records pointing to your SaaS provider for as long as you are a customer. Otherwise, you could accidentally remove your domain from their services.
