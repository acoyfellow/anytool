---
title: Get started with AI Search · Cloudflare AI Search docs
description: AI Search (formerly AutoRAG) is Cloudflare’s managed search
  service. You can connect your data such as websites or unstructured content,
  and it automatically creates a continuously updating index that you can query
  with natural language in your applications or AI agents.
lastUpdated: 2025-09-25T15:07:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/get-started/
  md: https://developers.cloudflare.com/ai-search/get-started/index.md
---

AI Search (formerly AutoRAG) is Cloudflare’s managed search service. You can connect your data such as websites or unstructured content, and it automatically creates a continuously updating index that you can query with natural language in your applications or AI agents.

## Prerequisite

AI Search integrates with R2 for storing your data. You must have an **active R2 subscription** before creating your first AI Search. You can purchase the subscription on the Cloudflare R2 dashboard.

[Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

## 1. Create an AI Search

To create a new AI Search:

1. In the Cloudflare dashboard, go to the **AI Search** page.

[Go to **AI Search**](https://dash.cloudflare.com/?to=/:account/ai/ai-search)

1. Select **Create**

2. In Create a RAG, select **Get Started**

3. Then choose how you want to connect your data:

   * **R2 bucket**: Index the content from one of your R2 buckets.
   * **Website**: Provide a domain from your Cloudflare account and AI Search will automatically crawl your site, store the content in R2, and index it.

4. Configure the AI Search and complete the setup process.

5. Select **Create**.

## 2. Monitor indexing

After setup, AI Search creates a Vectorize index in your account and begins indexing the data.

To monitor progress:

1. From the **AI Search** page in the dashboard, locate and select your AI Search.
2. Navigate to the **Overview** page to view the current indexing status.

## 3. Try it out

Once indexing is complete, you can run your first query:

1. From the **AI Search** page in the dashboard, locate and select your AI Search.
2. Navigate to the **Playground** tab.
3. Select **Search with AI** or **Search**.
4. Enter a **query** to test out its response.

## 4. Add to your application

Once you are ready, go to **Connect** for instructions on how to connect AI Search to your application.

There are multiple ways you can connect:

* [Workers Binding](https://developers.cloudflare.com/ai-search/usage/workers-binding/)
* [REST API](https://developers.cloudflare.com/ai-search/usage/rest-api/)
