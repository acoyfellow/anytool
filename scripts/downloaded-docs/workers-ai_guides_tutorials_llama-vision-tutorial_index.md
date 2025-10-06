---
title: Llama 3.2 11B Vision Instruct model on Cloudflare Workers AI · Cloudflare
  Workers AI docs
description: Learn how to use the Llama 3.2 11B Vision Instruct model on
  Cloudflare Workers AI.
lastUpdated: 2025-08-19T18:37:36.000Z
chatbotDeprioritize: false
tags: AI
source_url:
  html: https://developers.cloudflare.com/workers-ai/guides/tutorials/llama-vision-tutorial/
  md: https://developers.cloudflare.com/workers-ai/guides/tutorials/llama-vision-tutorial/index.md
---

## Prerequisites

Before you begin, ensure you have the following:

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up) with Workers and Workers AI enabled.
2. Your `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_AUTH_TOKEN`.
   * You can generate an API token in your Cloudflare dashboard under API Tokens.
3. Node.js installed for working with Cloudflare Workers (optional but recommended).

## 1. Agree to Meta's license

The first time you use the [Llama 3.2 11B Vision Instruct](https://developers.cloudflare.com/workers-ai/models/llama-3.2-11b-vision-instruct) model, you need to agree to Meta's License and Acceptable Use Policy.

```bash
curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/meta/llama-3.2-11b-vision-instruct \
  -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_AUTH_TOKEN" \
  -d '{ "prompt": "agree" }'
```

Replace `$CLOUDFLARE_ACCOUNT_ID` and `$CLOUDFLARE_AUTH_TOKEN` with your actual account ID and token.

## 2. Set up your Cloudflare Worker

1. Create a Worker Project You will create a new Worker project using the `create-cloudflare` CLI (`C3`). This tool simplifies setting up and deploying new applications to Cloudflare.

   Run the following command in your terminal:

* npm

  ```sh
  npm create cloudflare@latest -- llama-vision-tutorial
  ```

* yarn

  ```sh
  yarn create cloudflare llama-vision-tutorial
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest llama-vision-tutorial
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `Worker only`.
* For *Which language do you want to use?*, choose `JavaScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

After completing the setup, a new directory called `llama-vision-tutorial` will be created.

1. Navigate to your application directory Change into the project directory:

   ```bash
   cd llama-vision-tutorial
   ```

2. Project structure Your `llama-vision-tutorial` directory will include:

   * A "Hello World" Worker at `src/index.ts`.
   * A `wrangler.json` configuration file for managing deployment settings.

## 3. Write the Worker code

Edit the `src/index.ts` (or `index.js` if you are not using TypeScript) file and replace the content with the following code:

```javascript
export interface Env {
  AI: Ai;
}


export default {
  async fetch(request, env): Promise<Response> {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Describe the image I'm providing." },
    ];


    // Replace this with your image data encoded as base64 or a URL
    const imageBase64 = "data:image/png;base64,IMAGE_DATA_HERE";


    const response = await env.AI.run("@cf/meta/llama-3.2-11b-vision-instruct", {
      messages,
      image: imageBase64,
    });


    return Response.json(response);
  },
} satisfies ExportedHandler<Env>;
```

## 4. Bind Workers AI to your Worker

1. Open the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) and add the following configuration:

* wrangler.jsonc

  ```jsonc
  {
    "env": {},
    "ai": {
      "binding": "AI"
    }
  }
  ```

* wrangler.toml

  ```toml
  [env]
  [ai]
  binding="AI"
  ```

1. Save the file.

## 5. Deploy the Worker

Run the following command to deploy your Worker:

```bash
wrangler deploy
```

## 6. Test Your Worker

1. After deployment, you will receive a unique URL for your Worker (e.g., `https://llama-vision-tutorial.<your-subdomain>.workers.dev`).
2. Use a tool like `curl` or Postman to send a request to your Worker:

```bash
curl -X POST https://llama-vision-tutorial.<your-subdomain>.workers.dev \
  -d '{ "image": "BASE64_ENCODED_IMAGE" }'
```

Replace `BASE64_ENCODED_IMAGE` with an actual base64-encoded image string.

## 7. Verify the response

The response will include the output from the model, such as a description or answer to your prompt based on the image provided.

Example response:

```json
{
  "result": "This is a golden retriever sitting in a grassy park."
}
```
