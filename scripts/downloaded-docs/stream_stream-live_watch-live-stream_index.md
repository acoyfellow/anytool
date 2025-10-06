---
title: Watch a live stream · Cloudflare Stream docs
description: |-
  When a Live Input begins receiving a
  broadcast, a new video is automatically created if the input's mode property
  is set to automatic.
lastUpdated: 2025-09-04T14:40:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/stream-live/watch-live-stream/
  md: https://developers.cloudflare.com/stream/stream-live/watch-live-stream/index.md
---

When a [Live Input](https://developers.cloudflare.com/stream/stream-live/start-stream-live/) begins receiving a broadcast, a new video is automatically created if the input's `mode` property is set to `automatic`.

To watch, Stream offers a built-in Player or you use a custom player with the HLS and DASH manifests.

Note

Due to Google Chromecast limitations, Chromecast does not support audio and video delivered separately. To avoid potential issues with playback, we recommend using DASH, instead of HLS, which is a Chromecast supported use case.

## View by Live Input ID or Video ID

Whether you use the Stream Player or a custom player with a manifest, you can reference the Live Input ID or a specific Video ID. The main difference is what happens when a broadcast concludes.

Use a Live Input ID in instances where a player should always show the active broadcast, if there is one, or a "Stream has not started" message if the input is idle. This option is best for cases where a page is dedicated to a creator, channel, or recurring program. The Live Input ID is provisioned for you when you create the input; it will not change.

Use a Video ID in instances where a player should be used to display a single broadcast or its recording once the broadcast has concluded. This option is best for cases where a page is dedicated to a one-time event, specific episode/occurance, or date. There is a *new* Video ID generated for each broadcast *when it starts.*

Using DVR mode, explained below, there are additional considerations.

Stream's URLs are all templatized for easy generation:

**Stream built-in Player URL format:**

```plaintext
https://customer-<CODE>.cloudflarestream.com/<INPUT_ID|VIDEO_ID>/iframe
```

A full embed code can be generated in Dash or with the API.

**HLS Manifest URL format:**

```plaintext
https://customer-<CODE>.cloudflarestream.com/<INPUT_ID|VIDEO_ID>/manifest/video.m3u8
```

You can also retrieve the embed code or manifest URLs from Dash or the API.

## Use the dashboard

To get the Stream built-in player embed code or HLS Manifest URL for a custom player:

1. In the Cloudflare dashboard, go to the **Live inputs** page.

   [Go to **Live inputs**](https://dash.cloudflare.com/?to=/:account/stream/inputs)

2. Select a live input from the list.

3. Locate the **Embed** and **HLS Manifest URL** beneath the video.

4. Determine which option to use and then select **Click to copy** beneath your choice.

The embed code or manifest URL retrieved in Dash will reference the Live Input ID.

## Use the API

To retrieve the player code or manifest URLs via the API, fetch the Live Input's list of videos:

```bash
curl -X GET \
-H "Authorization: Bearer <API_TOKEN>" \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/live_inputs/<LIVE_INPUT_UID>/videos
```

A live input will have multiple videos associated with it, one for each broadcast. If there is an active broadcast, the first video in the response will have a `live-inprogress` status. Other videos in the response represent recordings which can be played on-demand.

Each video in the response, including the active broadcast if there is one, contains the HLS and DASH URLs and a link to the Stream player. Noteworthy properties include:

* `preview` -- Link to the Stream player to watch
* `playback`.`hls` -- HLS Manifest
* `playback`.`dash` -- DASH Manifest

In the example below, the state of the live video is `live-inprogress` and the state for previously recorded video is `ready`.

```json
{
  "result": [
    {
      "uid": "6b9e68b07dfee8cc2d116e4c51d6a957",
      "thumbnail": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/thumbnails/thumbnail.jpg",


      "status": {
        "state": "live-inprogress",
        "errorReasonCode": "",
        "errorReasonText": ""
      },
      "meta": {
        "name": "Stream Live Test 23 Sep 21 05:44 UTC"
      },
      "created": "2021-09-23T05:44:30.453838Z",
      "modified": "2021-09-23T05:44:30.453838Z",
      "size": 0,
      "preview": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/watch",
      ...


      "playback": {
        "hls": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.m3u8",
        "dash": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.mpd"
      },
      ...
    },
    {
      "uid": "6b9e68b07dfee8cc2d116e4c51d6a957",
      "thumbnail": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/thumbnails/thumbnail.jpg",
      "thumbnailTimestampPct": 0,
      "readyToStream": true,
      "status": {
        "state": "ready",
        "pctComplete": "100.000000",
        "errorReasonCode": "",
        "errorReasonText": ""
      },
      "meta": {
        "name": "CFTV Staging 22 Sep 21 22:12 UTC"
      },
      "created": "2021-09-22T22:12:53.587306Z",
      "modified": "2021-09-23T00:14:05.591333Z",
      "size": 0,
      "preview": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/watch",
      ...
      "playback": {
        "hls": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.m3u8",
        "dash": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.mpd"
      },
    }
  ],
}
```

These will reference the Video ID.

## Live input status

You can check whether a live input is currently streaming and what its active video ID is by making a request to its `lifecycle` endpoint. The Stream player does this automatically to show a note when the input is idle. Custom players may require additional support.

```bash
curl -X GET \
-H "Authorization: Bearer <API_TOKEN>" \
https://customer-<CODE>.cloudflarestream.com/<INPUT_ID>/lifecycle
```

In the example below, the response indicates the `ID` is for an input with an active `videoUID`. The `live` status value indicates the input is actively streaming.

```json
{
  "isInput": true,
  "videoUID": "55b9b5ce48c3968c6b514c458959d6a",
  "live": true
}
```

```json
{
  "isInput": true,
  "videoUID": null,
  "live": false
}
```

When viewing a live stream via the live input ID, the `requireSignedURLs` and `allowedOrigins` options in the live input recording settings are used. These settings are independent of the video-level settings.

## Live stream recording playback

After a live stream ends, a recording is automatically generated and available within 60 seconds. To ensure successful video viewing and playback, keep the following in mind:

* If a live stream ends while a viewer is watching, viewers using the Stream player should wait 60 seconds and then reload the player to view the recording of the live stream.
* After a live stream ends, you can check the status of the recording via the API. When the video state is `ready`, you can use one of the manifest URLs to stream the recording.

While the recording of the live stream is generating, the video may report as `not-found` or `not-started`.

If you are not using the Stream player for live stream recordings, refer to [Record and replay live streams](https://developers.cloudflare.com/stream/stream-live/replay-recordings/) for more information on how to replay a live stream recording.
