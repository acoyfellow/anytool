---
title: Get live viewer counts · Cloudflare Stream docs
description: The Stream player has full support for live viewer counts by
  default. To get the viewer count for live videos for use with third party
  players, make a GET request to the /views endpoint.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/getting-analytics/live-viewer-count/
  md: https://developers.cloudflare.com/stream/getting-analytics/live-viewer-count/index.md
---

The Stream player has full support for live viewer counts by default. To get the viewer count for live videos for use with third party players, make a `GET` request to the `/views` endpoint.

```bash
https://customer-<CODE>.cloudflarestream.com/<INPUT_ID>/views
```

Below is a response for a live video with several active viewers:

```json
{ "liveViewers": 113 }
```
