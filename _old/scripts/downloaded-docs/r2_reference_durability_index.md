---
title: Durability · Cloudflare R2 docs
description: R2 was designed for data durability and resilience and provides
  99.999999999% (eleven 9s) of annual durability, which describes the likelihood
  of data loss.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/reference/durability/
  md: https://developers.cloudflare.com/r2/reference/durability/index.md
---

R2 was designed for data durability and resilience and provides 99.999999999% (eleven 9s) of annual durability, which describes the likelihood of data loss.

For example, if you store 1,000,000 objects on R2, you can expect to lose an object once every 100,000 years, which is the same level of durability as other major providers.

Warning

Keep in mind that if you accidentally delete an object, you are responsible for implementing your own solution for backups.
