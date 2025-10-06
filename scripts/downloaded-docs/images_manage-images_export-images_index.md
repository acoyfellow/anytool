---
title: Export images · Cloudflare Images docs
description: Cloudflare Images supports image exports via the Cloudflare
  dashboard and API which allows you to get the original version of your image.
lastUpdated: 2025-09-05T07:54:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/manage-images/export-images/
  md: https://developers.cloudflare.com/images/manage-images/export-images/index.md
---

Cloudflare Images supports image exports via the Cloudflare dashboard and API which allows you to get the original version of your image.

## Export images via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to the **Images** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/images)

2. Find the image or images you want to export.

3. To export a single image, select **Export** from its menu. To export several images, select the checkbox next to each image and then select **Export selected**.

Your images are downloaded to your machine.

## Export images via the API

Make a `GET` request as shown in the example below. `<IMAGE_ID>` must be fully URL encoded in the API call URL.

`GET accounts/<ACCOUNT_ID>/images/v1/<IMAGE_ID>/blob`
