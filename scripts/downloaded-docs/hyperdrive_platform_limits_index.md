---
title: Limits · Cloudflare Hyperdrive docs
description: The following limits apply to Hyperdrive configuration,
  connections, and queries made to your configured origin databases.
lastUpdated: 2025-07-03T20:26:33.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/platform/limits/
  md: https://developers.cloudflare.com/hyperdrive/platform/limits/index.md
---

The following limits apply to Hyperdrive configuration, connections, and queries made to your configured origin databases.

| Feature | Free | Paid |
| - | - | - |
| Maximum configured databases | 10 per account | 25 per account |
| Initial connection timeout | 15 seconds | 15 seconds |
| Idle connection timeout | 10 minutes | 10 minutes |
| Maximum cached query response size | 50 MB | 50 MB |
| Maximum query (statement) duration | 60 seconds | 60 seconds |
| Maximum username length [1](#user-content-fn-1) | 63 characters (bytes) | 63 characters (bytes) |
| Maximum database name length [1](#user-content-fn-1) | 63 characters (bytes) | 63 characters (bytes) |
| Maximum potential origin database connections [2](#user-content-fn-2) | approx. \~20 connections | approx. \~100 connections |

Note

Hyperdrive does not have a hard limit on the number of concurrent *client* connections made from your Workers.

As many hosted databases have limits on the number of unique connections they can manage, Hyperdrive attempts to keep number of concurrent pooled connections to your origin database lower.

Note

You can request adjustments to limits that conflict with your project goals by contacting Cloudflare. Not all limits can be increased. To request an increase, submit a [Limit Increase Request](https://forms.gle/ukpeZVLWLnKeixDu7) and we will contact you with next steps. We also regularly monitor the Hyperdrive channel in [Cloudflare's Discord community](https://discord.cloudflare.com/) and can answer questions regarding limits and requests.

## Footnotes

1. This is a limit enforced by PostgreSQL. Some database providers may enforce smaller limits. [↩](#user-content-fnref-1) [↩2](#user-content-fnref-1-2)

2. Hyperdrive is a distributed system, so it is possible for a client to be unable to reach an existing pool. In this scenario, a new pool will be established, with its own allocation of connections. This favors availability over strictly enforcing limits, but does mean that it is possible in edge cases to overshoot the normal connection limit. [↩](#user-content-fnref-2)
