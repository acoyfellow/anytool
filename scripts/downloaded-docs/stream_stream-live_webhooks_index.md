---
title: Receive Live Webhooks · Cloudflare Stream docs
description: Stream Live offers webhooks to notify your service when an Input
  connects, disconnects, or encounters an error with Stream Live.
lastUpdated: 2025-09-04T14:40:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/stream-live/webhooks/
  md: https://developers.cloudflare.com/stream/stream-live/webhooks/index.md
---

Stream Live offers webhooks to notify your service when an Input connects, disconnects, or encounters an error with Stream Live.

Stream Live Notifications

**Who is it for?**

Customers who are using [Stream](https://developers.cloudflare.com/stream/) and want to receive webhooks with the status of their videos.

**Other options / filters**

You can input Stream Live IDs to receive notifications only about those inputs. If left blank, you will receive a list for all inputs.

The following input states will fire notifications. You can toggle them on or off:

* `live_input.connected`
* `live_input.disconnected`

**Included with**

Stream subscription.

**What should you do if you receive one?**

Stream notifications are entirely customizable by the customer. Action will depend on the customizations enabled.

## Subscribe to Stream Live Webhooks

1. In the Cloudflare dashboard, go to the **Notifications** page.

   [Go to **Notifications**](https://dash.cloudflare.com/?to=/:account/notifications)

2. Select the **Destinations** tab.

3. On the **Destinations** page under **Webhooks**, select **Create**.

4. Enter the information for your webhook and select **Save and Test**.

5. To create the notification, from the **Notifications** page, select the **All Notifications** tab.

6. Next to **Notifications**, select **Add**.

7. Under the list of products, locate **Stream** and select **Select**.

8. Enter a name and optional description.

9. Under **Webhooks**, select **Add webhook** and select your newly created webhook.

10. Select **Next**.

11. By default, you will receive webhook notifications for all Live Inputs. If you only wish to receive webhooks for certain inputs, enter a comma-delimited list of Input IDs in the text field.

12. When you are done, select **Create**.

```json
{
  "name": "Live Webhook Test",
  "text": "Notification type: Stream Live Input\nInput ID: eb222fcca08eeb1ae84c981ebe8aeeb6\nEvent type: live_input.disconnected\nUpdated at: 2022-01-13T11:43:41.855717910Z",
  "data": {
    "notification_name": "Stream Live Input",
    "input_id": "eb222fcca08eeb1ae84c981ebe8aeeb6",
    "event_type": "live_input.disconnected",
    "updated_at": "2022-01-13T11:43:41.855717910Z"
  },
  "ts": 1642074233
}
```

The `event_type` property of the data object will either be `live_input.connected`, `live_input.disconnected`, or `live_input.errored`.

If there are issues detected with the input, the `event_type` will be `live_input.errored`. Additional data will be under the `live_input_errored` json key and will include a `code` with one of the values listed below.

## Error codes

* `ERR_GOP_OUT_OF_RANGE` – The input GOP size or keyframe interval is out of range.
* `ERR_UNSUPPORTED_VIDEO_CODEC` – The input video codec is unsupported for the protocol used.
* `ERR_UNSUPPORTED_AUDIO_CODEC` – The input audio codec is unsupported for the protocol used.
* `ERR_STORAGE_QUOTA_EXHAUSTED` – The account storage quota has been exceeded. Delete older content or purcahse additional storage.
* `ERR_MISSING_SUBSCRIPTION` – Unauthorized to start a live stream. Check subscription or log into Dash for details.

```json
{
  "name": "Live Webhook Test",
  "text": "Notification type: Stream Live Input\nInput ID: 2c28dd2cc444cb77578c4840b51e43a8\nEvent type: live_input.errored\nUpdated at: 2024-07-09T18:07:51.077371662Z\nError Code: ERR_GOP_OUT_OF_RANGE\nError Message: Input GOP size or keyframe interval is out of range.\nVideo Codec: \nAudio Codec: ",
  "data": {
    "notification_name": "Stream Live Input",
    "input_id": "eb222fcca08eeb1ae84c981ebe8aeeb6",
    "event_type": "live_input.errored",
    "updated_at": "2024-07-09T18:07:51.077371662Z",
    "live_input_errored": {
      "error": {
        "code": "ERR_GOP_OUT_OF_RANGE",
        "message": "Input GOP size or keyframe interval is out of range."
      },
      "video_codec": "",
      "audio_codec": ""
    }
  },
  "ts": 1720548474,
}
```
