---
title: Get started · Cloudflare Stream docs
description: You can upload videos using the API or directly on the Stream page
  of the Cloudflare dashboard.
lastUpdated: 2025-09-25T13:29:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/get-started/
  md: https://developers.cloudflare.com/stream/get-started/index.md
---

Media Transformations is now GA:

Billing for Media Transformations will begin on November 1st, 2025.

* [Upload your first video](https://developers.cloudflare.com/stream/get-started#upload-your-first-video)
* [Start your first live stream](https://developers.cloudflare.com/stream/get-started#start-your-first-live-stream)

## Upload your first video

### Step 1: Upload an example video from a public URL

You can upload videos using the API or directly on the **Stream** page of the Cloudflare dashboard.

[Go to **Stream**](https://dash.cloudflare.com/?to=/:account/stream)

To use the API, replace the `API_TOKEN` and `ACCOUNT_ID` values with your credentials in the example below.

```bash
curl \
-X POST \
-d '{"url":"https://storage.googleapis.com/stream-example-bucket/video.mp4","meta":{"name":"My First Stream Video"}}' \
-H "Authorization: Bearer <API_TOKEN>" \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/copy
```

### Step 2: Wait until the video is ready to stream

Because Stream must download and process the video, the video might not be available for a few seconds depending on the length of your video. You should poll the Stream API until `readyToStream` is `true`, or use [webhooks](https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/) to be notified when a video is ready for streaming.

Use the video UID from the first step to poll the video:

```bash
curl \
-H "Authorization: Bearer <API_TOKEN>" \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/<VIDEO_UID>
```

```json
{
  "result": {
    "uid": "6b9e68b07dfee8cc2d116e4c51d6a957",
    "preview": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/watch",
    "thumbnail": "https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/thumbnails/thumbnail.jpg",
    "readyToStream": true,
    "status": {
      "state": "ready"
    },
    "meta": {
      "downloaded-from": "https://storage.googleapis.com/stream-example-bucket/video.mp4",
      "name": "My First Stream Video"
    },
    "created": "2020-10-16T20:20:17.872170843Z",
    "size": 9032701,
   //...
  },
  "success": true,
  "errors": [],
  "messages": []
}
```

### Step 3: Play the video in your website or app

Videos uploaded to Stream can be played on any device and platform, from websites to native apps. See [Play videos](https://developers.cloudflare.com/stream/viewing-videos) for details and examples of video playback across platforms.

To play video on your website with the [Stream Player](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/), copy the `uid` of the video from the request above, along with your unique customer code, and replace `<CODE>` and `<VIDEO_UID>` in the embed code below:

```html
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/<VIDEO_UID>/iframe"
  title="Example Stream video"
  frameBorder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen>
</iframe>
```

The embed code above can also be found on the **Stream** page of the Cloudflare dashboard.

[Go to **Stream**](https://dash.cloudflare.com/?to=/:account/stream)

### Next steps

* [Edit your video](https://developers.cloudflare.com/stream/edit-videos/) and add captions or watermarks
* [Customize the Stream player](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/)

## Start your first live stream

### Step 1: Create a live input

You can create a live input using the API or the **Live inputs** page of the Cloudflare dashboard.

[Go to **Live inputs**](https://dash.cloudflare.com/?to=/:account/stream/inputs)

To use the API, replace the `API_TOKEN` and `ACCOUNT_ID` values with your credentials in the example below.

```bash
curl -X POST \
-H "Authorization: Bearer <API_TOKEN>" \
-D '{"meta": {"name":"test stream"},"recording": { "mode": "automatic" }}' \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/live_inputs
```

```json
{
  "uid": "f256e6ea9341d51eea64c9454659e576",
  "rtmps": {
    "url": "rtmps://live.cloudflare.com:443/live/",
    "streamKey": "MTQ0MTcjM3MjI1NDE3ODIyNTI1MjYyMjE4NTI2ODI1NDcxMzUyMzcf256e6ea9351d51eea64c9454659e576"
  },
  "created": "2021-09-23T05:05:53.451415Z",
  "modified": "2021-09-23T05:05:53.451415Z",
  "meta": {
    "name": "test stream"
  },
  "status": null,
  "recording": {
    "mode": "automatic",
    "requireSignedURLs": false,
    "allowedOrigins": null
  }
}
```

### Step 2: Copy the RTMPS URL and key, and use them with your live streaming application.

We recommend using [Open Broadcaster Software (OBS)](https://obsproject.com/) to get started.

### Step 3: Play the live stream in your website or app

Live streams can be played on any device and platform, from websites to native apps, using the same video players as videos uploaded to Stream. See [Play videos](https://developers.cloudflare.com/stream/viewing-videos) for details and examples of video playback across platforms.

To play the live stream you just started on your website with the [Stream Player](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/), copy the `uid` of the live input from the request above, along with your unique customer code, and replace `<CODE>` and `<VIDEO_UID>` in the embed code below:

```html
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/<VIDEO_UID>/iframe"
  title="Example Stream video"
  frameBorder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen>
</iframe>
```

The embed code above can also be found on the **Stream** page of the Cloudflare dashboard.

[Go to **Stream**](https://dash.cloudflare.com/?to=/:account/stream)

### Next steps

* [Secure your stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/)
* [View live viewer counts](https://developers.cloudflare.com/stream/getting-analytics/live-viewer-count/)

## Accessibility considerations

To make your video content more accessible, include [captions](https://developers.cloudflare.com/stream/edit-videos/adding-captions/) and [high-quality audio recording](https://www.w3.org/WAI/media/av/av-content/).
