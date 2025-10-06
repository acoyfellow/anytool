---
title: Release note · Cloudflare AI Search docs
description: Review recent changes to Cloudflare AI Search.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/platform/release-note/
  md: https://developers.cloudflare.com/ai-search/platform/release-note/index.md
---

This release notes section covers regular updates and minor fixes. For major feature releases or significant updates, see the [changelog](https://developers.cloudflare.com/changelog).

## 2025-09-25

**AI Search (formerly AutoRAG) now supports more models**

Connect your provider keys through AI Gateway to use models like from OpenAI and Anthropic for both embeddings and inference. API updates to align with the new name are coming soon, with existing APIs still supported.

## 2025-09-23

**Support document file types in AutoRAG**

Our [conversion utility](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) can now convert `.docx` and `.odt` files to Markdown, making these files available to index inside your AutoRAG instance.

## 2025-08-20

**Increased maximum query results to 50**

The maximum number of results returned from a query has been increased from **20** to **50**. This allows you to surface more relevant matches in a single request.

## 2025-07-16

**Deleted files now removed from index on next sync**

When a file is deleted from your R2 bucket, its corresponding chunks are now automatically removed from the Vectorize index linked to your AI Search instance during the next sync.

## 2025-07-08

**Reduced cooldown between syncs**

The cooldown period between sync jobs has been reduced to **3 minutes**, allowing you to trigger syncs more frequently when updating your data. If a sync is requested during the cooldown window, the dashboard and API now return clear response indicating that the sync cannot proceed due to the cooldown.

## 2025-06-16

**Rich format file size limit increased to 4 MB**

You can now index rich format files (e.g., PDF) up to 4 MB in size, up from the previous 1 MB limit.

## 2025-06-12

**Index processing status displayed on dashboard**

The dashboard now includes a new “Processing” step for the indexing pipeline that displays the files currently being processed.

## 2025-06-12

**Sync AI Search REST API published**

You can now trigger a sync job for an AI Search using the [Sync REST API](https://developers.cloudflare.com/api/resources/ai-search/subresources/rags/methods/sync/). This scans your data source for changes and queues updated or previously errored files for indexing.

## 2025-06-10

**Files modified in the data source will now be updated**

Files modified in your source R2 bucket will now be updated in the AI Search index during the next sync. For example, if you upload a new version of an existing file, the changes will be reflected in the index after the subsequent sync job. Please note that deleted files are not yet removed from the index. We are actively working on this functionality.

## 2025-05-31

**Errored files will now be retried in next sync**

Files that failed to index will now be automatically retried in the next indexing job. For instance, if a file initially failed because it was oversized but was then corrected (e.g. replaced with a file of the same name/key within the size limit), it will be re-attempted during the next scheduled sync.

## 2025-05-31

**Fixed character cutoff in recursive chunking**

Resolved an issue where certain characters (e.g. '#') were being cut off during the recursive chunking and embedding process. This fix ensures complete character processing in the indexing process.

## 2025-05-25

**EU jurisdiction R2 buckets now supported**

AI Search now supports R2 buckets configured with European Union (EU) jurisdiction restrictions. Previously, files in EU-restricted R2 buckets would not index when linked. This issue has been resolved, and all EU-restricted R2 buckets should now function as expected.

## 2025-04-23

**Response streaming in AI Search binding added**

AI Search now supports response streaming in the `AI Search` method of the [Workers binding](https://developers.cloudflare.com/ai-search/usage/workers-binding/), allowing you to stream results as they’re retrieved by setting `stream: true`.

## 2025-04-07

**AI Search is now in open beta!**

AI Search allows developers to create fully-managed retrieval-augmented generation (RAG) pipelines powered by Cloudflare allowing developers to integrate context-aware AI into their applications without managing infrastructure. Get started today on the [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/ai/autorag).
