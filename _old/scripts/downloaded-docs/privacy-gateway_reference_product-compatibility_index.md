---
title: Product compatibility · Cloudflare Privacy Gateway docs
description: When using Privacy Gateway, the majority of Cloudflare products
  will be compatible with your application.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/privacy-gateway/reference/product-compatibility/
  md: https://developers.cloudflare.com/privacy-gateway/reference/product-compatibility/index.md
---

When [using Privacy Gateway](https://developers.cloudflare.com/privacy-gateway/get-started/), the majority of Cloudflare products will be compatible with your application.

However, the following products are not compatible:

* [API Shield](https://developers.cloudflare.com/api-shield/): [Schema Validation](https://developers.cloudflare.com/api-shield/security/schema-validation/) and [API discovery](https://developers.cloudflare.com/api-shield/security/api-discovery/) are not possible since Cloudflare cannot see the request URLs.
* [Cache](https://developers.cloudflare.com/cache/): Caching of application content is no longer possible since each between client and gateway is end-to-end encrypted.
* [WAF](https://developers.cloudflare.com/waf/): Rules implemented based on request content are not supported since Cloudflare cannot see the request or response content.
