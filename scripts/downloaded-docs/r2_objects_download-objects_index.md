---
title: Download objects · Cloudflare R2 docs
description: You can download objects from your bucket from the Cloudflare
  dashboard or using the Wrangler.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/objects/download-objects/
  md: https://developers.cloudflare.com/r2/objects/download-objects/index.md
---

You can download objects from your bucket from the Cloudflare dashboard or using the Wrangler.

## Download objects via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Locate and select your bucket.

3. Locate the object you want to download.

4. At the end of the object's row, select the menu button and click **Download**.

## Download objects via Wrangler

You can download objects from a bucket, including private buckets in your account, directly.

For example, to download `file.bin` from `test-bucket`:

```sh
wrangler r2 object get test-bucket/file.bin
```

```sh
Downloading "file.bin" from "test-bucket".
Download complete.
```

The file will be downloaded into the current working directory. You can also use the `--file` flag to set a new name for the object as it is downloaded, and the `--pipe` flag to pipe the download to standard output (stdout).

## Other resources

For information on R2 Workers Binding API, refer to [R2 Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
