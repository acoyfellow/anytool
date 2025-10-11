---
title: How AI Search works · Cloudflare AI Search docs
description: AI Search (formerly AutoRAG) is Cloudflare’s managed search
  service. You can connect your data such as websites or unstructured content,
  and it automatically creates a continuously updating index that you can query
  with natural language in your applications or AI agents.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/concepts/how-ai-search-works/
  md: https://developers.cloudflare.com/ai-search/concepts/how-ai-search-works/index.md
---

AI Search (formerly AutoRAG) is Cloudflare’s managed search service. You can connect your data such as websites or unstructured content, and it automatically creates a continuously updating index that you can query with natural language in your applications or AI agents.

AI Search consists of two core processes:

* **Indexing:** An asynchronous background process that monitors your data source for changes and converts your data into vectors for search.
* **Querying:** A synchronous process triggered by user queries. It retrieves the most relevant content and generates context-aware responses.

## How indexing works

Indexing begins automatically when you create an AI Search instance and connect a data source.

Here is what happens during indexing:

1. **Data ingestion:** AI Search reads from your connected data source.
2. **Markdown conversion:** AI Search uses [Workers AI’s Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) to convert [supported data types](https://developers.cloudflare.com/ai-search/configuration/data-source/) into structured Markdown. This ensures consistency across diverse file types. For images, Workers AI is used to perform object detection followed by vision-to-language transformation to convert images into Markdown text.
3. **Chunking:** The extracted text is [chunked](https://developers.cloudflare.com/ai-search/configuration/chunking/) into smaller pieces to improve retrieval granularity.
4. **Embedding:** Each chunk is embedded using Workers AI’s embedding model to transform the content into vectors.
5. **Vector storage:** The resulting vectors, along with metadata like file name, are stored in a the [Vectorize](https://developers.cloudflare.com/vectorize/) database created on your Cloudflare account.

After the initial data set is indexed, AI Search will regularly check for updates in your data source (e.g. additions, updates, or deletes) and index changes to ensure your vector database is up to date.

![Indexing](https://developers.cloudflare.com/_astro/indexing.CQ13F9Js_1Pewmk.webp)

## How querying works

Once indexing is complete, AI Search is ready to respond to end-user queries in real time.

Here is how the querying pipeline works:

1. **Receive query from AI Search API:** The query workflow begins when you send a request to either the AI Search’s [AI Search](https://developers.cloudflare.com/ai-search/usage/rest-api/#ai-search) or [Search](https://developers.cloudflare.com/ai-search/usage/rest-api/#search) endpoints.
2. **Query rewriting (optional):** AI Search provides the option to [rewrite the input query](https://developers.cloudflare.com/ai-search/configuration/query-rewriting/) using one of Workers AI’s LLMs to improve retrieval quality by transforming the original query into a more effective search query.
3. **Embedding the query:** The rewritten (or original) query is transformed into a vector via the same embedding model used to embed your data so that it can be compared against your vectorized data to find the most relevant matches.
4. **Querying Vectorize index:** The query vector is [queried](https://developers.cloudflare.com/vectorize/best-practices/query-vectors/) against stored vectors in the associated Vectorize database for your AI Search.
5. **Content retrieval:** Vectorize returns the metadata of the most relevant chunks, and the original content is retrieved from the R2 bucket. If you are using the Search endpoint, the content is returned at this point.
6. **Response generation:** If you are using the AI Search endpoint, then a text-generation model from Workers AI is used to generate a response using the retrieved content and the original user’s query, combined via a [system prompt](https://developers.cloudflare.com/ai-search/configuration/system-prompt/). The context-aware response from the model is returned.

![Querying](https://developers.cloudflare.com/_astro/querying.c_RrR1YL_Z1CePPB.webp)
