---
title: Token validity periods · Cloudflare for Platforms docs
description: When you perform TXT domain control validation, you will need to
  share these tokens with your customers.
lastUpdated: 2024-09-19T08:55:48.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/token-validity-periods/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/token-validity-periods/index.md
---

When you perform [TXT](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/validate-certificates/txt/) domain control validation, you will need to share these tokens with your customers.

However, these tokens expire after a certain amount of time, depending on your chosen certificate authority.

| Certificate authority | Token validity |
| - | - |
| Let's Encrypt | 7 days |
| Google Trust Services | 14 days |
| SSL.com | 14 days |

Warning

Tokens may also become invalid upon validation failure. For more details, refer to [Domain control validation flow](https://developers.cloudflare.com/ssl/edge-certificates/changing-dcv-method/dcv-flow/#dcv-tokens).
