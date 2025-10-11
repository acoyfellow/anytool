---
title: Supported models · Cloudflare AI Search docs
description: This page lists all models supported by AI Search and their lifecycle status.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/configuration/models/supported-models/
  md: https://developers.cloudflare.com/ai-search/configuration/models/supported-models/index.md
---

This page lists all models supported by AI Search and their lifecycle status.

Request model support

If you would like to use a model that is not currently supported, reach out to us on [Discord](https://discord.gg/cloudflaredev) to request it.

## Production models

Production models are the actively supported and recommended models that are stable, fully available.

### Text generation

| Provider | Alias | Context window (tokens) |
| - | - | - |
| **Anthropic** | `anthropic/claude-3-7-sonnet` | 200,000 |
| | `anthropic/claude-sonnet-4` | 200,000 |
| | `anthropic/claude-opus-4` | 200,000 |
| | `anthropic/claude-3-5-haiku` | 200,000 |
| **Cerebras** | `cerebras/qwen-3-235b-a22b-instruct` | 64,000 |
| | `cerebras/qwen-3-235b-a22b-thinking` | 65,000 |
| | `cerebras/llama-3.3-70b` | 65,000 |
| | `cerebras/llama-4-maverick-17b-128e-instruct` | 8,000 |
| | `cerebras/llama-4-scout-17b-16e-instruct` | 8,000 |
| | `cerebras/gpt-oss-120b` | 64,000 |
| **Google AI Studio** | `google-ai-studio/gemini-2.5-flash` | 1,048,576 |
| | `google-ai-studio/gemini-2.5-pro` | 1,048,576 |
| **Grok (x.ai)** | `grok/grok-4` | 256,000 |
| **Groq** | `groq/llama-3.3-70b-versatile` | 131,072 |
| | `groq/llama-3.1-8b-instant` | 131,072 |
| **OpenAI** | `openai/gpt-5` | 400,000 |
| | `openai/gpt-5-mini` | 400,000 |
| | `openai/gpt-5-nano` | 400,000 |
| **Workers AI** | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 24,000 |
| | `@cf/meta/llama-3.1-8b-instruct-fast` | 60,000 |
| | `@cf/meta/llama-3.1-8b-instruct-fp8` | 32,000 |
| | `@cf/meta/llama-4-scout-17b-16e-instruct` | 131,000 |

### Embedding

| Provider | Alias | Vector dims | Input tokens | Metric |
| - | - | - | - | - |
| **Google AI Studio** | `google-ai-studio/gemini-embedding-001` | 1,536 | 2048 | cosine |
| **OpenAI** | `openai/text-embedding-3-small` | 1,536 | 8192 | cosine |
| | `openai/text-embedding-3-large` | 1,536 | 8192 | cosine |
| **Workers AI** | `@cf/baai/bge-m3` | 1,024 | 512 | cosine |
| | `@cf/baai/bge-large-en-v1.5` | 1,024 | 512 | cosine |

## Transition models

There are currently no models marked for end-of-life.
