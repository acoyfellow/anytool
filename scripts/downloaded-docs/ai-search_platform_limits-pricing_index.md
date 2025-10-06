---
title: Limits & pricing · Cloudflare AI Search docs
description: "During the open beta, AI Search is free to enable. When you create
  an AI Search instance, it provisions and runs on top of Cloudflare services in
  your account. These resources are billed as part of your Cloudflare usage, and
  includes:"
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/platform/limits-pricing/
  md: https://developers.cloudflare.com/ai-search/platform/limits-pricing/index.md
---

## Pricing

During the open beta, AI Search is **free to enable**. When you create an AI Search instance, it provisions and runs on top of Cloudflare services in your account. These resources are **billed as part of your Cloudflare usage**, and includes:

| Service & Pricing | Description |
| - | - |
| [**R2**](https://developers.cloudflare.com/r2/pricing/) | Stores your source data |
| [**Vectorize**](https://developers.cloudflare.com/vectorize/platform/pricing/) | Stores vector embeddings and powers semantic search |
| [**Workers AI**](https://developers.cloudflare.com/workers-ai/platform/pricing/) | Handles image-to-Markdown conversion, embedding, query rewriting, and response generation |
| [**AI Gateway**](https://developers.cloudflare.com/ai-gateway/reference/pricing/) | Monitors and controls model usage |
| [**Browser Rendering**](https://developers.cloudflare.com/browser-rendering/platform/pricing/) | Loads dynamic JavaScript content during [website](https://developers.cloudflare.com/ai-search/configuration/data-source/website/) crawling with the Render option |

For more information about how each resource is used within AI Search, reference [How AI Search works](https://developers.cloudflare.com/ai-search/concepts/how-ai-search-works/).

## Limits

The following limits currently apply to AI Search during the open beta:

| Limit | Value |
| - | - |
| Max AI Search instances per account | 10 |
| Max files per AI Search | 100,000 |
| Max file size | 4 MB |

These limits are subject to change as AI Search evolves beyond open beta.
