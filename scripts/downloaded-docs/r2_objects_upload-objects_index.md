---
title: Upload objects · Cloudflare R2 docs
description: You can upload objects to your bucket from using API (both Workers
  Binding API or compatible S3 API), rclone, Cloudflare dashboard, or Wrangler.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/objects/upload-objects/
  md: https://developers.cloudflare.com/r2/objects/upload-objects/index.md
---

You can upload objects to your bucket from using API (both [Workers Binding API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/) or [compatible S3 API](https://developers.cloudflare.com/r2/api/s3/api/)), rclone, Cloudflare dashboard, or Wrangler.

## Upload objects via Rclone

Rclone is a command-line tool which manages files on cloud storage. You can use rclone to upload objects to R2. Rclone is useful if you wish to upload multiple objects concurrently.

To use rclone, install it onto your machine using their official documentation - [Install rclone](https://rclone.org/install/).

Upload your files to R2 using the `rclone copy` command.

```sh
# Upload a single file
rclone copy /path/to/local/file.txt r2:bucket_name


# Upload everything in a directory
rclone copy /path/to/local/folder r2:bucket_name
```

Verify that your files have been uploaded by listing the objects stored in the destination R2 bucket using `rclone ls` command.

```sh
rclone ls r2:bucket_name
```

For more information, refer to our [rclone example](https://developers.cloudflare.com/r2/examples/rclone/).

## Upload objects via the Cloudflare dashboard

To upload objects to your bucket from the Cloudflare dashboard:

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Select your bucket.

3. Select **Upload**.

4. Choose to either drag and drop your file into the upload area or **select from computer**.

You will receive a confirmation message after a successful upload.

## Upload objects via Wrangler

Note

Wrangler only supports uploading files up to 315MB in size. To upload large files, we recommend [rclone](https://developers.cloudflare.com/r2/examples/rclone/) or an [S3-compatible](https://developers.cloudflare.com/r2/api/s3/) tool of your choice.

To upload a file to R2, call `put` and provide a name (key) for the object, as well as the path to the file via `--file`:

```sh
wrangler r2 object put test-bucket/dataset.csv --file=dataset.csv
```

```sh
Creating object "dataset.csv" in bucket "test-bucket".
Upload complete.
```

You can set the `Content-Type` (MIME type), `Content-Disposition`, `Cache-Control` and other HTTP header metadata through optional flags.

Note

Wrangler's `object put` command only allows you to upload one object at a time.

Use rclone if you wish to upload multiple objects to R2.

## Other resources

For information on R2 Workers Binding API, refer to [R2 Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
