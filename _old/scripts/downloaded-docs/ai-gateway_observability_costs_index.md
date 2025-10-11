---
title: Costs · Cloudflare AI Gateway docs
description: Cost metrics are only available for endpoints where the models
  return token data and the model name in their responses.
lastUpdated: 2025-05-15T16:26:01.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/observability/costs/
  md: https://developers.cloudflare.com/ai-gateway/observability/costs/index.md
---

Cost metrics are only available for endpoints where the models return token data and the model name in their responses.

## Track costs across AI providers

AI Gateway makes it easier to monitor and estimate token based costs across all your AI providers. This can help you:

* Understand and compare usage costs between providers.
* Monitor trends and estimate spend using consistent metrics.
* Apply custom pricing logic to match negotiated rates.

Note

The cost metric is an **estimation** based on the number of tokens sent and received in requests. While this metric can help you monitor and predict cost trends, refer to your provider's dashboard for the most **accurate** cost details.

Caution

Providers may introduce new models or change their pricing. If you notice outdated cost data or are using a model not yet supported by our cost tracking, please [submit a request](https://forms.gle/8kRa73wRnvq7bxL48)

## Custom costs

AI Gateway allows users to set custom costs when operating under special pricing agreements or negotiated rates. Custom costs can be applied at the request level, and when applied, they will override the default or public model costs. For more information on configuration of custom costs, please visit the [Custom Costs](https://developers.cloudflare.com/ai-gateway/configuration/custom-costs/) configuration page.
