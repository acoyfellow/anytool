---
title: Manage event subscriptions · Cloudflare Queues docs
description: Learn how to create, view, and delete event subscriptions for your queues.
lastUpdated: 2025-09-04T16:11:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/event-subscriptions/manage-event-subscriptions/
  md: https://developers.cloudflare.com/queues/event-subscriptions/manage-event-subscriptions/index.md
---

Learn how to:

* Create event subscriptions to receive messages from Cloudflare services.
* View existing subscriptions on your queues.
* Delete subscriptions you no longer need.

## Create subscription

Creating a subscription allows your queue to receive messages when events occur in Cloudflare services. You can specify which source and events you want to subscribe to.

### Dashboard

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select the queue you want to add a subscription to.

3. Switch to the **Subscriptions** tab.

4. Select **Subscribe to events**.

5. Name your subscription, and select the desired source and events.

6. Select **Subscribe**.

### Wrangler CLI

To create a subscription using Wrangler, run the [`queues subscription create command`](https://developers.cloudflare.com/queues/reference/wrangler-commands/#queues-subscription-create):

```bash
npx wrangler queues subscription create <queue-name> --source <source-type> --events <event1,event2> --<source-specific-option> <value>
```

To learn more about which sources and events you can subscribe to, refer to [Events & schemas](https://developers.cloudflare.com/queues/event-subscriptions/events-schemas/).

## View existing subscriptions

You can view all subscriptions configured for a queue to see what events it is currently receiving.

### Dashboard

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select the queue you want to view subscriptions for.

3. Switch to the **Subscriptions** tab.

### Wrangler CLI

To list subscriptions for a queue, run the [`queues subscription list command`](https://developers.cloudflare.com/queues/reference/wrangler-commands/#queues-subscription-list):

```bash
npx wrangler queues subscription list <queue-name>
```

## Delete subscription

When you delete a subscription, your queue will stop receiving messages for those events immediately.

### Dashboard

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select the queue containing the subscription you want to delete.

3. Switch to the **Subscriptions** tab.

4. Select **...** for the subscription you want to delete.

5. Select **Delete subscription**.

### Wrangler CLI

To delete a subscription, run the [`queues subscription delete command`](https://developers.cloudflare.com/queues/reference/wrangler-commands/#queues-subscription-delete):

```bash
npx wrangler queues subscription delete <queue-name> --id <subscription-id>
```

## Learn more

[Events & schemas ](https://developers.cloudflare.com/queues/event-subscriptions/events-schemas/)Explore available event sources and types that you can subscribe to.
