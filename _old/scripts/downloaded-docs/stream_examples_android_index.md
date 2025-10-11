---
title: Android (ExoPlayer) · Cloudflare Stream docs
description: Example of video playback on Android using ExoPlayer
lastUpdated: 2025-08-20T20:59:04.000Z
chatbotDeprioritize: false
tags: Playback
source_url:
  html: https://developers.cloudflare.com/stream/examples/android/
  md: https://developers.cloudflare.com/stream/examples/android/index.md
---

Note

Before you can play videos, you must first [upload a video to Cloudflare Stream](https://developers.cloudflare.com/stream/uploading-videos/) or be [actively streaming to a live input](https://developers.cloudflare.com/stream/stream-live)

```kotlin
implementation 'com.google.android.exoplayer:exoplayer-hls:2.X.X'


SimpleExoPlayer player = new SimpleExoPlayer.Builder(context).build();


// Set the media item to the Cloudflare Stream HLS Manifest URL:
player.setMediaItem(MediaItem.fromUri("https://customer-9cbb9x7nxdw5hb57.cloudflarestream.com/8f92fe7d2c1c0983767649e065e691fc/manifest/video.m3u8"));


player.prepare();
```

### Download and run an example app

1. Download [this example app](https://github.com/googlecodelabs/exoplayer-intro.git) from the official Android developer docs, following [this guide](https://developer.android.com/codelabs/exoplayer-intro#4).
2. Open and run the [exoplayer-codelab-04 example app](https://github.com/googlecodelabs/exoplayer-intro/tree/main/exoplayer-codelab-04) using [Android Studio](https://developer.android.com/studio).
3. Replace the `media_url_dash` URL on [this line](https://github.com/googlecodelabs/exoplayer-intro/blob/main/exoplayer-codelab-04/src/main/res/values/strings.xml#L21) with the DASH manifest URL for your video.

For more, see [read the docs](https://developers.cloudflare.com/stream/viewing-videos/using-own-player/ios/).
