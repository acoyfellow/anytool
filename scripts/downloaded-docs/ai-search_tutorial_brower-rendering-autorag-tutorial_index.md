---
title: Build a RAG from your website · Cloudflare AI Search docs
description: AI Search is designed to work out of the box with data in R2
  buckets. But what if your content lives on a website or needs to be rendered
  dynamically?
lastUpdated: 2025-09-25T12:33:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/tutorial/brower-rendering-autorag-tutorial/
  md: https://developers.cloudflare.com/ai-search/tutorial/brower-rendering-autorag-tutorial/index.md
---

AI Search is designed to work out of the box with data in R2 buckets. But what if your content lives on a website or needs to be rendered dynamically?

In this tutorial, we’ll walk through how to:

1. Render your website using Cloudflare's Browser Rendering API
2. Store the rendered HTML in R2
3. Connect it to AI Search for querying

Note

AI Search now lets you use your [website](https://developers.cloudflare.com/ai-search/configuration/data-source/website/) as a data source. When enabled, AI Search will automatically crawl and parse your site content for you.

## Step 1. Create a Worker to fetch webpages and upload into R2

We’ll create a Cloudflare Worker that uses Puppeteer to visit your URL, render it, and store the full HTML in your R2 bucket. If you already have an R2 bucket with content you’d like to build a RAG for then you can skip this step.

1. Create a new Worker project named `browser-r2-worker` by running:

```bash
npm create cloudflare@latest -- browser-r2-worker
```

For setup, select the following options:

* For *What would you like to start with*?, choose `Hello World example`.
* For *Which template would you like to use*?, choose `Worker only`.
* For *Which language do you want to use*?, choose `TypeScript`.
* For *Do you want to use git for version control*?, choose `Yes`.
* For *Do you want to deploy your application*?, choose `No` (we will be making some changes before deploying).

1. Install `@cloudflare/puppeteer`, which allows you to control the Browser Rendering instance:

```bash
npm i @cloudflare/puppeteer
```

1. Create a new R2 bucket named `html-bucket` by running:

```bash
npx wrangler r2 bucket create html-bucket
```

1. Add the following configurations to your Wrangler configuration file so your Worker can use browser rendering and your new R2 bucket:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "browser": {
    "binding": "MY_BROWSER",
  },
  "r2_buckets": [
    {
      "binding": "HTML_BUCKET",
      "bucket_name": "html-bucket",
    },
  ],
}
```

1. Replace the contents of `src/index.ts` with the following skeleton script:

* JavaScript

  ```js
  import puppeteer from "@cloudflare/puppeteer";


  // Define our environment bindings
  // Define request body structure
  export default {
    async fetch(request, env) {
      // Only accept POST requests
      if (request.method !== "POST") {
        return new Response("Please send a POST request with a target URL", {
          status: 405,
        });
      }


      // Get URL from request body
      const body = await request.json();
      // Note: Only use this parser for websites you own
      const targetUrl = new URL(body.url);


      // Launch browser and create new page
      const browser = await puppeteer.launch(env.MY_BROWSER);
      const page = await browser.newPage();


      // Navigate to the page and fetch its html
      await page.goto(targetUrl.href);
      const htmlPage = await page.content();


      // Create filename and store in R2
      const key = targetUrl.hostname + "_" + Date.now() + ".html";
      await env.HTML_BUCKET.put(key, htmlPage);


      // Close browser
      await browser.close();


      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Page rendered and stored successfully",
          key: key,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    },
  };
  ```

* TypeScript

  ```ts
  import puppeteer from "@cloudflare/puppeteer";


  // Define our environment bindings
  interface Env {
    MY_BROWSER: any;
    HTML_BUCKET: R2Bucket;
  }


  // Define request body structure
  interface RequestBody {
    url: string;
  }


  export default {
    async fetch(request: Request, env: Env): Promise<Response> {
      // Only accept POST requests
      if (request.method !== "POST") {
        return new Response("Please send a POST request with a target URL", {
          status: 405,
        });
      }


      // Get URL from request body
      const body = (await request.json()) as RequestBody;
      // Note: Only use this parser for websites you own
      const targetUrl = new URL(body.url);


      // Launch browser and create new page
      const browser = await puppeteer.launch(env.MY_BROWSER);
      const page = await browser.newPage();


      // Navigate to the page and fetch its html
      await page.goto(targetUrl.href);
      const htmlPage = await page.content();


      // Create filename and store in R2
      const key = targetUrl.hostname + "_" + Date.now() + ".html";
      await env.HTML_BUCKET.put(key, htmlPage);


      // Close browser
      await browser.close();


      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Page rendered and stored successfully",
          key: key,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    },
  } satisfies ExportedHandler<Env>;
  ```

1. Once the code is ready, you can deploy it to your Cloudflare account by running:

```bash
npx wrangler deploy
```

1. To test your Worker, you can use the following cURL request to fetch the HTML file of a page. In this example we are fetching this page to upload into the `html-bucket` bucket:

```bash
curl -X POST https://browser-r2-worker.<YOUR_SUBDOMAIN>.workers.dev \
-H "Content-Type: application/json" \
-d '{"url": "https://developers.cloudflare.com/ai-search/tutorial/brower-rendering-autorag-tutorial/"}'
```

## Step 2. Create your AI Search and monitor the indexing

Now that you have created your R2 bucket and filled it with your content that you’d like to query from, you are ready to create an AI Search instance:

1. In your [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/ai/autorag), navigate to AI > AI Search

2. Select Create AI Search and complete the setup process:

   1. Select the **R2 bucket** which contains your knowledge base, in this case, select the `html-bucket`.
   2. Select an **embedding model** used to convert your data to vector representation. It is recommended to use the Default.
   3. Select an **LLM** to use to generate your responses. It is recommended to use the Default.
   4. Select or create an **AI Gateway** to monitor and control your model usage.
   5. **Name** your AI Search as `my-rag`
   6. Select or create a **Service API** token to grant AI Search access to create and access resources in your account.

3. Select Create to spin up your AI Search.

Once you’ve created your AI Search, it will automatically create a Vectorize database in your account and begin indexing the data.

## Step 3. Test and add to your application

Once AI Search finishes indexing your content, you’re ready to start asking it questions. You can open up your AI Search instance, navigate to the Playground tab, and ask a question based on your uploaded content, like “What is AI Search?”.

Once you’re happy with the results in the Playground, you can integrate AI Search directly into the application that you are building. If you are using a Worker to build your [RAG application](https://developers.cloudflare.com/ai-search/), then you can use the AI binding to directly call your AI Search:

```jsonc
{
  "ai": {
    "binding": "AI",
  },
}
```

Then, query your AI Search instance from your Worker code by calling the `aiSearch()` method.

```javascript
const answer = await env.AI.autorag("my-rag").aiSearch({
  query: "What is AI Search?",
});
```

For more information on how to add AI Search into your application, go to your AI Search then navigate to Use AI Search for more instructions.
