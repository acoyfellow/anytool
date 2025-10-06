---
title: mTLS · Cloudflare Workers docs
description: Configure your Worker to present a client certificate to services
  that enforce an mTLS connection.
lastUpdated: 2025-02-11T10:50:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls/
  md: https://developers.cloudflare.com/workers/runtime-apis/bindings/mtls/index.md
---

When using [HTTPS](https://www.cloudflare.com/learning/ssl/what-is-https/), a server presents a certificate for the client to authenticate in order to prove their identity. For even tighter security, some services require that the client also present a certificate.

This process - known as [mTLS](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/) - moves authentication to the protocol of TLS, rather than managing it in application code. Connections from unauthorized clients are rejected during the TLS handshake instead.

To present a client certificate when communicating with a service, create a mTLS certificate [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/) in your Worker project's Wrangler file. This will allow your Worker to present a client certificate to a service on your behalf.

Warning

Currently, mTLS for Workers cannot be used for requests made to a service that is a [proxied zone](https://developers.cloudflare.com/dns/proxy-status/) on Cloudflare. If your Worker presents a client certificate to a service proxied by Cloudflare, Cloudflare will return a `520` error.

First, upload a certificate and its private key to your account using the [`wrangler mtls-certificate`](https://developers.cloudflare.com/workers/wrangler/commands/#mtls-certificate) command:

Warning

The `wrangler mtls-certificate upload` command requires the [SSL and Certificates Edit API token scope](https://developers.cloudflare.com/fundamentals/api/reference/permissions/). If you are using the OAuth flow triggered by `wrangler login`, the correct scope is set automatically. If you are using API tokens, refer to [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) to set the right scope for your API token.

```sh
npx wrangler mtls-certificate upload --cert cert.pem --key key.pem --name my-client-cert
```

Then, update your Worker project's Wrangler file to create an mTLS certificate binding:

* wrangler.jsonc

  ```jsonc
  {
    "mtls_certificates": [
      {
        "binding": "MY_CERT",
        "certificate_id": "<CERTIFICATE_ID>"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  mtls_certificates = [
    { binding = "MY_CERT", certificate_id = "<CERTIFICATE_ID>" }
  ]
  ```

Note

Certificate IDs are displayed after uploading, and can also be viewed with the command `wrangler mtls-certificate list`.

Adding an mTLS certificate binding includes a variable in the Worker's environment on which the `fetch()` method is available. This `fetch()` method uses the standard [Fetch](https://developers.cloudflare.com/workers/runtime-apis/fetch/) API and has the exact same signature as the global `fetch`, but always presents the client certificate when establishing the TLS connection.

Note

mTLS certificate bindings present an API similar to [service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings).

### Interface

* JavaScript

  ```js
  export default {
    async fetch(request, environment) {
      return await environment.MY_CERT.fetch("https://a-secured-origin.com");
    },
  };
  ```

* TypeScript

  ```js
  interface Env {
    MY_CERT: Fetcher;
  }


  export default {
      async fetch(request, environment): Promise<Response> {
          return await environment.MY_CERT.fetch("https://a-secured-origin.com")
      }
  } satisfies ExportedHandler<Env>;
  ```
