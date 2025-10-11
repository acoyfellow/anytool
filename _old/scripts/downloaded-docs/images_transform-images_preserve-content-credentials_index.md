---
title: Preserve Content Credentials · Cloudflare Images docs
description: Content Credentials (or C2PA metadata) are a type of metadata that
  includes the full provenance chain of a digital asset. This provides
  information about an image's creation, authorship, and editing flow. This data
  is cryptographically authenticated and can be verified using an open-source
  verification service.
lastUpdated: 2025-02-03T14:37:08.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/transform-images/preserve-content-credentials/
  md: https://developers.cloudflare.com/images/transform-images/preserve-content-credentials/index.md
---

[Content Credentials](https://contentcredentials.org/) (or C2PA metadata) are a type of metadata that includes the full provenance chain of a digital asset. This provides information about an image's creation, authorship, and editing flow. This data is cryptographically authenticated and can be verified using an [open-source verification service](https://contentcredentials.org/verify).

You can preserve Content Credentials when optimizing images stored in remote sources.

## Enable

You can configure how Content Credentials are handled for each zone where transformations are served.

In the Cloudflare dashboard under **Images** > **Transformations**, navigate to a specific zone and enable the toggle to preserve Content Credentials:

![Enable Preserving Content Credentials in the dashboard](https://developers.cloudflare.com/_astro/preserve-content-credentials.BDptgOn0_1TjaGK.webp)

The behavior of this setting is determined by the [`metadata`](https://developers.cloudflare.com/images/transform-images/transform-via-url/#metadata) parameter for each transformation.

For example, if a transformation specifies `metadata=copyright`, then the EXIF copyright tag and all Content Credentials will be preserved in the resulting image and all other metadata will be discarded.

When Content Credentials are preserved in a transformation, Cloudflare will keep any existing Content Credentials embedded in the source image and automatically append and cryptographically sign additional actions.

When this setting is disabled, any existing Content Credentials will always be discarded.
