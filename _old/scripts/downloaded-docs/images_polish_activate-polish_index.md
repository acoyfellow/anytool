---
title: Activate Polish · Cloudflare Images docs
description: Images in the cache must be purged or expired before seeing any
  changes in Polish settings.
lastUpdated: 2025-10-02T09:01:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/polish/activate-polish/
  md: https://developers.cloudflare.com/images/polish/activate-polish/index.md
---

Images in the [cache must be purged](https://developers.cloudflare.com/cache/how-to/purge-cache/) or expired before seeing any changes in Polish settings.

Warning

Do not activate Polish and [image transformations](https://developers.cloudflare.com/images/transform-images/) simultaneously. Image transformations already apply lossy compression, which makes Polish redundant.

1. In the Cloudflare dashboard, go to the **Account home** page.

   [Go to **Account home**](https://dash.cloudflare.com/?to=/:account/home)

2. Select the domain where you want to activate Polish.

3. Select ****Speed** > **Settings**** > **Image Optimization**.

4. Under **Polish**, select *Lossy* or *Lossless* from the drop-down menu. [*Lossy*](https://developers.cloudflare.com/images/polish/compression/#lossy) gives greater file size savings.

5. (Optional) Select **WebP**. Enable this option if you want to further optimize PNG and JPEG images stored in the origin server, and serve them as WebP files to browsers that support this format.

To ensure WebP is not served from cache to a browser without WebP support, disable any WebP conversion utilities at your origin web server when using Polish.

Note

To use this feature on specific hostnames - instead of across your entire zone - use a [configuration rule](https://developers.cloudflare.com/rules/configuration-rules/).
