---
title: Dynamic routing · Cloudflare AI Gateway docs
description: "Dynamic routing enables you to create request routing flows
  through a visual interface or a JSON-based configuration. Instead of
  hard-coding a single model, with Dynamic Routing you compose a small flow that
  evaluates conditions, enforces quotas, and chooses models with fallbacks. You
  can iterate without touching application code—publish a new route version and
  you’re done. With dynamic routing, you can easily implement advanced use cases
  such as:"
lastUpdated: 2025-08-23T11:12:09.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/
  md: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/index.md
---

## Introduction

Dynamic routing enables you to create request routing flows through a **visual interface** or a **JSON-based configuration**. Instead of hard-coding a single model, with Dynamic Routing you compose a small flow that evaluates conditions, enforces quotas, and chooses models with fallbacks. You can iterate without touching application code—publish a new route version and you’re done. With dynamic routing, you can easily implement advanced use cases such as:

* Directing different segments (paid/not-paid user) to different models
* Restricting each user/project/team with budget/rate limits
* A/B and gradual rollouts

while making it accessible to both developers and non-technical team members.

![Dynamic Routing Overview](https://developers.cloudflare.com/_astro/dynamic-routing.BtwkWywo_ZkRSjM.webp)

## Core Concepts

* **Route**: A named, versioned flow (for example, dynamic/support) that you can use as instead of the model name in your requests.

* **Nodes**

  * **Start**: Entry point for the route.
  * **Conditional**: If/Else branch based on expressions that reference request body, headers, or metadata (for example, user\_plan == "paid").
  * **Percentage**: Routes requests probabilistically across multiple outputs, useful for A/B testing and gradual rollouts.
  * **Model**: Calls a provider/model with the request parameters
  * **Rate Limit**: Enforces number of requests quotas (per your key, per period) and switches to fallback when exceeded.
  * **Budget Limit**: Enforces cost quotas (per your key, per period) and switches to fallback when exceeded.
  * **End**: Terminates the flow and returns the final model response.

* **Metadata**: Arbitrary key-value context attached to the request (for example, userId, orgId, plan). You can pass this from your app so rules can reference it.

* **Versions**: Each change produces a new draft. Deploy to make it live with instant rollback.

## Getting Started

Warning

Ensure your gateway has [authentication](https://developers.cloudflare.com/ai-gateway/configuration/authentication/) turned on, and you have your upstream providers keys stored with [BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/).

1. Create a route.

   * Go to **(Select your gateway)** > **Dynamic Routes** > **Add Route**, and name it (for example, `support`).
   * Open **Editor**.

2. Define conditionals, limits and other settings.

3. Configure model nodes.

   * Example:

     * Node A: Provider OpenAI, Model `o4-mini-high`
     * Node B: Provider OpenAI, Model `gpt-4.1`

4. Save a version.

   * Click **Save** to save the state. You can always roll back to earlier versions from **Versions**.
   * Deploy the version to make it live.

5. Call the route from your code.
   * Use the [OpenAI compatible](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) endpoint, and use the route name in place of the model, for example, `dynamic/support`.
