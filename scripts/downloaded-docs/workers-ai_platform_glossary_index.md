---
title: Glossary · Cloudflare Workers AI docs
description: Review the definitions for terms used across Cloudflare's Workers
  AI documentation.
lastUpdated: 2025-04-03T16:21:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/platform/glossary/
  md: https://developers.cloudflare.com/workers-ai/platform/glossary/index.md
---

Review the definitions for terms used across Cloudflare's Workers AI documentation.

| Term | Definition |
| - | - |
| AI models | [An AI model](https://developers.cloudflare.com/workers-ai/models) is a trained system that processes input data to generate predictions, decisions, or outputs based on patterns it has learned. |
| API Tokens | [API Tokens](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) are authentication credentials used to securely access and manage Workers AI resources via the REST API. |
| Cloudflare Dashboard | [Cloudflare Dashboard](https://developers.cloudflare.com/workers-ai/get-started/dashboard/) is a web-based interface that allows users to manage Workers AI services, including model deployment and monitoring. |
| Context Window | In generative AI, the context window is the sum of the number of input, reasoning, and completion or response tokens a model supports. You can find the context window limit on each [model page](https://developers.cloudflare.com/workers-ai/models/). |
| D1 | [D1](https://developers.cloudflare.com/d1/) is Cloudflare's managed, serverless database with SQLite's SQL semantics, built-in disaster recovery, and Worker and HTTP API access. |
| Environment Variables | [Environment Variables](https://developers.cloudflare.com/workers-ai/configuration/bindings/) are dynamic values that can be used within Workers to manage configuration settings, including those related to AI integrations. |
| Fine-Tuning | [Fine-Tuning](https://developers.cloudflare.com/workers-ai/fine-tunes/) is a general term for modifying an AI model by continuing to train it with additional data. |
| Function Calling | [Function Calling](https://developers.cloudflare.com/workers-ai/function-calling/) enables people to take Large Language Models (LLMs) and use the model response to execute functions or interact with external APIs. |
| Inference | [Inference](https://developers.cloudflare.com/workers-ai/fine-tunes/public-loras/#running-inference-with-public-loras) refers to the process of using a trained machine learning model to make predictions or generate outputs based on new data. |
| LoRA Adapters | [LoRA Adapters](https://developers.cloudflare.com/workers-ai/fine-tunes/loras/) (Low-Rank Adaptation adapters) are used in machine learning to fine-tune models efficiently by adjusting a small number of parameters, allowing for customization of AI models in Workers AI.[Public LoRA Adapters](https://developers.cloudflare.com/workers-ai/fine-tunes/public-loras/) are pre-trained Low-Rank Adaptation adapters available for public use. |
| Maximum Tokens | In generative AI, the user-defined property `max_tokens` defines the maximum number of tokens at which the model should stop responding. This limit cannot exceed the context window. |
| Model Catalog | [Model Catalog](https://developers.cloudflare.com/workers-ai/models/) is a curated collection of AI models available within Workers AI, providing developers with a variety of pre-trained models for different tasks. |
| Prompt Engineering | [Prompt Engineering](https://developers.cloudflare.com/workers-ai/guides/prompting/) is the practice of designing and refining input prompts to effectively elicit desired responses from AI models. |
| Prompt Templates | [Prompt Templates](https://developers.cloudflare.com/workers-ai/guides/prompting/) are predefined structures that guide the input provided to AI models, enhancing consistency and effectiveness in responses. |
| REST API | [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) is an application programming interface that allows developers to interact with Workers AI services over HTTP, enabling model management and inference requests. |
| Serverless GPUs | [Serverless GPUs](https://developers.cloudflare.com/workers-ai/) are graphics processing units provided by Cloudflare in a serverless environment, enabling scalable and efficient execution of machine learning models without the need for managing underlying hardware. |
| Worker Bindings | [Worker Bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/) are configurations that connect Workers scripts to external resources, such as AI models, enabling seamless integration and functionality. |
| Workers AI | [Workers AI](https://developers.cloudflare.com/workers-ai/) is a Cloudflare service that enables running machine learning models on Cloudflare's global network, utilizing serverless GPUs. It allows developers to integrate AI capabilities into their applications using Workers, Pages, or via the REST API. |
| Workers KV | [Workers KV](https://developers.cloudflare.com/kv/)is a data storage that allows you to store and retrieve data globally. |
| Wrangler CLI | [Wrangler CLI](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/) is a command-line tool for building and deploying Cloudflare Workers, facilitating the integration of AI models into applications. |
