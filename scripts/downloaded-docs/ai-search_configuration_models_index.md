---
title: Models · Cloudflare AI Search docs
description: AI Search uses models at multiple stages. You can configure which
  models are used, or let AI Search automatically select a smart default for
  you.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/configuration/models/
  md: https://developers.cloudflare.com/ai-search/configuration/models/index.md
---

AI Search uses models at multiple stages. You can configure which models are used, or let AI Search automatically select a smart default for you.

## Models usage

AI Search leverages Workers AI models in the following stages:

* Image to markdown conversion (if images are in data source): Converts image content to Markdown using object detection and captioning models.
* Embedding: Transforms your documents and queries into vector representations for semantic search.
* Query rewriting (optional): Reformulates the user’s query to improve retrieval accuracy.
* Generation: Produces the final response from retrieved context.

## Model providers

All AI Search instances support models from [Workers AI](https://developers.cloudflare.com/workers-ai). You can use other providers (such as OpenAI or Anthropic) in AI Search by adding their API keys to an [AI Gateway](https://developers.cloudflare.com/ai-gateway) and connecting that gateway to your AI Search.

To use AI Search with other model providers:

1. Add provider keys to AI Gateway

* Go to **AI > AI Gateway** in the dashboard.
* Select or create an AI gateway.
* In **Provider Keys**, choose your provider, click **Add**, and enter the key.

1. Connect the gateway to AI Search

* When creating a new AI Search, select the AI Gateway with your provider keys.
* For an existing AI Search, go to **Settings** and switch to a gateway that has your keys under **Resources**.

1. Select models

* Embedding model: Only available to be changed when creating a new AI Search.
* Generation model: Can be selected when creating a new AI Search and can be changed at any time in **Settings**.

AI Search supports a subset of models that have been selected to provide the best experience. See list of [supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/).

### Smart default

If you choose **Smart Default** in your model selection, then AI Search will select a Cloudflare recommended model and will update it automatically for you over time. You can switch to explicit model configuration at any time by visiting **Settings**.

### Per-request generation model override

While the generation model can be set globally at the AI Search instance level, you can also override it on a per-request basis in the [AI Search API](https://developers.cloudflare.com/ai-search/usage/rest-api/#ai-search). This is useful if your [RAG application](https://developers.cloudflare.com/ai-search/) requires dynamic selection of generation models based on context or user preferences.

## Model deprecation

AI Search may deprecate support for a given model in order to provide support for better-performing models with improved capabilities. When a model is being deprecated, we announce the change and provide an end-of-life date after which the model will no longer be accessible. Applications that depend on AI Search may therefore require occasional updates to continue working reliably.

### Model lifecycle

AI Search models follow a defined lifecycle to ensure stability and predictable deprecation:

1. **Production:** The model is actively supported and recommended for use. It is included in Smart Defaults and receives ongoing updates and maintenance.
2. **Announcement & Transition:** The model remains available but has been marked for deprecation. An end-of-life date is communicated through documentation, release notes, and other official channels. During this phase, users are encouraged to migrate to the recommended replacement model.
3. **Automatic Upgrade (if applicable):** If you have selected the Smart Default option, AI Search will automatically upgrade requests to a recommended replacement.
4. **End of life:** The model is no longer available. Any requests to the retired model return a clear error message, and the model is removed from documentation and Smart Defaults.

See models are their lifecycle status in [supported models](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/).

### Best practices

* Regularly check the [release note](https://developers.cloudflare.com/ai-search/platform/release-note/) for updates.
* Plan migration efforts according to the communicated end-of-life date.
* Migrate and test the recommended replacement models before the end-of-life date.
