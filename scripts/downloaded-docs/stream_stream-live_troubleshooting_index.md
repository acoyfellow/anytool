---
title: Troubleshooting a live stream · Cloudflare Stream docs
description: In addition to following the live stream troubleshooting steps in
  this guide, make sure that your video settings align with Cloudflare live
  stream recommendations. If you use OBS, you can also check these OBS-specific
  recommendations.
lastUpdated: 2025-09-09T16:21:39.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/stream-live/troubleshooting/
  md: https://developers.cloudflare.com/stream/stream-live/troubleshooting/index.md
---

In addition to following the live stream troubleshooting steps in this guide, make sure that your video settings align with [Cloudflare live stream recommendations](https://developers.cloudflare.com/stream/stream-live/start-stream-live/#recommendations-requirements-and-limitations). If you use OBS, you can also check these [OBS-specific recommendations](https://developers.cloudflare.com/stream/examples/obs-from-scratch/#6-optional-optimize-settings).

## Buffering, freezing, and latency

If your live stream is buffering, freezing, experiencing latency issues, or having other similar issues, try these troubleshooting steps:

1. In the Cloudflare dashboard, go to the **Live inputs** page.

   [Go to **Live inputs**](https://dash.cloudflare.com/?to=/:account/stream/inputs)

2. For the live input in use, select the **Metrics** tab.

3. Look at your **Keyframe Interval** chart.

   It should be a consistent flat line that stays between 2s and 8s. If you see an inconsistent or wavy line, or a line that is consistently below 2s or above 8s, adjust the keyframe interval (also called GOP size) in your software or service used to send the stream to Cloudflare. The exact steps for editing those settings will depend on your platform.

   * Start by setting the keyframe interval to 4s. If playback is stable but latency is still too high, lower it to 2s. If you are experiencing buffering or freezing in playback, increase it to 8s.

   * If the keyframe interval is "variable" or "automatic", change it to a specific number instead, like 4s.

   What is a keyframe interval?

   The keyframe interval (also called GOP size) is a measurement of how often keyframes are sent to Stream. A shorter keyframe interval requires more internet bandwidth on the broadcast side, but can reduce glass-to-glass latency. A longer keyframe requires less internet bandwidth and can reduce buffering and freezing, but can increase glass-to-glass latency.

4. Look at your **Upload-to-Duration Ratio** chart.

   It should be a consistent flat line below 90%. If you see an inconsistent or wavy line, or a line that is consistently above 100%, try the following troubleshooting steps:

   * [Check that your internet upload speed](https://speed.cloudflare.com/) is at least 20 Mbps. If it is below 20 Mbps, use common troubleshooting steps such as restarting your router, using an Ethernet connection instead of Wi-Fi, or contacting your internet service provider.

   * Check the video bitrate setting in the software or service you use to send the stream to Cloudflare.

     * If it is "variable", change it to "constant" with a specific number, like 8 Mbps.
     * If it is above 15 Mbps, lower it to 8 Mbps or 70% of your internet speed, whichever is lower.

   * Follow the steps above (the keyframe interval steps) to *increase* the keyframe interval in the software or service you use to send the stream to Cloudflare.

   What is the upload-to-duration ratio?

   The upload-to-duration ratio is a measurement of how long it takes to upload a part of the stream compared to how long that part would take to play. A ratio of less than 100% means that the stream is uploading at least as fast as it would take to play, so most users should not experience buffering or freezing. A ratio of 100% or more means that your video is uploading slower than it would take to play, so it is likely that most users will experience buffering and freezing.
