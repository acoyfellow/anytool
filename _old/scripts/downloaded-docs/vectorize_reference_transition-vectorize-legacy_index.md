---
title: Transition legacy Vectorize indexes · Cloudflare Vectorize docs
description: "Legacy Vectorize (V1) indexes are on a deprecation path as of Aug
  15, 2024. Your Vectorize index may be a legacy index if it fulfills any of the
  follwing crieria:"
lastUpdated: 2024-12-16T22:33:26.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/vectorize/reference/transition-vectorize-legacy/
  md: https://developers.cloudflare.com/vectorize/reference/transition-vectorize-legacy/index.md
---

Legacy Vectorize (V1) indexes are on a deprecation path as of Aug 15, 2024. Your Vectorize index may be a legacy index if it fulfills any of the follwing crieria:

1. Was created with a Wrangler version lower than `v3.71.0`.
2. Was created using the "--deprecated-v1" flag enabled.
3. Was created using the legacy REST API.

This document provides details around any transition steps that may be needed to move away from legacy Vectorize indexes.

## Why should I transition?

Legacy Vectorize (V1) indexes are on a deprecation path. Support for these indexes would be limited and their usage is not recommended for any production workloads.

Furthermore, you will no longer be able to create legacy Vectorize indexes by December 2024. Other operations will be unaffected and will remain functional.

Additionally, the new Vectorize (V2) indexes can operate at a significantly larger scale (with a capacity for multi-million vectors), and provide faster performance. Please review the [Limits](https://developers.cloudflare.com/vectorize/platform/limits/) page to understand the latest capabilities supported by Vectorize.

## Notable changes

In addition to supporting significantly larger indexes with multi-million vectors, and faster performance, these are some of the changes that need to be considered when transitioning away from legacy Vectorize indexes:

1. The new Vectorize (V2) indexes now support asynchronous mutations. Any vector inserts or deletes, and metadata index creation or deletes may take a few seconds to be reflected.

2. Vectorize (V2) support metadata and namespace filtering for much larger indexes with significantly lower latencies. However, the fields on which metadata filtering can be applied need to be specified before vectors are inserted. Refer to the [metadata index creation](https://developers.cloudflare.com/vectorize/reference/client-api/#create-metadata-index) page for more details.

3. Vectorize (V2) [query operation](https://developers.cloudflare.com/vectorize/reference/client-api/#query-vectors) now supports the ability to search for and return up to 100 most similar vectors.

4. Vectorize (V2) query operations provide a more granular control for querying metadata along with vectors. Refer to the [query operation](https://developers.cloudflare.com/vectorize/reference/client-api/#query-vectors) page for more details.

5. Vectorize (V2) expands the Vectorize capabilities that are available via Wrangler (with Wrangler version > `v3.71.0`).

## Transition

Automated Migration

Watch this space for the upcoming capability to migrate legacy (V1) indexes to the new Vectorize (V2) indexes automatically.

1. Wrangler now supports operations on the new version of Vectorize (V2) indexes by default. To use Wrangler commands for legacy (V1) indexes, the `--deprecated-v1` flag must be enabled. Please note that this flag is only supported to create, get, list and delete indexes and to insert vectors.

2. Refer to the [REST API](https://developers.cloudflare.com/api/resources/vectorize/subresources/indexes/methods/create/) page for details on the routes and payload types for the new Vectorize (V2) indexes.

3. To use the new version of Vectorize indexes in Workers, the environment binding must be defined as a `Vectorize` interface.

   ```typescript
   export interface Env {
     // This makes your vector index methods available on env.VECTORIZE.*
     // For example, env.VECTORIZE.insert() or query()
     VECTORIZE: Vectorize;
   }
   ```

   The `Vectorize` interface includes the type changes and the capabilities supported by new Vectorize (V2) indexes.

   For legacy Vectorize (V1) indexes, use the `VectorizeIndex` interface.

   ```typescript
   export interface Env {
     // This makes your vector index methods available on env.VECTORIZE.*
     // For example, env.VECTORIZE.insert() or query()
     VECTORIZE: VectorizeIndex;
   }
   ```

4. With the new Vectorize (V2) version, the `returnMetadata` option for the [query operation](https://developers.cloudflare.com/vectorize/reference/client-api/#query-vectors) now expects either `all`, `indexed` or `none` string values. For legacy Vectorize (V1), the `returnMetadata` option was a boolean field.

5. With the new Vectorize (V2) indexes, all index and vector mutations are asynchronous and return a `mutationId` in the response as a unique identifier for that mutation operation.

   These mutation operations are: [Vector Inserts](https://developers.cloudflare.com/vectorize/reference/client-api/#insert-vectors), [Vector Upserts](https://developers.cloudflare.com/vectorize/reference/client-api/#upsert-vectors), [Vector Deletes](https://developers.cloudflare.com/vectorize/reference/client-api/#delete-vectors-by-id), [Metadata Index Creation](https://developers.cloudflare.com/vectorize/reference/client-api/#create-metadata-index), [Metadata Index Deletion](https://developers.cloudflare.com/vectorize/reference/client-api/#delete-metadata-index).

   To check the identifier and the timestamp of the last mutation processed, use the Vectorize [Info command](https://developers.cloudflare.com/vectorize/reference/client-api/#get-index-info).
