---
title: Use your own player · Cloudflare Stream docs
description: Cloudflare Stream is compatible with all video players that support
  HLS and DASH, which are standard formats for streaming media with broad
  support across all web browsers, mobile operating systems and media streaming
  devices.
lastUpdated: 2025-09-09T16:21:39.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/
  md: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/index.md
---

Cloudflare Stream is compatible with all video players that support HLS and DASH, which are standard formats for streaming media with broad support across all web browsers, mobile operating systems and media streaming devices.

Platform-specific guides:

* [Web](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/web/)
* [iOS (AVPlayer)](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/ios/)
* [Android (ExoPlayer)](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/android/)

## Fetch HLS and Dash manifests

### URL

Each video and live stream has its own unique HLS and DASH manifest. You can access the manifest by replacing `<UID>` with the UID of your video or live input, and replacing `<CODE>` with your unique customer code, in the URLs below:

```txt
https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8
```

```txt
https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.mpd
```

#### LL-HLS playback Beta

If a Live Inputs is enabled for the Low-Latency HLS beta, add the query string `?protocol=llhls` to the HLS manifest URL to test the low latency manifest in a custom player. Refer to [Start a Live Stream](https://developers.cloudflare.com/stream/stream-live/start-stream-live/#use-the-api) to enable this option.

```txt
https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8?protocol=llhls
```

### Dashboard

1. In the Cloudflare dashboard, go to the **Stream** page.

   [Go to **Stream**](https://dash.cloudflare.com/?to=/:account/stream)

2. From the list of videos, locate your video and select it.

3. From the **Settings** tab, locate the **HLS Manifest URL** and **Dash Manifest URL**.

4. Select **Click to copy** under the option you want to use.

### API

Refer to the [Stream video details API documentation](https://developers.cloudflare.com/api/resources/stream/methods/get/) to learn how to fetch the manifest URLs using the Cloudflare API.

## Customize manifests by specifying available client bandwidth

Each HLS and DASH manifest provides multiple resolutions of your video or live stream. Your player contains adaptive bitrate logic to estimate the viewer's available bandwidth, and select the optimal resolution to play. Each player has different logic that makes this decision, and most have configuration options to allow you to customize or override either bandwidth or resolution.

If your player lacks such configuration options or you need to override them, you can add the `clientBandwidthHint` query param to the request to fetch the manifest file. This should be used only as a last resort — we recommend first using customization options provided by your player. Remember that while you may be developing your website or app on a fast Internet connection, and be tempted to use this setting to force high quality playback, many of your viewers are likely connecting over slower mobile networks.

* `clientBandwidthHint` float
  * Return only the video representation closest to the provided bandwidth value (in Mbps). This can be used to enforce a specific quality level. If you specify a value that would cause an invalid or empty manifest to be served, the hint is ignored.

Refer to the example below to display only the video representation with a bitrate closest to 1.8 Mbps.

```txt
https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.m3u8?clientBandwidthHint=1.8
```

## Play live video in native apps with less than 1 second latency

If you need ultra low latency, and your users view live video in native apps, you can stream live video with [**glass-to-glass latency of less than 1 second**](https://blog.cloudflare.com/magic-hdmi-cable/), by using SRT or RTMPS for playback.

![Diagram showing SRT and RTMPS playback via the Cloudflare Network](https://developers.cloudflare.com/_astro/stream-rtmps-srt-playback-magic-hdmi-cable.D_FiXuDG_GmHW7.webp)

SRT and RTMPS playback is built into [ffmpeg](https://ffmpeg.org/). You will need to integrate ffmpeg with your own video player —  neither [AVPlayer (iOS)](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/ios/) nor [ExoPlayer (Android)](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/android/) natively support SRT or RTMPS playback.

Note

Stream only supports the SRT caller mode, which is responsible for broadcasting a live stream after a connection is established.

We recommend using [ffmpeg-kit](https://github.com/arthenica/ffmpeg-kit) as a cross-platform wrapper for ffmpeg.

### Examples

* [RTMPS Playback with ffplay](https://developers.cloudflare.com/stream/examples/rtmps_playback/)
* [SRT playback with ffplay](https://developers.cloudflare.com/stream/examples/srt_playback/)
