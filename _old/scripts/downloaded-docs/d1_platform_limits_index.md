---
title: Limits · Cloudflare D1 docs
description: Cloudflare also offers other storage solutions such as Workers KV,
  Durable Objects, and R2. Each product has different advantages and limits.
  Refer to Choose a data or storage product to review which storage option is
  right for your use case.
lastUpdated: 2025-08-05T10:57:02.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/platform/limits/
  md: https://developers.cloudflare.com/d1/platform/limits/index.md
---

| Feature | Limit |
| - | - |
| Databases | 50,000 (Workers Paid)[1](#user-content-fn-1) / 10 (Free) |
| Maximum database size | 10 GB (Workers Paid) / 500 MB (Free) |
| Maximum storage per account | 1 TB (Workers Paid)[2](#user-content-fn-2) / 5 GB (Free) |
| [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) duration (point-in-time recovery) | 30 days (Workers Paid) / 7 days (Free) |
| Maximum Time Travel restore operations | 10 restores per 10 minute (per database) |
| Queries per Worker invocation (read [subrequest limits](https://developers.cloudflare.com/workers/platform/limits/#how-many-subrequests-can-i-make)) | 1000 (Workers Paid) / 50 (Free) |
| Maximum number of columns per table | 100 |
| Maximum number of rows per table | Unlimited (excluding per-database storage limits) |
| Maximum string, `BLOB` or table row size | 2,000,000 bytes (2 MB) |
| Maximum SQL statement length | 100,000 bytes (100 KB) |
| Maximum bound parameters per query | 100 |
| Maximum arguments per SQL function | 32 |
| Maximum characters (bytes) in a `LIKE` or `GLOB` pattern | 50 bytes |
| Maximum bindings per Workers script | Approximately 5,000 [3](#user-content-fn-3) |
| Maximum SQL query duration | 30 seconds [4](#user-content-fn-4) |
| Maximum file import (`d1 execute`) size | 5 GB [5](#user-content-fn-5) |

Batch limits

Limits for individual queries (listed above) apply to each individual statement contained within a batch statement. For example, the maximum SQL statement length of 100 KB applies to each statement inside a `db.batch()`.

Footnotes

1: The maximum number of databases per account can be increased by request on Workers Paid and Enterprise plans, with support for millions to tens-of-millions of databases (or more) per account. Refer to the guidance on limit increases on this page to request an increase.

2: The maximum storage per account can be increased by request on Workers Paid and Enterprise plans. Refer to the guidance on limit increases on this page to request an increase.

3: A single Worker script can have up to 1 MB of script metadata. A binding is defined as a binding to a resource, such as a D1 database, KV namespace, [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/), or secret. Each resource binding is approximately 150 bytes, however environmental variables and secrets are controlled by the size of the value you provide. Excluding environmental variables, you can bind up to \~5,000 D1 databases to a single Worker script.

4: Requests to Cloudflare API must resolve in 30 seconds. Therefore, this duration limit also applies to the entire batch call.

5: The imported file is uploaded to R2. Refer to [R2 upload limit](https://developers.cloudflare.com/r2/platform/limits).

Cloudflare also offers other storage solutions such as [Workers KV](https://developers.cloudflare.com/kv/api/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), and [R2](https://developers.cloudflare.com/r2/get-started/). Each product has different advantages and limits. Refer to [Choose a data or storage product](https://developers.cloudflare.com/workers/platform/storage-options/) to review which storage option is right for your use case.

Need a higher limit?

To request an adjustment to a limit, complete the [Limit Increase Request Form](https://forms.gle/ukpeZVLWLnKeixDu7). If the limit can be increased, Cloudflare will contact you with next steps.

## Frequently Asked Questions

Frequently asked questions related to D1 limits:

### How much work can a D1 database do?

D1 is designed for horizontal scale out across multiple, smaller (10 GB) databases, such as per-user, per-tenant or per-entity databases. D1 allows you to build applications with thousands of databases at no extra cost for isolating with multiple databases, as the pricing is based only on query and storage costs.

* Each D1 database can store up to 10 GB of data, and you can create up to thousands of separate D1 databases. This allows you to split a single monolithic database into multiple, smaller databases, thereby isolating application data by user, customer, or tenant.
* SQL queries over a smaller working data set can be more efficient and performant while improving data isolation.

Warning

Note that the 10 GB limit of a D1 database cannot be further increased.

### How many simultaneous connections can a Worker open to D1?

You can open up to six connections (to D1) simultaneously for each invocation of your Worker.

For more information on a Worker's simultaneous connections, refer to [Simultaneous open connections](https://developers.cloudflare.com/workers/platform/limits/#simultaneous-open-connections).

## Footnotes

1. The maximum number of databases per account can be increased by request on Workers Paid and Enterprise plans, with support for millions to tens-of-millions of databases (or more) per account. Refer to the guidance on limit increases on this page to request an increase. [↩](#user-content-fnref-1)

2. The maximum storage per account can be increased by request on Workers Paid and Enterprise plans. Refer to the guidance on limit increases on this page to request an increase. [↩](#user-content-fnref-2)

3. A single Worker script can have up to 1 MB of script metadata. A binding is defined as a binding to a resource, such as a D1 database, KV namespace, [environmental variable](https://developers.cloudflare.com/workers/configuration/environment-variables/), or secret. Each resource binding is approximately 150-bytes, however environmental variables and secrets are controlled by the size of the value you provide. Excluding environmental variables, you can bind up to \~5,000 D1 databases to a single Worker script. [↩](#user-content-fnref-3)

4. Requests to Cloudflare API must resolve in 30 seconds. Therefore, this duration limit also applies to the entire batch call. [↩](#user-content-fnref-4)

5. The imported file is uploaded to R2. Refer to [R2 upload limit](https://developers.cloudflare.com/r2/platform/limits). [↩](#user-content-fnref-5)
