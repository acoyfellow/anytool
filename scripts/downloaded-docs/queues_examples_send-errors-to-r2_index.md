---
title: Cloudflare Queues - Queues & R2 · Cloudflare Queues docs
description: Example of how to use Queues to batch data and store it in an R2 bucket.
lastUpdated: 2025-01-29T12:28:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/queues/examples/send-errors-to-r2/
  md: https://developers.cloudflare.com/queues/examples/send-errors-to-r2/index.md
---

The following Worker will catch JavaScript errors and send them to a queue. The same Worker will receive those errors in batches and store them to a log file in an R2 bucket.

* wrangler.jsonc

  ```jsonc
  {
    "name": "my-worker",
    "queues": {
      "producers": [
        {
          "queue": "my-queue",
          "binding": "ERROR_QUEUE"
        }
      ],
      "consumers": [
        {
          "queue": "my-queue",
          "max_batch_size": 100,
          "max_batch_timeout": 30
        }
      ]
    },
    "r2_buckets": [
      {
        "bucket_name": "my-bucket",
        "binding": "ERROR_BUCKET"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  name = "my-worker"


  [[queues.producers]]
    queue = "my-queue"
    binding = "ERROR_QUEUE"


  [[queues.consumers]]
    queue = "my-queue"
    max_batch_size = 100
    max_batch_timeout = 30


  [[r2_buckets]]
    bucket_name = "my-bucket"
    binding = "ERROR_BUCKET"
  ```

```ts
type Environment = {
  readonly ERROR_QUEUE: Queue<Error>;
  readonly ERROR_BUCKET: R2Bucket;
};


export default {
  async fetch(req, env): Promise<Response> {
    try {
      return doRequest(req);
    } catch (error) {
      await env.ERROR_QUEUE.send(error);
      return new Response(error.message, { status: 500 });
    }
  },
  async queue(batch, env): Promise<void> {
    let file = '';
    for (const message of batch.messages) {
      const error = message.body;
      file += error.stack || error.message || String(error);
      file += '\r\n';
    }
    await env.ERROR_BUCKET.put(`errors/${Date.now()}.log`, file);
  },
} satisfies ExportedHandler<Environment, Error>;


function doRequest(request: Request): Promise<Response> {
  if (Math.random() > 0.5) {
    return new Response('Success!');
  }
  throw new Error('Failed!');
}
```
