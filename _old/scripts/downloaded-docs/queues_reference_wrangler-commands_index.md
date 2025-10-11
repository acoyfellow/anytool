---
title: Wrangler commands · Cloudflare Queues docs
description: Queues Wrangler commands use REST APIs to interact with the control
  plane. This page lists the Wrangler commands for Queues.
lastUpdated: 2025-08-19T15:48:23.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/reference/wrangler-commands/
  md: https://developers.cloudflare.com/queues/reference/wrangler-commands/index.md
---

Queues Wrangler commands use REST APIs to interact with the control plane. This page lists the Wrangler commands for Queues.

### `create`

Create a new queue.

```txt
wrangler queues create <name> [OPTIONS]
```

* `name` string required
  * The name of the queue to create.
* `--delivery-delay-secs` number optional
  * How long a published message should be delayed for, in seconds. Must be a positive integer.
* `--message-retention-period-secs` number optional
  * How long a published message is retained in the Queue. Must be a positive integer between 60 and 1209600 (14 days). Defaults to 345600 (4 days).

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `update`

Update an existing queue.

```txt
wrangler queues update <name> [OPTIONS]
```

* `name` string required
  * The name of the queue to update.
* `--delivery-delay-secs` number optional
  * How long a published message should be delayed for, in seconds. Must be a positive integer.
* `--message-retention-period-secs` number optional
  * How long a published message is retained on the Queue. Must be a positive integer between 60 and 1209600 (14 days). Defaults to 345600 (4 days).

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `delete`

Delete an existing queue.

```txt
wrangler queues delete <name> [OPTIONS]
```

* `name` string required
  * The name of the queue to delete.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `list`

List all queues in the current account.

```txt
wrangler queues list [OPTIONS]
```

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `info`

Get information on individual queues.

```txt
wrangler queues info <name>
```

* `name` string required
  * The name of the queue to inspect.

### `consumer`

Manage queue consumer configurations.

### `consumer add <script-name>`

Add a Worker script as a [queue consumer](https://developers.cloudflare.com/queues/reference/how-queues-works/#consumers).

```txt
wrangler queues consumer add <queue-name> <script-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue to add the consumer to.
* `script-name` string required
  * The name of the Workers script to add as a consumer of the named queue.
* `--batch-size` number optional
  * Maximum number of messages per batch. Must be a positive integer.
* `--batch-timeout` number optional
  * Maximum number of seconds to wait to fill a batch with messages. Must be a positive integer.
* `--message-retries` number optional
  * Maximum number of retries for each message. Must be a positive integer.
* `--max-concurrency` number optional
  * The maximum number of concurrent consumer invocations that will be scaled up to handle incoming message volume. Must be a positive integer.
* `--retry-delay-secs` number optional
  * How long a retried message should be delayed for, in seconds. Must be a positive integer.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `consumer remove`

Remove a consumer from a queue.

```txt
wrangler queues consumer remove <queue-name> <script-name>
```

* `queue-name` string required
  * The name of the queue to remove the consumer from.
* `script-name` string required
  * The name of the Workers script to remove as the consumer.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `purge`

Permanently delete all messages in a queue.

```txt
wrangler queues purge <queue-name>
```

* `queue-name` string required
  * The name of the queue from which messages should be deleted.

### `pause-delivery`

Pause message delivery from a Queue to consumers (including push consumers, and HTTP pull consumers)

```txt
wrangler queues pause-delivery <queue-name>
```

* `queue-name` string required
  * The name of the queue which delivery should be paused.

### `resume-delivery`

Resume delivery from a Queue to consumers (including push consumers, and HTTP pull consumers)

```txt
wrangler queues resume-delivery <queue-name>
```

* `queue-name` string required
  * The name of the queue from which delivery should be resumed.

### `subscription create`

Create a new [event subscription](https://developers.cloudflare.com/queues/event-subscriptions/) for a queue.

```txt
wrangler queues subscription create <queue-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue to create the subscription for.
* `--source` string required
  * The event source type. Supported sources: `kv`, `r2`, `superSlurper`, `vectorize`, `workersAi.model`, `workersBuilds.worker`, `workflows.workflow`.
* `--events` string required
  * Comma-separated list of event types to subscribe to. Refer to [Events & schemas](https://developers.cloudflare.com/queues/event-subscriptions/events-schemas/) for a complete list of all supported events.
* `--name` string optional
  * Name for the subscription. Auto-generated if not provided.
* `--enabled` boolean optional
  * Whether the subscription should be active. Defaults to true.
* Additional source-specific options (e.g., `--worker-name` for workersBuilds.worker, `--bucket-name` for r2.bucket).

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `subscription list`

List all [event subscriptions](https://developers.cloudflare.com/queues/event-subscriptions/) for a queue.

```txt
wrangler queues subscription list <queue-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue to list subscriptions for.
* `--page` number optional
  * Show a specific page from the listing. You can configure page size using "per-page".
* `--per-page` number optional
  * Configure the maximum number of subscriptions to show per page.
* `--json` boolean optional
  * Output in JSON format.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `subscription get`

Get details about a specific [event subscription](https://developers.cloudflare.com/queues/event-subscriptions/).

```txt
wrangler queues subscription get <queue-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue.
* `--id` string required
  * The ID of the subscription to retrieve.
* `--json` boolean optional
  * Output in JSON format.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `subscription update`

Update an existing [event subscription](https://developers.cloudflare.com/queues/event-subscriptions/).

```txt
wrangler queues subscription update <queue-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue.
* `--id` string required
  * The ID of the subscription to update.
* `--name` string optional
  * New name for the subscription.
* `--events` string optional
  * Comma-separated list of event types to subscribe to.
* `--enabled` boolean optional
  * Whether the subscription should be active.
* `--json` boolean optional
  * Output in JSON format.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.

### `subscription delete`

Delete an [event subscription](https://developers.cloudflare.com/queues/event-subscriptions/).

```txt
wrangler queues subscription delete <queue-name> [OPTIONS]
```

* `queue-name` string required
  * The name of the queue.
* `--id` string required
  * The ID of the subscription to delete.
* `--force` boolean optional
  * Skip confirmation prompt.

The following global flags work on every command:

* `--help` boolean
  * Show help.
* `--config` string (not supported by Pages)
  * Path to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).
* `--cwd` string
  * Run as if Wrangler was started in the specified directory instead of the current working directory.
