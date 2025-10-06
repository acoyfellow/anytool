---
title: List vectors · Cloudflare Vectorize docs
description: The list-vectors operation allows you to enumerate all vector
  identifiers in a Vectorize index using paginated requests. This guide covers
  best practices for efficiently using this operation.
lastUpdated: 2025-08-26T18:15:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/vectorize/best-practices/list-vectors/
  md: https://developers.cloudflare.com/vectorize/best-practices/list-vectors/index.md
---

The list-vectors operation allows you to enumerate all vector identifiers in a Vectorize index using paginated requests. This guide covers best practices for efficiently using this operation.

## When to use list-vectors

Use list-vectors for:

* **Bulk operations**: To process all vectors in an index
* **Auditing**: To verify the contents of your index or generate reports
* **Data migration**: To move vectors between indexes or systems
* **Cleanup operations**: To identify and remove outdated vectors

## Pagination behavior

The list-vectors operation uses cursor-based pagination with important consistency guarantees:

### Snapshot consistency

Vector identifiers returned belong to the index snapshot captured at the time of the first list-vectors request. This ensures consistent pagination even when the index is being modified during iteration:

* **New vectors**: Vectors inserted after the initial request will not appear in subsequent paginated results
* **Deleted vectors**: Vectors deleted after the initial request will continue to appear in the remaining responses until pagination is complete

### Starting a new iteration

To see recently added or removed vectors, you must start a new list-vectors request sequence (without a cursor). This captures a fresh snapshot of the index.

### Response structure

Each response includes:

* `count`: Number of vectors returned in this response
* `totalCount`: Total number of vectors in the index
* `isTruncated`: Whether there are more vectors available
* `nextCursor`: Cursor for the next page (null if no more results)
* `cursorExpirationTimestamp`: Timestamp of when the cursor expires
* `vectors`: Array of vector identifiers

### Cursor expiration

Cursors have an expiration timestamp. If a cursor expires, you'll need to start a new list-vectors request sequence to continue pagination.

## Performance considerations

Take care to have sufficient gap between consecutive requests to avoid hitting rate-limits.

## Example workflow

Here's a typical pattern for processing all vectors in an index:

```sh
# Start iteration
wrangler vectorize list-vectors my-index --count=1000


# Continue with cursor from response
wrangler vectorize list-vectors my-index --count=1000 --cursor="<cursor-from-response>"


# Repeat until no more results
```
