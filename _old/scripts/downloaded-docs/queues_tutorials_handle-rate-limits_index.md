---
title: Cloudflare Queues - Queues & Rate Limits · Cloudflare Queues docs
description: Example of how to use Queues to handle rate limits of external APIs.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
tags: TypeScript
source_url:
  html: https://developers.cloudflare.com/queues/tutorials/handle-rate-limits/
  md: https://developers.cloudflare.com/queues/tutorials/handle-rate-limits/index.md
---

This tutorial explains how to use Queues to handle rate limits of external APIs by building an application that sends email notifications using [Resend](https://www.resend.com/). However, you can use this pattern to handle rate limits of any external API.

Resend is a service that allows you to send emails from your application via an API. Resend has a default [rate limit](https://resend.com/docs/api-reference/introduction#rate-limit) of two requests per second. You will use Queues to handle the rate limit of Resend.

## Prerequisites

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
2. Install [`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), discussed later in this guide, requires a Node version of `16.17.0` or later.

1. Sign up for [Resend](https://resend.com/) and generate an API key by following the guide on the [Resend documentation](https://resend.com/docs/dashboard/api-keys/introduction).

2. Additionally, you will need access to Cloudflare Queues.

Queues are included in the monthly subscription cost of your Workers Paid plan, and charges based on operations against your queues. Refer to [Pricing](https://developers.cloudflare.com/queues/platform/pricing/) for more details.

Before you can use Queues, you must enable it via [the Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/queues). You need a Workers Paid plan to enable Queues.

To enable Queues:

1. In the Cloudflare dashboard, go to the **Queues** page.

   [Go to **Queues**](https://dash.cloudflare.com/?to=/:account/workers/queues)

2. Select **Enable Queues**.

## 1. Create a new Workers application

To get started, create a Worker application using the [`create-cloudflare` CLI](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare). Open a terminal window and run the following command:

* npm

  ```sh
  npm create cloudflare@latest -- resend-rate-limit-queue
  ```

* yarn

  ```sh
  yarn create cloudflare resend-rate-limit-queue
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest resend-rate-limit-queue
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `Worker only`.
* For *Which language do you want to use?*, choose `TypeScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

Then, go to your newly created directory:

```sh
cd resend-rate-limit-queue
```

## 2. Set up a Queue

You need to create a Queue and a binding to your Worker. Run the following command to create a Queue named `rate-limit-queue`:

```sh
npx wrangler queues create rate-limit-queue
```

```sh
Creating queue rate-limit-queue.
Created queue rate-limit-queue.
```

### Add Queue bindings to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/)

In your Wrangler file, add the following:

* wrangler.jsonc

  ```jsonc
  {
    "queues": {
      "producers": [
        {
          "binding": "EMAIL_QUEUE",
          "queue": "rate-limit-queue"
        }
      ],
      "consumers": [
        {
          "queue": "rate-limit-queue",
          "max_batch_size": 2,
          "max_batch_timeout": 10,
          "max_retries": 3
        }
      ]
    }
  }
  ```

* wrangler.toml

  ```toml
  [[queues.producers]]
  binding = "EMAIL_QUEUE"
  queue = "rate-limit-queue"


  [[queues.consumers]]
  queue = "rate-limit-queue"
  max_batch_size = 2
  max_batch_timeout = 10
  max_retries = 3
  ```

It is important to include the `max_batch_size` of two to the consumer queue is important because the Resend API has a default rate limit of two requests per second. This batch size allows the queue to process the message in the batch size of two. If the batch size is less than two, the queue will wait for 10 seconds to collect the next message. If no more messages are available, the queue will process the message in the batch. For more information, refer to the [Batching, Retries and Delays documentation](https://developers.cloudflare.com/queues/configuration/batching-retries)

Your final Wrangler file should look similar to the example below.

* wrangler.jsonc

  ```jsonc
  {
    "name": "resend-rate-limit-queue",
    "main": "src/index.ts",
    "compatibility_date": "2024-09-09",
    "compatibility_flags": [
      "nodejs_compat"
    ],
    "queues": {
      "producers": [
        {
          "binding": "EMAIL_QUEUE",
          "queue": "rate-limit-queue"
        }
      ],
      "consumers": [
        {
          "queue": "rate-limit-queue",
          "max_batch_size": 2,
          "max_batch_timeout": 10,
          "max_retries": 3
        }
      ]
    }
  }
  ```

* wrangler.toml

  ```toml
  #:schema node_modules/wrangler/config-schema.json
  name = "resend-rate-limit-queue"
  main = "src/index.ts"
  compatibility_date = "2024-09-09"
  compatibility_flags = ["nodejs_compat"]


  [[queues.producers]]
  binding = "EMAIL_QUEUE"
  queue = "rate-limit-queue"


  [[queues.consumers]]
  queue = "rate-limit-queue"
  max_batch_size = 2
  max_batch_timeout = 10
  max_retries = 3
  ```

## 3. Add bindings to environment

Add the bindings to the environment interface in `worker-configuration.d.ts`, so TypeScript correctly types the bindings. Type the queue as `Queue<any>`. Refer to the following step for instructions on how to change this type.

```ts
interface Env {
  EMAIL_QUEUE: Queue<any>;
}
```

## 4. Send message to the queue

The application will send a message to the queue when the Worker receives a request. For simplicity, you will send the email address as a message to the queue. A new message will be sent to the queue with a delay of one second.

```ts
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      await env.EMAIL_QUEUE.send(
        { email: await req.text() },
        { delaySeconds: 1 },
      );
      return new Response("Success!");
    } catch (e) {
      return new Response("Error!", { status: 500 });
    }
  },
};
```

This will accept requests to any subpath and forwards the request's body. It expects that the request body to contain only an email. In production, you should check that the request was a `POST` request. You should also avoid sending such sensitive information (email) directly to the queue. Instead, you can send a message to the queue that contains a unique identifier for the user. Then, your consumer queue can use the unique identifier to look up the email address in a database and use that to send the email.

## 5. Process the messages in the queue

After the message is sent to the queue, it will be processed by the consumer Worker. The consumer Worker will process the message and send the email.

Since you have not configured Resend yet, you will log the message to the console. After you configure Resend, you will use it to send the email.

Add the `queue()` handler as shown below:

```ts
interface Message {
  email: string;
}


export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      await env.EMAIL_QUEUE.send(
        { email: await req.text() },
        { delaySeconds: 1 },
      );
      return new Response("Success!");
    } catch (e) {
      return new Response("Error!", { status: 500 });
    }
  },
  async queue(batch: MessageBatch<Message>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        console.log(message.body.email);
        // After configuring Resend, you can send email
        message.ack();
      } catch (e) {
        console.error(e);
        message.retry({ delaySeconds: 5 });
      }
    }
  },
};
```

The above `queue()` handler will log the email address to the console and send the email. It will also retry the message if sending the email fails. The `delaySeconds` is set to five seconds to avoid sending the email too quickly.

To test the application, run the following command:

```sh
npm run dev
```

Use the following cURL command to send a request to the application:

```sh
curl -X POST -d "test@example.com" http://localhost:8787/
```

```sh
[wrangler:inf] POST / 200 OK (2ms)
QueueMessage {
  attempts: 1,
  body: { email: 'test@example.com' },
  timestamp: 2024-09-12T13:48:07.236Z,
  id: '72a25ff18dd441f5acb6086b9ce87c8c'
}
```

## 6. Set up Resend

To call the Resend API, you need to configure the Resend API key. Create a `.dev.vars` file in the root of your project and add the following:

```txt
RESEND_API_KEY='your-resend-api-key'
```

Replace `your-resend-api-key` with your actual Resend API key.

Next, update the `Env` interface in `worker-configuration.d.ts` to include the `RESEND_API_KEY` variable.

```ts
interface Env {
  EMAIL_QUEUE: Queue<any>;
  RESEND_API_KEY: string;
}
```

Lastly, install the [`resend` package](https://www.npmjs.com/package/resend) using the following command:

* npm

  ```sh
  npm i resend
  ```

* yarn

  ```sh
  yarn add resend
  ```

* pnpm

  ```sh
  pnpm add resend
  ```

You can now use the `RESEND_API_KEY` variable in your code.

## 7. Send email with Resend

In your `src/index.ts` file, import the Resend package and update the `queue()` handler to send the email.

```ts
import { Resend } from "resend";


interface Message {
  email: string;
}


export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      await env.EMAIL_QUEUE.send(
        { email: await req.text() },
        { delaySeconds: 1 },
      );
      return new Response("Success!");
    } catch (e) {
      return new Response("Error!", { status: 500 });
    }
  },
  async queue(batch: MessageBatch<Message>, env: Env): Promise<void> {
    // Initialize Resend
    const resend = new Resend(env.RESEND_API_KEY);
    for (const message of batch.messages) {
      try {
        console.log(message.body.email);
        // send email
        const sendEmail = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [message.body.email],
          subject: "Hello World",
          html: "<strong>Sending an email from Worker!</strong>",
        });


        // check if the email failed
        if (sendEmail.error) {
          console.error(sendEmail.error);
          message.retry({ delaySeconds: 5 });
        } else {
          // if success, ack the message
          message.ack();
        }
        message.ack();
      } catch (e) {
        console.error(e);
        message.retry({ delaySeconds: 5 });
      }
    }
  },
};
```

The `queue()` handler will now send the email using the Resend API. It also checks if sending the email failed and will retry the message.

The final script is included below:

```ts
import { Resend } from "resend";


interface Message {
  email: string;
}


export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      await env.EMAIL_QUEUE.send(
        { email: await req.text() },
        { delaySeconds: 1 },
      );
      return new Response("Success!");
    } catch (e) {
      return new Response("Error!", { status: 500 });
    }
  },
  async queue(batch: MessageBatch<Message>, env: Env): Promise<void> {
    // Initialize Resend
    const resend = new Resend(env.RESEND_API_KEY);
    for (const message of batch.messages) {
      try {
        // send email
        const sendEmail = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [message.body.email],
          subject: "Hello World",
          html: "<strong>Sending an email from Worker!</strong>",
        });


        // check if the email failed
        if (sendEmail.error) {
          console.error(sendEmail.error);
          message.retry({ delaySeconds: 5 });
        } else {
          // if success, ack the message
          message.ack();
        }
      } catch (e) {
        console.error(e);
        message.retry({ delaySeconds: 5 });
      }
    }
  },
};
```

To test the application, start the development server using the following command:

```sh
npm run dev
```

Use the following cURL command to send a request to the application:

```sh
curl -X POST -d "delivered@resend.dev" http://localhost:8787/
```

On the Resend dashboard, you should see that the email was sent to the provided email address.

## 8. Deploy your Worker

To deploy your Worker, run the following command:

```sh
npx wrangler deploy
```

Lastly, add the Resend API key using the following command:

```sh
npx wrangler secret put RESEND_API_KEY
```

Enter the value of your API key. Your API key will get added to your project. You can now use the `RESEND_API_KEY` variable in your code.

You have successfully created a Worker which can send emails using the Resend API respecting rate limits.

To test your Worker, you could use the following cURL request. Replace `<YOUR_WORKER_URL>` with the URL of your deployed Worker.

```bash
curl -X POST -d "delivered@resend.dev" <YOUR_WORKER_URL>
```

Refer to the [GitHub repository](https://github.com/harshil1712/queues-rate-limit) for the complete code for this tutorial. If you are using [Hono](https://hono.dev/), you can refer to the [Hono example](https://github.com/harshil1712/resend-rate-limit-demo).

## Related resources

* [How Queues works](https://developers.cloudflare.com/queues/reference/how-queues-works/)
* [Queues Batching and Retries](https://developers.cloudflare.com/queues/configuration/batching-retries/)
* [Resend](https://resend.com/docs/)
