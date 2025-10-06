---
title: Android · Cloudflare Stream docs
description: You can stream both on-demand and live video to native Android apps
  using ExoPlayer.
lastUpdated: 2025-08-20T20:59:04.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/android/
  md: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/android/index.md
---

You can stream both on-demand and live video to native Android apps using [ExoPlayer](https://exoplayer.dev/).

Note

Before you can play videos, you must first [upload a video to Cloudflare Stream](https://developers.cloudflare.com/stream/uploading-videos/) or be [actively streaming to a live input](https://developers.cloudflare.com/stream/stream-live)

## Example Apps

* [Android](https://developers.cloudflare.com/stream/examples/android/)

## Using ExoPlayer

Play a video from Cloudflare Stream using ExoPlayer:

```kotlin
implementation 'com.google.android.exoplayer:exoplayer-hls:2.X.X'


SimpleExoPlayer player = new SimpleExoPlayer.Builder(context).build();


// Set the media item to the Cloudflare Stream HLS Manifest URL:
player.setMediaItem(MediaItem.fromUri("https://customer-9cbb9x7nxdw5hb57.cloudflarestream.com/8f92fe7d2c1c0983767649e065e691fc/manifest/video.m3u8"));


player.prepare();
```
