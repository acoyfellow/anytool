---
title: RTMPS playback · Cloudflare Stream docs
description: Example of sub 1s latency video playback using RTMPS and ffplay
lastUpdated: 2025-09-09T16:21:39.000Z
chatbotDeprioritize: false
tags: Playback
source_url:
  html: https://developers.cloudflare.com/stream/examples/rtmps_playback/
  md: https://developers.cloudflare.com/stream/examples/rtmps_playback/index.md
---

Note

Before you can play live video, you must first be [actively streaming to a live input](https://developers.cloudflare.com/stream/stream-live/start-stream-live).

Copy the RTMPS *playback* key for your live input from either:

* The **Live inputs** page of the Cloudflare dashboard.

  [Go to **Live inputs**](https://dash.cloudflare.com/?to=/:account/stream/inputs)

* The [Stream API](https://developers.cloudflare.com/stream/stream-live/start-stream-live/#use-the-api)

Paste it into the URL below, replacing `<RTMPS_PLAYBACK_KEY>`:

```sh
ffplay -analyzeduration 1 -fflags -nobuffer -sync ext 'rtmps://live.cloudflare.com:443/live/<RTMPS_PLAYBACK_KEY>'
```

For more, refer to [Play live video in native apps with less than one second latency](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/#play-live-video-in-native-apps-with-less-than-1-second-latency).
