---
title: Fine-tunes · Cloudflare Workers AI docs
description: Learn how to use Workers AI to get fine-tuned inference.
lastUpdated: 2025-04-03T16:21:18.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/features/fine-tunes/
  md: https://developers.cloudflare.com/workers-ai/features/fine-tunes/index.md
---

Learn how to use Workers AI to get fine-tuned inference.

### Fine-tuned inference with LoRAs

Upload a LoRA adapter and run fine-tuned inference with one of our base models.

[Run inference with LoRAs](https://developers.cloudflare.com/workers-ai/features/fine-tunes/loras/)

***

## What is fine-tuning?

Fine-tuning is a general term for modifying an AI model by continuing to train it with additional data. The goal of fine-tuning is to increase the probability that a generation is similar to your dataset. Training a model from scratch is not practical for many use cases given how expensive and time consuming they can be to train. By fine-tuning an existing pre-trained model, you benefit from its capabilities while also accomplishing your desired task.

[Low-Rank Adaptation](https://arxiv.org/abs/2106.09685) (LoRA) is a specific fine-tuning method that can be applied to various model architectures, not just LLMs. It is common that the pre-trained model weights are directly modified or fused with additional fine-tune weights in traditional fine-tuning methods. LoRA, on the other hand, allows for the fine-tune weights and pre-trained model to remain separate, and for the pre-trained model to remain unchanged. The end result is that you can train models to be more accurate at specific tasks, such as generating code, having a specific personality, or generating images in a specific style.
