---
title: Limits · Cloudflare Workers AI docs
description: Workers AI is now Generally Available. We've updated our rate
  limits to reflect this.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/platform/limits/
  md: https://developers.cloudflare.com/workers-ai/platform/limits/index.md
---

Workers AI is now Generally Available. We've updated our rate limits to reflect this.

Note that model inferences in local mode using Wrangler will also count towards these limits. Beta models may have lower rate limits while we work on performance and scale.

Custom requirements

If you have custom requirements like private custom models or higher limits, complete the [Custom Requirements Form](https://forms.gle/axnnpGDb6xrmR31T6). Cloudflare will contact you with next steps.

Rate limits are default per task type, with some per-model limits defined as follows:

## Rate limits by task type

### [Automatic Speech Recognition](https://developers.cloudflare.com/workers-ai/models/)

* 720 requests per minute

### [Image Classification](https://developers.cloudflare.com/workers-ai/models/)

* 3000 requests per minute

### [Image-to-Text](https://developers.cloudflare.com/workers-ai/models/)

* 720 requests per minute

### [Object Detection](https://developers.cloudflare.com/workers-ai/models/)

* 3000 requests per minute

### [Summarization](https://developers.cloudflare.com/workers-ai/models/)

* 1500 requests per minute

### [Text Classification](https://developers.cloudflare.com/workers-ai/models/)

* 2000 requests per minute

### [Text Embeddings](https://developers.cloudflare.com/workers-ai/models/)

* 3000 requests per minute
* [@cf/baai/bge-large-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/) is 1500 requests per minute

### [Text Generation](https://developers.cloudflare.com/workers-ai/models/)

* 300 requests per minute
* [@hf/thebloke/mistral-7b-instruct-v0.1-awq](https://developers.cloudflare.com/workers-ai/models/mistral-7b-instruct-v0.1-awq/) is 400 requests per minute
* [@cf/microsoft/phi-2](https://developers.cloudflare.com/workers-ai/models/phi-2/) is 720 requests per minute
* [@cf/qwen/qwen1.5-0.5b-chat](https://developers.cloudflare.com/workers-ai/models/qwen1.5-0.5b-chat/) is 1500 requests per minute
* [@cf/qwen/qwen1.5-1.8b-chat](https://developers.cloudflare.com/workers-ai/models/qwen1.5-1.8b-chat/) is 720 requests per minute
* [@cf/qwen/qwen1.5-14b-chat-awq](https://developers.cloudflare.com/workers-ai/models/qwen1.5-14b-chat-awq/) is 150 requests per minute
* [@cf/tinyllama/tinyllama-1.1b-chat-v1.0](https://developers.cloudflare.com/workers-ai/models/tinyllama-1.1b-chat-v1.0/) is 720 requests per minute

### [Text-to-Image](https://developers.cloudflare.com/workers-ai/models/)

* 720 requests per minute
* [@cf/runwayml/stable-diffusion-v1-5-img2img](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-v1-5-img2img/) is 1500 requests per minute

### [Translation](https://developers.cloudflare.com/workers-ai/models/)

* 720 requests per minute
