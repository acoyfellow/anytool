---
title: Supported model types · Cloudflare AI Gateway docs
description: "AI Gateway's Guardrails detects the type of AI model being used
  and applies safety checks accordingly:"
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/guardrails/supported-model-types/
  md: https://developers.cloudflare.com/ai-gateway/features/guardrails/supported-model-types/index.md
---

AI Gateway's Guardrails detects the type of AI model being used and applies safety checks accordingly:

* **Text generation models**: Both prompts and responses are evaluated.
* **Embedding models**: Only the prompt is evaluated, as the response consists of numerical embeddings, which are not meaningful for moderation.
* **Unknown models**: If the model type cannot be determined, only the prompt is evaluated, while the response bypass Guardrails.

Note

Guardrails does not yet support streaming responses. Support for streaming is planned for a future update.
