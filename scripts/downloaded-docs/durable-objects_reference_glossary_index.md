---
title: Glossary · Cloudflare Durable Objects docs
description: Review the definitions for terms used across Cloudflare's Durable
  Objects documentation.
lastUpdated: 2024-10-31T15:59:06.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/reference/glossary/
  md: https://developers.cloudflare.com/durable-objects/reference/glossary/index.md
---

Review the definitions for terms used across Cloudflare's Durable Objects documentation.

| Term | Definition |
| - | - |
| alarm | A Durable Object alarm is a mechanism that allows you to schedule the Durable Object to be woken up at a time in the future. |
| bookmark | A bookmark is a mostly alphanumeric string like `0000007b-0000b26e-00001538-0c3e87bb37b3db5cc52eedb93cd3b96b` which represents a specific state of a SQLite database at a certain point in time. Bookmarks are designed to be lexically comparable: a bookmark representing an earlier point in time compares less than one representing a later point, using regular string comparison. |
| Durable Object | A Durable Object is an individual instance of a Durable Object class. A Durable Object is globally unique (referenced by ID), provides a global point of coordination for all methods/requests sent to it, and has private, persistent storage that is not shared with other Durable Objects within a namespace. |
| Durable Object class | The JavaScript class that defines the methods (RPC) and handlers (`fetch`, `alarm`) as part of your Durable Object, and/or an optional `constructor`. All Durable Objects within a single namespace share the same class definition. |
| Durable Objects | The product name, or the collective noun referring to more than one Durable Object. |
| input gate | While a storage operation is executing, no events shall be delivered to a Durable Object except for storage completion events. Any other events will be deferred until such a time as the object is no longer executing JavaScript code and is no longer waiting for any storage operations. We say that these events are waiting for the "input gate" to open. |
| instance | See "Durable Object". |
| KV API | API methods part of Storage API that support persisting key-value data. |
| migration | A Durable Object migration is a mapping process from a class name to a runtime state. Initiate a Durable Object migration when you need to:- Create a new Durable Object class.
- Rename a Durable Object class.
- Delete a Durable Object class.
- Transfer an existing Durable Objects class. |
| namespace | A logical collection of Durable Objects that all share the same Durable Object (class) definition. A single namespace can have (tens of) millions of Durable Objects. Metrics are scoped per namespace.- The binding name of the namespace (as it will be exposed inside Worker code) is defined in the Wrangler file under the `durable_objects.bindings.name` key. Note that the binding name may not uniquely identify a namespace within an account. Instead, each namespace has a unique namespace ID, which you can view from the Cloudflare dashboard.
- You can instantiate a unique Durable Object within a namespace using [Durable Object namespace methods](https://developers.cloudflare.com/durable-objects/api/namespace/#methods). |
| output gate | When a storage write operation is in progress, any new outgoing network messages will be held back until the write has completed. We say that these messages are waiting for the "output gate" to open. If the write ultimately fails, the outgoing network messages will be discarded and replaced with errors, while the Durable Object will be shut down and restarted from scratch. |
| SQL API | API methods part of Storage API that support SQL querying. |
| Storage API | The transactional and strongly consistent (serializable) [Storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) for persisting data within each Durable Object. State stored within a unique Durable Object is "private" to that Durable Object, and not accessible from other Durable Objects.Storage API includes key-value (KV) API, SQL API, and point-in-time-recovery (PITR) API.- Durable Object classes with the key-value storage backend can use KV API.
- Durable Object classes with the SQLite storage backend can use KV API, SQL API, and PITR API. |
| Storage Backend | By default, a Durable Object class can use Storage API that leverages a key-value storage backend. New Durable Object classes can opt-in to using a [SQLite storage backend](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/#sqlite-storage-backend). |
| stub | An object that refers to a unique Durable Object within a namespace and allows you to call into that Durable Object via RPC methods or the `fetch` API. For example, `let stub = env.MY_DURABLE_OBJECT.get(id)` |
