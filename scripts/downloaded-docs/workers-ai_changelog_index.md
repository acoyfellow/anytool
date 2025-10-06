---
title: Changelog · Cloudflare Workers AI docs
description: Review recent changes to Cloudflare Workers AI.
lastUpdated: 2025-04-03T16:21:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/changelog/
  md: https://developers.cloudflare.com/workers-ai/changelog/index.md
---

[Subscribe to RSS](https://developers.cloudflare.com/workers-ai/changelog/index.xml)

## 2025-10-02

**Deepgram Flux now available on Workers AI**

* We're excited to be a launch partner with Deepgram and offer their new Speech Recognition model built specifically for enabling voice agents. Check out [Deepgram's blog](https://deepgram.com/flux) for more details on the release.
* Access the model through [`@cf/deepgram/flux`](https://developers.cloudflare.com/workers-ai/models/flux/) and check out the [changelog](https://developers.cloudflare.com/changelog/2025-10-02-deepgram-flux/) for in-depth examples.

## 2025-09-24

**New local models available on Workers AI**

* We've added support for some regional models on Workers AI in support of uplifting local AI labs and AI sovereignty. Check out the [full blog post here](https://blog.cloudflare.com/sovereign-ai-and-choice).
* [`@cf/pfnet/plamo-embedding-1b`](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b) creates embeddings from Japanese text.
* [`@cf/aisingapore/gemma-sea-lion-v4-27b-it`](https://developers.cloudflare.com/workers-ai/models/gemma-sea-lion-v4-27b-it) is a fine-tuned model that supports multiple South East Asian languages, including Burmese, English, Indonesian, Khmer, Lao, Malay, Mandarin, Tagalog, Tamil, Thai, and Vietnamese.
* [`@cf/ai4bharat/indictrans2-en-indic-1B`](https://developers.cloudflare.com/workers-ai/models/indictrans2-en-indic-1B) is a translation model that can translate between 22 indic languages, including Bengali, Gujarati, Hindi, Tamil, Sanskrit and even traditionally low-resourced languages like Kashmiri, Manipuri and Sindhi.

## 2025-09-23

**New document formats supported by Markdown conversion utility**

* Our [Markdown conversion utility](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/) now supports converting `.docx` and `.odt` files.

## 2025-09-18

**Model Catalog updates (types, EmbeddingGemma, model deprecation)**

* Workers AI types got updated in the upcoming wrangler release, please use `npm i -D wrangler@latest` to update your packages.

* EmbeddingGemma model accuracy has been improved, we recommend re-indexing data to take advantage of the improved accuracy

* Some older Workers AI models are being deprecated on October 1st, 2025. We reccommend you use the newer models such as [Llama 4](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) and [gpt-oss](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/). The following models are being deprecated:

  * @hf/thebloke/zephyr-7b-beta-awq
  * @hf/thebloke/mistral-7b-instruct-v0.1-awq
  * @hf/thebloke/llama-2-13b-chat-awq
  * @hf/thebloke/openhermes-2.5-mistral-7b-awq
  * @hf/thebloke/neural-chat-7b-v3-1-awq
  * @hf/thebloke/llamaguard-7b-awq
  * @hf/thebloke/deepseek-coder-6.7b-base-awq
  * @hf/thebloke/deepseek-coder-6.7b-instruct-awq
  * @cf/deepseek-ai/deepseek-math-7b-instruct
  * @cf/openchat/openchat-3.5-0106
  * @cf/tiiuae/falcon-7b-instruct
  * @cf/thebloke/discolm-german-7b-v1-awq
  * @cf/qwen/qwen1.5-0.5b-chat
  * @cf/qwen/qwen1.5-7b-chat-awq
  * @cf/qwen/qwen1.5-14b-chat-awq
  * @cf/tinyllama/tinyllama-1.1b-chat-v1.0
  * @cf/qwen/qwen1.5-1.8b-chat
  * @hf/nexusflow/starling-lm-7b-beta
  * @cf/fblgit/una-cybertron-7b-v2-bf16

## 2025-09-05

**Introducing EmbeddingGemma from Google**

* We’re excited to be a launch partner alongside Google to bring their newest embedding model to Workers AI. We're excited to introduce EmbeddingGemma delivers best-in-class performance for its size, enabling RAG and semantic search use cases. Take a look at [`@cf/google/embeddinggemma-300m`](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-300m) for more details. Now available to use for embedding in AI Search too.

## 2025-08-27

**Introducing Partner models to the Workers AI catalog**

* Read the [blog](https://blog.cloudflare.com/workers-ai-partner-models) for more details
* [`@cf/deepgram/aura-1`](https://developers.cloudflare.com/workers-ai/models/aura-1) is a text-to-speech model that allows you to input text and have it come to life in a customizable voice
* [`@cf/deepgram/nova-3`](https://developers.cloudflare.com/workers-ai/models/nova-3) is speech-to-text model that transcribes multilingual audio at a blazingly fast speed
* [`@cf/pipecat-ai/smart-turn-v2`](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2) helps you detect when someone is done speaking
* [`@cf/leonardo/lucid-origin`](https://developers.cloudflare.com/workers-ai/models/lucid-origin) is a text-to-image model that generates images with sharp graphic design, stunning full-HD renders, or highly specific creative direction
* [`@cf/leonardo/phoenix-1.0`](https://developers.cloudflare.com/workers-ai/models/phoenix-1.0) is a text-to-image model with exceptional prompt adherence and coherent text
* WebSocket support added for audio models like `@cf/deepgram/aura-1`, `@cf/deepgram/nova-3`, `@cf/pipecat-ai/smart-turn-v2`

## 2025-08-05

**Adding gpt-oss models to our catalog**

* Check out the [blog](https://blog.cloudflare.com/openai-gpt-oss-on-workers-ai) for more details about the new models
* Take a look at the [`gpt-oss-120b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b) and [`gpt-oss-20b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b) model pages for more information about schemas, pricing, and context windows

## 2025-04-09

**Pricing correction for @cf/myshell-ai/melotts**

* We've updated our documentation to reflect the correct pricing for melotts: $0.0002 per audio minute, which is actually cheaper than initially stated. The documented pricing was incorrect, where it said users would be charged based on input tokens.

## 2025-03-17

**Minor updates to the model schema for llama-3.2-1b-instruct, whisper-large-v3-turbo, llama-guard**

* [llama-3.2-1b-instruct](https://developers.cloudflare.com/workers-ai/models/llama-3.2-1b-instruct/) - updated context window to the accurate 60,000
* [whisper-large-v3-turbo](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) - new hyperparameters available
* [llama-guard-3-8b](https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/) - the messages array must alternate between `user` and `assistant` to function correctly

## 2025-02-21

**Workers AI bug fixes**

* We fixed a bug where `max_tokens` defaults were not properly being respected - `max_tokens` now correctly defaults to `256` as displayed on the model pages. Users relying on the previous behaviour may observe this as a breaking change. If you want to generate more tokens, please set the `max_tokens` parameter to what you need.
* We updated model pages to show context windows - which is defined as the tokens used in the prompt + tokens used in the response. If your prompt + response tokens exceed the context window, the request will error. Please set `max_tokens` accordingly depending on your prompt length and the context window length to ensure a successful response.

## 2024-09-26

**Workers AI Birthday Week 2024 announcements**

* Meta Llama 3.2 1B, 3B, and 11B vision is now available on Workers AI
* `@cf/black-forest-labs/flux-1-schnell` is now available on Workers AI
* Workers AI is fast! Powered by new GPUs and optimizations, you can expect faster inference on Llama 3.1, Llama 3.2, and FLUX models.
* No more neurons. Workers AI is moving towards [unit-based pricing](https://developers.cloudflare.com/workers-ai/platform/pricing)
* Model pages get a refresh with better documentation on parameters, pricing, and model capabilities
* Closed beta for our Run Any\* Model feature, [sign up here](https://forms.gle/h7FcaTF4Zo5dzNb68)
* Check out the [product announcements blog post](https://blog.cloudflare.com/workers-ai) for more information
* And the [technical blog post](https://blog.cloudflare.com/workers-ai/making-workers-ai-faster) if you want to learn about how we made Workers AI fast

## 2024-07-23

**Meta Llama 3.1 now available on Workers AI**

Workers AI now suppoorts [Meta Llama 3.1](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct/).

## 2024-07-11

**New community-contributed tutorial**

* Added community contributed tutorial on how to [create APIs to recommend products on e-commerce sites using Workers AI and Stripe](https://web.archive.org/web/20250714161553/https://developers.cloudflare.com/developer-spotlight/tutorials/creating-a-recommendation-api/).

## 2024-06-27

**Introducing embedded function calling**

* A new way to do function calling with [Embedded function calling](https://developers.cloudflare.com/workers-ai/function-calling/embedded)
* Published new [`@cloudflare/ai-utils`](https://www.npmjs.com/package/@cloudflare/ai-utils) npm package
* Open-sourced [`ai-utils on Github`](https://github.com/cloudflare/ai-utils)

## 2024-06-19

**Added support for traditional function calling**

* [Function calling](https://developers.cloudflare.com/workers-ai/function-calling/) is now supported on enabled models
* Properties added on [models](https://developers.cloudflare.com/workers-ai/models/) page to show which models support function calling

## 2024-06-18

**Native support for AI Gateways**

Workers AI now natively supports [AI Gateway](https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/#worker).

## 2024-06-11

**Deprecation announcement for \`@cf/meta/llama-2-7b-chat-int8\`**

We will be deprecating `@cf/meta/llama-2-7b-chat-int8` on 2024-06-30.

Replace the model ID in your code with a new model of your choice:

* [`@cf/meta/llama-3-8b-instruct`](https://developers.cloudflare.com/workers-ai/models/llama-3-8b-instruct/) is the newest model in the Llama family (and is currently free for a limited time on Workers AI).
* [`@cf/meta/llama-3-8b-instruct-awq`](https://developers.cloudflare.com/workers-ai/models/llama-3-8b-instruct-awq/) is the new Llama 3 in a similar precision to your currently selected model. This model is also currently free for a limited time.

If you do not switch to a different model by June 30th, we will automatically start returning inference from `@cf/meta/llama-3-8b-instruct-awq`.

## 2024-05-29

**Add new public LoRAs and note on LoRA routing**

* Added documentation on [new public LoRAs](https://developers.cloudflare.com/workers-ai/fine-tunes/public-loras/).
* Noted that you can now run LoRA inference with the base model rather than explicitly calling the `-lora` version

## 2024-05-17

**Add OpenAI compatible API endpoints**

Added OpenAI compatible API endpoints for `/v1/chat/completions` and `/v1/embeddings`. For more details, refer to [Configurations](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/).

## 2024-04-11

**Add AI native binding**

* Added new AI native binding, you can now run models with `const resp = await env.AI.run(modelName, inputs)`
* Deprecated `@cloudflare/ai` npm package. While existing solutions using the @cloudflare/ai package will continue to work, no new Workers AI features will be supported. Moving to native AI bindings is highly recommended
