---
title: Alarms · Cloudflare Durable Objects docs
description: Durable Objects alarms allow you to schedule the Durable Object to
  be woken up at a time in the future. When the alarm's scheduled time comes,
  the alarm() handler method will be called. Alarms are modified using the
  Storage API, and alarm operations follow the same rules as other storage
  operations.
lastUpdated: 2025-09-24T13:21:38.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/durable-objects/api/alarms/
  md: https://developers.cloudflare.com/durable-objects/api/alarms/index.md
---

## Background

Durable Objects alarms allow you to schedule the Durable Object to be woken up at a time in the future. When the alarm's scheduled time comes, the `alarm()` handler method will be called. Alarms are modified using the Storage API, and alarm operations follow the same rules as other storage operations.

Notably:

* Each Durable Object is able to schedule a single alarm at a time by calling `setAlarm()`.
* Alarms have guaranteed at-least-once execution and are retried automatically when the `alarm()` handler throws.
* Retries are performed using exponential backoff starting at a 2 second delay from the first failure with up to 6 retries allowed.

How are alarms different from Cron Triggers?

Alarms are more fine grained than [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/). A Worker can have up to three Cron Triggers configured at once, but it can have an unlimited amount of Durable Objects, each of which can have an alarm set.

Alarms are directly scheduled from within your Durable Object. Cron Triggers, on the other hand, are not programmatic. [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) execute based on their schedules, which have to be configured through the Cloudflare dashboard or API.

Alarms can be used to build distributed primitives, like queues or batching of work atop Durable Objects. Alarms also provide a mechanism to guarantee that operations within a Durable Object will complete without relying on incoming requests to keep the Durable Object alive. For a complete example, refer to [Use the Alarms API](https://developers.cloudflare.com/durable-objects/examples/alarms-api/).

## Storage methods

### `getAlarm`

* `getAlarm()`: number | null

  * If there is an alarm set, then return the currently set alarm time as the number of milliseconds elapsed since the UNIX epoch. Otherwise, return `null`.

  * If `getAlarm` is called while an [`alarm`](https://developers.cloudflare.com/durable-objects/api/alarms/#alarm) is already running, it returns `null` unless `setAlarm` has also been called since the alarm handler started running.

### `setAlarm`

* `setAlarm(scheduledTimeMs number) `: void

  * Set the time for the alarm to run. Specify the time as the number of milliseconds elapsed since the UNIX epoch.
  * If you call `setAlarm` when there is already one scheduled, it will override the existing alarm.

Calling `setAlarm` inside the constructor

If you wish to call `setAlarm` inside the constructor of a Durable Object, ensure that you are first checking whether an alarm has already been set.

This is due to the fact that, if the Durable Object wakes up after being inactive, the constructor is invoked before the [`alarm` handler](https://developers.cloudflare.com/durable-objects/api/alarms/#alarm). Therefore, if the constructor calls `setAlarm`, it could interfere with the next alarm which has already been set.

### `deleteAlarm`

* `deleteAlarm()`: void

  * Unset the alarm if there is a currently set alarm.

  * Calling `deleteAlarm()` inside the `alarm()` handler may prevent retries on a best-effort basis, but is not guaranteed.

## Handler methods

### `alarm`

* `alarm(alarmInfo Object)`: void

  * Called by the system when a scheduled alarm time is reached.

  * The optional parameter `alarmInfo` object has two properties:

    * `retryCount` number: The number of times this alarm event has been retried.
    * `isRetry` boolean: A boolean value to indicate if the alarm has been retried. This value is `true` if this alarm event is a retry.

  * Only one instance of `alarm()` will ever run at a given time per Durable Object instance.

  * The `alarm()` handler has guaranteed at-least-once execution and will be retried upon failure using exponential backoff, starting at 2 second delays for up to 6 retries. This only applies to the most recent `setAlarm()` call. Retries will be performed if the method fails with an uncaught exception.

  * This method can be `async`.

## Example

This example shows how to both set alarms with the `setAlarm(timestamp)` method and handle alarms with the `alarm()` handler within your Durable Object.

* The `alarm()` handler will be called once every time an alarm fires.
* If an unexpected error terminates the Durable Object, the `alarm()` handler may be re-instantiated on another machine.
* Following a short delay, the `alarm()` handler will run from the beginning on the other machine.

```js
import { DurableObject } from "cloudflare:workers";


export default {
  async fetch(request, env) {
    return await env.ALARM_EXAMPLE.getByName("foo").fetch(request);
  },
};


const SECONDS = 1000;


export class AlarmExample extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.storage = ctx.storage;
  }
  async fetch(request) {
    // If there is no alarm currently set, set one for 10 seconds from now
    let currentAlarm = await this.storage.getAlarm();
    if (currentAlarm == null) {
      this.storage.setAlarm(Date.now() + 10 * SECONDS);
    }
  }
  async alarm() {
    // The alarm handler will be invoked whenever an alarm fires.
    // You can use this to do work, read from the Storage API, make HTTP calls
    // and set future alarms to run using this.storage.setAlarm() from within this handler.
  }
}
```

The following example shows how to use the `alarmInfo` property to identify if the alarm event has been attempted before.

```js
class MyDurableObject extends DurableObject {
  async alarm(alarmInfo) {
    if (alarmInfo?.retryCount != 0) {
      console.log(
        "This alarm event has been attempted ${alarmInfo?.retryCount} times before.",
      );
    }
  }
}
```

## Related resources

* Understand how to [use the Alarms API](https://developers.cloudflare.com/durable-objects/examples/alarms-api/) in an end-to-end example.
* Read the [Durable Objects alarms announcement blog post](https://blog.cloudflare.com/durable-objects-alarms/).
* Review the [Storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) documentation for Durable Objects.
