---
title: Usage considerations · Cloudflare AI Gateway docs
description: Guardrails currently uses Llama Guard 3 8B on Workers AI to perform
  content evaluations. The underlying model may be updated in the future, and we
  will reflect those changes within Guardrails.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/guardrails/usage-considerations/
  md: https://developers.cloudflare.com/ai-gateway/features/guardrails/usage-considerations/index.md
---

Guardrails currently uses [Llama Guard 3 8B](https://ai.meta.com/research/publications/llama-guard-llm-based-input-output-safeguard-for-human-ai-conversations/) on [Workers AI](https://developers.cloudflare.com/workers-ai/) to perform content evaluations. The underlying model may be updated in the future, and we will reflect those changes within Guardrails.

Since Guardrails runs on Workers AI, enabling it incurs usage on Workers AI. You can monitor usage through the Workers AI Dashboard.

## Additional considerations

* **Model availability**: If at least one hazard category is set to `block`, but AI Gateway is unable to receive a response from Workers AI, the request will be blocked. Conversely, if a hazard category is set to `flag` and AI Gateway cannot obtain a response from Workers AI, the request will proceed without evaluation. This approach prioritizes availability, allowing requests to continue even when content evaluation is not possible.
* **Latency impact**: Enabling Guardrails adds some latency. Enabling Guardrails introduces additional latency to requests. Typically, evaluations using Llama Guard 3 8B on Workers AI add approximately 500 milliseconds per request. However, larger requests may experience increased latency, though this increase is not linear. Consider this when balancing safety and performance.
* **Handling long content**: When evaluating long prompts or responses, Guardrails automatically segments the content into smaller chunks, processing each through separate Guardrail requests. This approach ensures comprehensive moderation but may result in increased latency for longer inputs.
* **Supported languages**: Llama Guard 3.3 8B supports content safety classification in the following languages: English, French, German, Hindi, Italian, Portuguese, Spanish, and Thai.
* **Streaming support**: Streaming is not supported when using Guardrails.

Note

Llama Guard is provided as-is without any representations, warranties, or guarantees. Any rules or examples contained in blogs, developer docs, or other reference materials are provided for informational purposes only. You acknowledge and understand that you are responsible for the results and outcomes of your use of AI Gateway.
