---
title: Changelog · Cloudflare AI Gateway docs
description: Subscribe to RSS
lastUpdated: 2025-05-09T15:42:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/changelog/
  md: https://developers.cloudflare.com/ai-gateway/changelog/index.md
---

[Subscribe to RSS](https://developers.cloudflare.com/ai-gateway/changelog/index.xml)

## 2025-08-25

**Dynamic routing**

Introduced [Dynamic routing](https://developers.cloudflare.com/ai-gateway/routing/dynamic-routing/) to help manage AI provider interactions effectively, ensuring your applications remain responsive and reliable.

## 2025-08-21

**Bring your own keys (BYOK)**

Introduced [Bring your own keys (BYOK)](https://developers.cloudflare.com/ai-gateway/configuration/byok/) allowing you to save your ai provider keys directly in the AI Gateway dashboard.

## 2025-06-18

**New GA providers**

We have moved the following providers out of beta and into GA:

* [Cartesia](https://developers.cloudflare.com/ai-gateway/usage/providers/cartesia/)
* [Cerebras](https://developers.cloudflare.com/ai-gateway/usage/providers/cerebras/)
* [DeepSeek](https://developers.cloudflare.com/ai-gateway/usage/providers/deepseek/)
* [ElevenLabs](https://developers.cloudflare.com/ai-gateway/usage/providers/elevenlabs/)
* [OpenRouter](https://developers.cloudflare.com/ai-gateway/usage/providers/openrouter/)

## 2025-05-28

**OpenAI Compatibility**

* Introduced a new [OpenAI-compatible chat completions endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) to simplify switching between different AI providers without major code modifications.

## 2025-04-22

* Increased Max Number of Gateways per account: Raised the maximum number of gateways per account from 10 to 20 for paid users. This gives you greater flexibility in managing your applications as you build and scale.
* Streaming WebSocket Bug Fix: Resolved an issue affecting streaming responses over [WebSockets](https://developers.cloudflare.com/ai-gateway/configuration/websockets-api/). This fix ensures more reliable and consistent streaming behavior across all supported AI providers.
* Increased Timeout Limits: Extended the default timeout for AI Gateway requests beyond the previous 100-second limit. This enhancement improves support for long-running requests.

## 2025-04-02

**Cache Key Calculation Changes**

* We have updated how [cache](https://developers.cloudflare.com/ai-gateway/features/caching/) keys are calculated. As a result, new cache entries will be created, and you may experience more cache misses than usual during this transition. Please monitor your traffic and performance, and let us know if you encounter any issues.

## 2025-03-18

**WebSockets**

* Added [WebSockets API](https://developers.cloudflare.com/ai-gateway/configuration/websockets-api/) to provide a persistent connection for AI interactions, eliminating repeated handshakes and reducing latency.

## 2025-02-26

**Guardrails**

* Added [Guardrails](https://developers.cloudflare.com/ai-gateway/features/guardrails/) help deploy AI applications safely by intercepting and evaluating both user prompts and model responses for harmful content.

## 2025-02-19

**Updated Log Storage Settings**

* Introduced customizable log storage settings, enabling users to:

  * Define the maximum number of logs stored per gateway.

  * Choose how logs are handled when the storage limit is reached:

    * **On** - Automatically delete the oldest logs to ensure new logs are always saved.
    * **Off** - Stop saving new logs when the storage limit is reached.

## 2025-02-06

**Added request handling**

* Added [request handling options](https://developers.cloudflare.com/ai-gateway/configuration/request-handling/) to help manage AI provider interactions effectively, ensuring your applications remain responsive and reliable.

## 2025-02-05

**New AI Gateway providers**

* **Configuration**: Added [ElevenLabs](https://elevenlabs.io/), [Cartesia](https://docs.cartesia.ai/), and [Cerebras](https://inference-docs.cerebras.ai/) as new providers.

## 2025-01-02

**DeepSeek**

* **Configuration**: Added [DeepSeek](https://developers.cloudflare.com/ai-gateway/usage/providers/deepseek/) as a new provider.

## 2024-12-17

**AI Gateway Dashboard**

* Updated dashboard to view performance, costs, and stats across all gateways.

## 2024-12-13

**Bug Fixes**

* **Bug Fixes**: Fixed Anthropic errors being cached.
* **Bug Fixes**: Fixed `env.AI.run()` requests using authenticated gateways returning authentication error.

## 2024-11-28

**OpenRouter**

* **Configuration**: Added [OpenRouter](https://developers.cloudflare.com/ai-gateway/usage/providers/openrouter/) as a new provider.

## 2024-11-19

**WebSockets API**

* **Configuration**: Added [WebSockets API](https://developers.cloudflare.com/ai-gateway/configuration/websockets-api/) which provides a single persistent connection, enabling continuous communication.

## 2024-11-19

**Authentication**

* **Configuration**: Added [Authentication](https://developers.cloudflare.com/ai-gateway/configuration/authentication/) which adds security by requiring a valid authorization token for each request.

## 2024-10-28

**Grok**

* **Providers**: Added [Grok](https://developers.cloudflare.com/ai-gateway/usage/providers/grok/) as a new provider.

## 2024-10-17

**Vercel SDK**

Added [Vercel AI SDK](https://sdk.vercel.ai/). The SDK supports many different AI providers, tools for streaming completions, and more.

## 2024-09-26

**Persistent logs**

* **Logs**: AI Gateway now has [logs that persist](https://developers.cloudflare.com/ai-gateway/observability/logging/index), giving you the flexibility to store them for your preferred duration.

## 2024-09-26

**Logpush**

* **Logs**: Securely export logs to an external storage location using [Logpush](https://developers.cloudflare.com/ai-gateway/observability/logging/logpush).

## 2024-09-26

**Pricing**

* **Pricing**: Added [pricing](https://developers.cloudflare.com/ai-gateway/reference/pricing/) for storing logs persistently.

## 2024-09-26

**Evaluations**

* **Configurations**: Use AI Gateway’s [Evaluations](https://developers.cloudflare.com/ai-gateway/evaluations) to make informed decisions on how to optimize your AI application.

## 2024-09-10

**Custom costs**

* **Configuration**: AI Gateway now allows you to set custom costs at the request level [custom costs](https://developers.cloudflare.com/ai-gateway/configuration/custom-costs/) to requests, accurately reflect your unique pricing, overriding the default or public model costs.

## 2024-08-02

**Mistral AI**

* **Providers**: Added [Mistral AI](https://developers.cloudflare.com/ai-gateway/usage/providers/mistral/) as a new provider.

## 2024-07-23

**Google AI Studio**

* **Providers**: Added [Google AI Studio](https://developers.cloudflare.com/ai-gateway/usage/providers/google-ai-studio/) as a new provider.

## 2024-07-10

**Custom metadata**

AI Gateway now supports adding [custom metadata](https://developers.cloudflare.com/ai-gateway/configuration/custom-metadata/) to requests, improving tracking and analysis of incoming requests.

## 2024-07-09

**Logs**

[Logs](https://developers.cloudflare.com/ai-gateway/observability/analytics/#logging) are now available for the last 24 hours.

## 2024-06-24

**Custom cache key headers**

AI Gateway now supports [custom cache key headers](https://developers.cloudflare.com/ai-gateway/features/caching/#custom-cache-key-cf-aig-cache-key).

## 2024-06-18

**Access an AI Gateway through a Worker**

Workers AI now natively supports [AI Gateway](https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/#worker).

## 2024-05-22

**AI Gateway is now GA**

AI Gateway is moving from beta to GA.

## 2024-05-16

* **Providers**: Added [Cohere](https://developers.cloudflare.com/ai-gateway/usage/providers/cohere/) and [Groq](https://developers.cloudflare.com/ai-gateway/usage/providers/groq/) as new providers.

## 2024-05-09

* Added new endpoints to the [REST API](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/).

## 2024-03-26

* [LLM Side Channel vulnerability fixed](https://blog.cloudflare.com/ai-side-channel-attack-mitigated)
* **Providers**: Added Anthropic, Google Vertex, Perplexity as providers.

## 2023-10-26

* **Real-time Logs**: Logs are now real-time, showing logs for the last hour. If you have a need for persistent logs, please let the team know on Discord. We are building out a persistent logs feature for those who want to store their logs for longer.
* **Providers**: Azure OpenAI is now supported as a provider!
* **Docs**: Added Azure OpenAI example.
* **Bug Fixes**: Errors with costs and tokens should be fixed.

## 2023-10-09

* **Logs**: Logs will now be limited to the last 24h. If you have a use case that requires more logging, please reach out to the team on Discord.
* **Dashboard**: Logs now refresh automatically.
* **Docs**: Fixed Workers AI example in docs and dash.
* **Caching**: Embedding requests are now cacheable. Rate limit will not apply for cached requests.
* **Bug Fixes**: Identical requests to different providers are not wrongly served from cache anymore. Streaming now works as expected, including for the Universal endpoint.
* **Known Issues**: There's currently a bug with costs that we are investigating.
