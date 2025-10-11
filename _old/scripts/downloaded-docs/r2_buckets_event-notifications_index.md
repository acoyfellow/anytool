---
title: Event notifications · Cloudflare R2 docs
description: Event notifications send messages to your queue when data in your
  R2 bucket changes. You can consume these messages with a consumer Worker or
  pull over HTTP from outside of Cloudflare Workers.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/buckets/event-notifications/
  md: https://developers.cloudflare.com/r2/buckets/event-notifications/index.md
---

Event notifications send messages to your [queue](https://developers.cloudflare.com/queues/) when data in your R2 bucket changes. You can consume these messages with a [consumer Worker](https://developers.cloudflare.com/queues/reference/how-queues-works/#create-a-consumer-worker) or [pull over HTTP](https://developers.cloudflare.com/queues/configuration/pull-consumers/) from outside of Cloudflare Workers.

## Get started with event notifications

### Prerequisites

Before getting started, you will need:

* An existing R2 bucket. If you do not already have an existing R2 bucket, refer to [Create buckets](https://developers.cloudflare.com/r2/buckets/create-buckets/).
* An existing queue. If you do not already have a queue, refer to [Create a queue](https://developers.cloudflare.com/queues/get-started/#2-create-a-queue).
* A [consumer Worker](https://developers.cloudflare.com/queues/reference/how-queues-works/#create-a-consumer-worker) or [HTTP pull](https://developers.cloudflare.com/queues/configuration/pull-consumers/) enabled on your Queue.

### Enable event notifications via Dashboard

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Select the bucket you'd like to add an event notification rule to.

3. Switch to the **Settings** tab, then scroll down to the **Event notifications** card.

4. Select **Add notification** and choose the queue you'd like to receive notifications and the [type of events](https://developers.cloudflare.com/r2/buckets/event-notifications/#event-types) that will trigger them.

5. Select **Add notification**.

### Enable event notifications via Wrangler

#### Set up Wrangler

To begin, install [`npm`](https://docs.npmjs.com/getting-started). Then [install Wrangler, the Developer Platform CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

#### Enable event notifications on your R2 bucket

Log in to Wrangler with the [`wrangler login` command](https://developers.cloudflare.com/workers/wrangler/commands/#login). Then add an [event notification rule](https://developers.cloudflare.com/r2/buckets/event-notifications/#event-notification-rules) to your bucket by running the [`r2 bucket notification create` command](https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-notification-create).

```sh
npx wrangler r2 bucket notification create <BUCKET_NAME> --event-type <EVENT_TYPE> --queue <QUEUE_NAME>
```

To add filtering based on `prefix` or `suffix` use the `--prefix` or `--suffix` flag, respectively.

```sh
# Filter using prefix
$ npx wrangler r2 bucket notification create <BUCKET_NAME> --event-type <EVENT_TYPE> --queue <QUEUE_NAME> --prefix "<PREFIX_VALUE>"


# Filter using suffix
$ npx wrangler r2 bucket notification create <BUCKET_NAME> --event-type <EVENT_TYPE> --queue <QUEUE_NAME> --suffix "<SUFFIX_VALUE>"


# Filter using prefix and suffix. Both the conditions will be used for filtering
$ npx wrangler r2 bucket notification create <BUCKET_NAME> --event-type <EVENT_TYPE> --queue <QUEUE_NAME> --prefix "<PREFIX_VALUE>" --suffix "<SUFFIX_VALUE>"
```

For a more complete step-by-step example, refer to the [Log and store upload events in R2 with event notifications](https://developers.cloudflare.com/r2/tutorials/upload-logs-event-notifications/) example.

## Event notification rules

Event notification rules determine the [event types](https://developers.cloudflare.com/r2/buckets/event-notifications/#event-types) that trigger notifications and optionally enable filtering based on object `prefix` and `suffix`. You can have up to 100 event notification rules per R2 bucket.

## Event types

| Event type | Description | Trigger actions |
| - | - | - |
| `object-create` | Triggered when new objects are created or existing objects are overwritten. | * `PutObject`
* `CopyObject`
* `CompleteMultipartUpload` |
| `object-delete` | Triggered when an object is explicitly removed from the bucket. | - `DeleteObject`
- `LifecycleDeletion` |

## Message format

Queue consumers receive notifications as [Messages](https://developers.cloudflare.com/queues/configuration/javascript-apis/#message). The following is an example of the body of a message that a consumer Worker will receive:

```json
{
  "account": "3f4b7e3dcab231cbfdaa90a6a28bd548",
  "action": "CopyObject",
  "bucket": "my-bucket",
  "object": {
    "key": "my-new-object",
    "size": 65536,
    "eTag": "c846ff7a18f28c2e262116d6e8719ef0"
  },
  "eventTime": "2024-05-24T19:36:44.379Z",
  "copySource": {
    "bucket": "my-bucket",
    "object": "my-original-object"
  }
}
```

### Properties

| Property | Type | Description |
| - | - | - |
| `account` | String | The Cloudflare account ID that the event is associated with. |
| `action` | String | The type of action that triggered the event notification. Example actions include: `PutObject`, `CopyObject`, `CompleteMultipartUpload`, `DeleteObject`. |
| `bucket` | String | The name of the bucket where the event occurred. |
| `object` | Object | A nested object containing details about the object involved in the event. |
| `object.key` | String | The key (or name) of the object within the bucket. |
| `object.size` | Number | The size of the object in bytes. Note: not present for object-delete events. |
| `object.eTag` | String | The entity tag (eTag) of the object. Note: not present for object-delete events. |
| `eventTime` | String | The time when the action that triggered the event occurred. |
| `copySource` | Object | A nested object containing details about the source of a copied object. Note: only present for events triggered by `CopyObject`. |
| `copySource.bucket` | String | The bucket that contained the source object. |
| `copySource.object` | String | The name of the source object. |

## Notes

* Queues [per-queue message throughput](https://developers.cloudflare.com/queues/platform/limits/) is currently 5,000 messages per second. If your workload produces more than 5,000 notifications per second, we recommend splitting notification rules across multiple queues.
* Rules without prefix/suffix apply to all objects in the bucket.
* Overlapping or conflicting rules that could trigger multiple notifications for the same event are not allowed. For example, if you have an `object-create` (or `PutObject` action) rule without a prefix and suffix, then adding another `object-create` (or `PutObject` action) rule with a prefix like `images/` could trigger more than one notification for a single upload, which is invalid.
