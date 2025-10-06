---
title: Delete objects · Cloudflare R2 docs
description: You can delete objects from your bucket from the Cloudflare
  dashboard or using the Wrangler.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/objects/delete-objects/
  md: https://developers.cloudflare.com/r2/objects/delete-objects/index.md
---

You can delete objects from your bucket from the Cloudflare dashboard or using the Wrangler.

## Delete objects via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Locate and select your bucket.

3. Locate the object you want to delete. You can select multiple objects to delete at one time.

4. Select your objects and select **Delete**.

5. Confirm your choice by selecting **Delete**.

## Delete objects via Wrangler

Warning

Deleting objects from a bucket is irreversible.

You can delete an object directly by calling `delete` against a `{bucket}/{path/to/object}`.

For example, to delete the object `foo.png` from bucket `test-bucket`:

```sh
wrangler r2 object delete test-bucket/foo.png
```

```sh
Deleting object "foo.png" from bucket "test-bucket".
Delete complete.
```

## Other resources

For information on R2 Workers Binding API, refer to [R2 Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
