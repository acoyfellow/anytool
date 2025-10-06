---
title: Create custom hostnames · Cloudflare for Platforms docs
description: Learn how to create custom hostnames.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/create-custom-hostnames/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/create-custom-hostnames/index.md
---

There are several required steps before a custom hostname can become active. For more details, refer to our [Get started guide](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/).

To create a custom hostname:

* Dashboard

  1. In the Cloudflare dashboard, go to the **Account home** page and select your account.

     [Go to **Account home**](https://dash.cloudflare.com/?to=/:account/home)

  2. Select your Cloudflare for SaaS application.

  3. Navigate to **SSL/TLS** > **Custom Hostnames**.

  4. Click **Add Custom Hostname**.

  5. Add your customer's hostname `app.customer.com` and set the relevant options, including:

     * The [minimum TLS version](https://developers.cloudflare.com/ssl/reference/protocols/).
     * Defining whether you want to use a certificate provided by Cloudflare or [upload a custom certificate](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/custom-certificates/uploading-certificates/).
     * Selecting the [certificate authority (CA)](https://developers.cloudflare.com/ssl/reference/certificate-authorities/) that will issue the certificate.
     * Choosing the [validation method](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/validate-certificates/).
     * Whether you want to **Enable wildcard**, which adds a `*.<custom-hostname>` SAN to the custom hostname certificate. For more details, refer to [Hostname priority](https://developers.cloudflare.com/ssl/reference/certificate-and-hostname-priority/#hostname-priority).
     * Choosing a value for [Custom origin server](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/custom-origin/).

  6. Click **Add Custom Hostname**.

  Default behavior

  When you create a custom hostname:

  * If you issue a custom hostname certificate with wildcards enabled, you cannot customize TLS settings for these wildcard hostnames.
  * If you do not specify the **Minimum TLS Version**, it defaults to the zone's Minimum TLS Version. You can still [edit this setting](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/enforce-mtls/#minimum-tls-version) after creation.

* API

  1. To create a custom hostname using the API, use the [Create Custom Hostname](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/create/) endpoint.

     * You can leave the `certificate_authority` parameter empty to set it to "default CA". With this option, Cloudflare checks the CAA records before requesting the certificates, which helps ensure the certificates can be issued from the CA.

  2. For the newly created custom hostname, the `POST` response may not return the DCV validation token `validation_records`. It is recommended to make a second [`GET` command](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/list/) (with a delay) to retrieve these details.

  The response contains the complete definition of the new custom hostname.

  Default behavior

  When you create a custom hostname:

  * If you issue a custom hostname certificate with wildcards enabled, you cannot customize TLS settings for these wildcard hostnames.
  * If you do not specify the **Minimum TLS Version**, it defaults to the zone's Minimum TLS Version. You can still [edit this setting](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/enforce-mtls/#minimum-tls-version) after creation.

For each custom hostname, Cloudflare issues two certificates bundled in chains that maximize browser compatibility (unless you [upload custom certificates](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/custom-certificates/uploading-certificates/)).

The primary certificate uses a `P-256` key, is `SHA-2/ECDSA` signed, and will be presented to browsers that support elliptic curve cryptography (ECC). The secondary or fallback certificate uses an `RSA 2048-bit` key, is `SHA-2/RSA` signed, and will be presented to browsers that do not support ECC.

## Hostnames over 64 characters

The Common Name (CN) restriction establishes a limit of 64 characters ([RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.html)). If you have a hostname that exceeds this length, you can set `cloudflare_branding` to `true` when creating your custom hostnames [via API](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/create/).

```txt
"ssl": {
    "cloudflare_branding": true
  }
```

Cloudflare branding means that `sni.cloudflaressl.com` will be added as the certificate Common Name (CN) and the long hostname will be included as a part of the Subject Alternative Name (SAN).
