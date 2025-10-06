---
title: FAQ · Cloudflare Workers KV docs
description: Frequently asked questions regarding Workers KV.
lastUpdated: 2025-09-30T15:23:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/kv/reference/faq/
  md: https://developers.cloudflare.com/kv/reference/faq/index.md
---

Frequently asked questions regarding Workers KV.

## General

### Can I use Workers KV without using Workers?

Yes, you can use Workers KV outside of Workers by using the [REST API](https://developers.cloudflare.com/api/resources/kv/) or the associated Cloudflare SDKs for the REST API. It is important to note the [limits of the REST API](https://developers.cloudflare.com/fundamentals/api/reference/limits/) that apply.

### What are the key considerations when choosing how to access KV?

When choosing how to access Workers KV, consider the following:

* **Performance**: Accessing Workers KV via the [Workers Binding API](https://developers.cloudflare.com/kv/api/write-key-value-pairs/) is generally faster than using the [REST API](https://developers.cloudflare.com/api/resources/kv/), as it avoids the overhead of HTTP requests.
* **Rate Limits**: Be aware of the different rate limits for each access method. [REST API](https://developers.cloudflare.com/api/resources/kv/) has a lower write rate limit compared to Workers Binding API. Refer to [What is the rate limit of Workers KV?](https://developers.cloudflare.com/kv/reference/faq/#what-is-the-rate-limit-of-workers-kv)

### Why can I not immediately see the updated value of a key-value pair?

Workers KV heavily caches data across the Cloudflare network. Therefore, it is possible that you read a cached value for up to the [cache TTL](https://developers.cloudflare.com/kv/api/read-key-value-pairs/#cachettl-parameter) duration.

### Is Workers KV eventually consistent or strongly consistent?

Workers KV is eventually consistent.

Workers KV stores data in central stores and replicates the data to all Cloudflare locations through a hybrid push/pull replication approach. This means that the previous value of the key-value pair may be seen in a location for as long as the [cache TTL](https://developers.cloudflare.com/kv/api/read-key-value-pairs/#cachettl-parameter). This means that Workers KV is eventually consistent.

Refer to [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/).

### If a Worker makes a bulk request to Workers KV, would each individual key get counted against the [Worker subrequest limit (of 1000)](https://developers.cloudflare.com/kv/platform/limits/)?

No. A bulk request to Workers KV, regardless of the amount of keys included in the request, will count as a single operation. For example, you could make 500 bulk KV requests and 500 R2 requests for a total of 1000 operations.

### What is the rate limit of Workers KV?

Workers KV's rate limit differs depending on the way you access it.

Operations to Workers KV via the [REST API](https://developers.cloudflare.com/api/resources/kv/) are bound by the same [limits of the REST API](https://developers.cloudflare.com/fundamentals/api/reference/limits/). This limit is shared across all Cloudflare REST API requests.

When writing to Workers KV via the [Workers Binding API](https://developers.cloudflare.com/kv/api/write-key-value-pairs/), the write rate limit is 1 write per second, per key, unlimited across KV keys.

## Pricing

### When writing via Workers KV's [REST API](https://developers.cloudflare.com/api/resources/kv/subresources/namespaces/subresources/keys/methods/bulk_update/), how are writes charged?

Each key-value pair in the `PUT` request is counted as a single write, identical to how each call to `PUT` in the Workers API counts as a write. Writing 5,000 keys via the REST API incurs the same write costs as making 5,000 `PUT` calls in a Worker.

### Do queries I issue from the dashboard or wrangler (the CLI) count as billable usage?

Yes, any operations via the Cloudflare dashboard or wrangler, including updating (writing) keys, deleting keys, and listing the keys in a namespace count as billable Workers KV usage.

### Does Workers KV charge for data transfer / egress?

No.

### Are key expirations billed as delete operations?

No. Key expirations are not billable operations.
