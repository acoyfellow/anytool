---
title: Configuration · Cloudflare AI Search docs
description: You can customize how your AI Search instance indexes your data,
  and retrieves and generates responses for queries. Some settings can be
  updated after the instance is created, while others are fixed at creation
  time.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/configuration/
  md: https://developers.cloudflare.com/ai-search/configuration/index.md
---

You can customize how your AI Search instance indexes your data, and retrieves and generates responses for queries. Some settings can be updated after the instance is created, while others are fixed at creation time.

The table below lists all available configuration options:

| Configuration | Editable after creation | Description |
| - | - | - |
| [Data source](https://developers.cloudflare.com/ai-search/configuration/data-source/) | no | The source where your knowledge base is stored |
| [Chunk size](https://developers.cloudflare.com/ai-search/configuration/chunking/) | yes | Number of tokens per chunk |
| [Chunk overlap](https://developers.cloudflare.com/ai-search/configuration/chunking/) | yes | Number of overlapping tokens between chunks |
| [Embedding model](https://developers.cloudflare.com/ai-search/configuration/models/) | no | Model used to generate vector embeddings |
| [Query rewrite](https://developers.cloudflare.com/ai-search/configuration/query-rewriting/) | yes | Enable or disable query rewriting before retrieval |
| [Query rewrite model](https://developers.cloudflare.com/ai-search/configuration/models/) | yes | Model used for query rewriting |
| [Query rewrite system prompt](https://developers.cloudflare.com/ai-search/configuration/system-prompt/) | yes | Custom system prompt to guide query rewriting behavior |
| [Match threshold](https://developers.cloudflare.com/ai-search/configuration/retrieval-configuration/) | yes | Minimum similarity score required for a vector match |
| [Maximum number of results](https://developers.cloudflare.com/ai-search/configuration/retrieval-configuration/) | yes | Maximum number of vector matches returned (`top_k`) |
| [Generation model](https://developers.cloudflare.com/ai-search/configuration/models/) | yes | Model used to generate the final response |
| [Generation system prompt](https://developers.cloudflare.com/ai-search/configuration/system-prompt/) | yes | Custom system prompt to guide response generation |
| [Similarity caching](https://developers.cloudflare.com/ai-search/configuration/cache/) | yes | Enable or disable caching of responses for similar (not just exact) prompts |
| [Similarity caching threshold](https://developers.cloudflare.com/ai-search/configuration/cache/) | yes | Controls how similar a new prompt must be to a previous one to reuse its cached response |
| [AI Gateway](https://developers.cloudflare.com/ai-gateway) | yes | AI Gateway for monitoring and controlling model usage |
| AI Search name | no | Name of your AI Search instance |
| Service API token | yes | API token granted to AI Search to give it permission to configure resources on your account. |

API token

The Service API token is different from the AI Search API token that you can make to interact with your AI Search. The Service API token is only used by AI Search to get permissions to configure resources on your account.
