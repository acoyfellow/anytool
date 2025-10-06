---
title: Pricing · Cloudflare Hyperdrive docs
description: Hyperdrive is included in both the Free and Paid Workers plans.
lastUpdated: 2025-04-08T01:15:22.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/platform/pricing/
  md: https://developers.cloudflare.com/hyperdrive/platform/pricing/index.md
---

Hyperdrive is included in both the Free and Paid [Workers plans](https://developers.cloudflare.com/workers/platform/pricing/).

| | Free plan[1](#user-content-fn-1) | Paid plan |
| - | - | - |
| Database queries[2](#user-content-fn-2) | 100,000 / day | Unlimited |

Footnotes

1: The Workers Free plan includes limited Hyperdrive usage. All limits reset daily at 00:00 UTC. If you exceed any one of these limits, further operations of that type will fail with an error.

2: Database queries refers to any database statement made via Hyperdrive, whether a query (`SELECT`), a modification (`INSERT`,`UPDATE`, or `DELETE`) or a schema change (`CREATE`, `ALTER`, `DROP`).

## Footnotes

1. The Workers Free plan includes limited Hyperdrive usage. All limits reset daily at 00:00 UTC. If you exceed any one of these limits, further operations of that type will fail with an error. [↩](#user-content-fnref-1)

2. Database queries refers to any database statement made via Hyperdrive, whether a query (`SELECT`), a modification (`INSERT`,`UPDATE`, or `DELETE`) or a schema change (`CREATE`, `ALTER`, `DROP`). [↩](#user-content-fnref-2)

Hyperdrive limits are automatically adjusted when subscribed to a Workers Paid plan. Hyperdrive's [connection pooling and query caching](https://developers.cloudflare.com/hyperdrive/configuration/how-hyperdrive-works/) are included in Workers Paid plan, so do not incur any additional charges.

## Pricing FAQ

### Does connection pooling or query caching incur additional charges?

No. Hyperdrive's built-in cache and connection pooling are included within the stated plans above. There are no hidden limits other than those [published](https://developers.cloudflare.com/hyperdrive/platform/limits/).

### Are cached queries counted the same as uncached queries?

Yes, any query made through Hyperdrive, whether cached or uncached, whether query or mutation, is counted according to the limits above.

### Does Hyperdrive charge for data transfer / egress?

No.

Note

For questions about pricing, refer to the [pricing FAQs](https://developers.cloudflare.com/hyperdrive/reference/faq/#pricing).
