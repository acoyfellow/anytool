---
title: Cloudflare Queues - Sending messages from the dashboard · Cloudflare
  Queues docs
description: Use the dashboard to send messages to a queue.
lastUpdated: 2025-09-04T11:41:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/examples/send-messages-from-dash/
  md: https://developers.cloudflare.com/queues/examples/send-messages-from-dash/index.md
---

Sending messages from the dashboard allows you to debug Queues or queue consumers without a producer Worker.

To send messages from the dashboard:

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select the queue to send a message to.

3. Select the **Messages** tab.

4. Select **Send**.

5. Choose your message **Content Type**: *Text* or *JSON*.

6. Enter your message. Alternatively, drag a file over the textbox to upload a file as a message.

7. Select **Send**.

Your message will be sent to the queue.

Refer to the [Get Started guide](https://developers.cloudflare.com/queues/get-started/) to learn how to send messages to a queue from a Worker.
