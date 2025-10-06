---
title: Upload images · Cloudflare Images docs
description: Cloudflare Images allows developers to upload images using
  different methods, for a wide range of use cases.
lastUpdated: 2025-07-08T19:32:52.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/upload-images/
  md: https://developers.cloudflare.com/images/upload-images/index.md
---

Cloudflare Images allows developers to upload images using different methods, for a wide range of use cases.

## Supported image formats

You can upload the following image formats to Cloudflare Images:

* PNG
* GIF (including animations)
* JPEG
* WebP (Cloudflare Images also supports uploading animated WebP files)
* SVG
* HEIC

Note

Cloudflare can ingest HEIC images for decoding, but they must be served in web-safe formats such as AVIF, WebP, JPG, or PNG.

## Dimensions and sizes

These are the maximum allowed sizes and dimensions Cloudflare Images supports:

* Maximum image dimension is 12,000 pixels.
* Maximum image area is limited to 100 megapixels (for example, 10,000×10,000 pixels).
* Image metadata is limited to 1024 bytes.
* Images have a 10 megabyte (MB) size limit.
* Animated GIFs/WebP, including all frames, are limited to 50 megapixels (MP).
