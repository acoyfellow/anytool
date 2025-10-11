---
title: iOS · Cloudflare Stream docs
description: You can stream both on-demand and live video to native iOS, tvOS
  and macOS apps using AVPlayer.
lastUpdated: 2025-08-20T20:59:04.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/ios/
  md: https://developers.cloudflare.com/stream/viewing-videos/using-own-player/ios/index.md
---

You can stream both on-demand and live video to native iOS, tvOS and macOS apps using [AVPlayer](https://developer.apple.com/documentation/avfoundation/avplayer).

Note

Before you can play videos, you must first [upload a video to Cloudflare Stream](https://developers.cloudflare.com/stream/uploading-videos/) or be [actively streaming to a live input](https://developers.cloudflare.com/stream/stream-live)

## Example Apps

* [iOS](https://developers.cloudflare.com/stream/examples/ios/)

## Using AVPlayer

Play a video from Cloudflare Stream using AVPlayer:

```swift
import SwiftUI
import AVKit


struct MyView: View {
    // Change the url to the Cloudflare Stream HLS manifest URL
    private let player = AVPlayer(url: URL(string: "https://customer-9cbb9x7nxdw5hb57.cloudflarestream.com/8f92fe7d2c1c0983767649e065e691fc/manifest/video.m3u8")!)


    var body: some View {
        VideoPlayer(player: player)
            .onAppear() {
                player.play()
            }
    }
}


struct MyView_Previews: PreviewProvider {
    static var previews: some View {
        MyView()
    }
}
```
