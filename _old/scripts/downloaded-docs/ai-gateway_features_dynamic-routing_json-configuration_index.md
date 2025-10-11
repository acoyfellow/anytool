---
title: JSON Configuration · Cloudflare AI Gateway docs
description: "Instead of using the dashboard editor UI to define the route
  graph, you can do it using the REST API. Routes are internally represented
  using a simple JSON structure:"
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/json-configuration/
  md: https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/json-configuration/index.md
---

Instead of using the **dashboard editor UI** to define the route graph, you can do it using the REST API. Routes are internally represented using a simple JSON structure:

```json
{
  "id": "<route id>",
  "name": "<route name>",
  "elements": [<array of elements>]
}
```

## Supported elements

Dynamic routing supports several types of elements that you can combine to create sophisticated routing flows. Each element has specific inputs, outputs, and configuration options.

### Start Element

Marks the beginning of a route. Every route must start with a Start element.

* **Inputs**: None
* **Outputs**:
  * `next`: Forwards the unchanged request to the next element

```json
{
  "id": "<id>",
  "type": "start",
  "outputs": {
    "next": { "elementId": "<id>" }
  }
}
```

### Conditional Element (If/Else)

Evaluates a condition based on request parameters and routes the request accordingly.

* **Inputs**: Request

* **Outputs**:

  * `true`: Forwards request to provided element if condition evaluates to true
  * `false`: Forwards request to provided element if condition evaluates to false

```json
{
  "id": "<id>",
  "type": "conditional",
  "properties": {
    "condition": {
      "metadata.plan": { "$eq": "free" } // Supports MongoDB-like operators
    }
  },
  "outputs": {
    "true": { "elementId": "<id>" },
    "false": { "elementId": "<id>" }
  }
}
```

### Percentage Split

Routes requests probabilistically across multiple outputs, useful for A/B testing and gradual rollouts.

* **Inputs**: Request

* **Outputs**: Up to 5 named percentage outputs, plus an optional `else` fallback

  * Each output has a fractional probability (must total 100%)
  * `else` output handles remaining percentage if other branches don't sum to 100%

```json
{
  "id": "<id>",
  "type": "percentage",
  "outputs": {
    "10%": { "elementId": "<id>" },
    "50%": { "elementId": "<id>" },
    "else": { "elementId": "<id>" }
  }
}
```

### Rate/Budget Limit

Apply limits based on request metadata. Supports both count-based and cost-based limits.

* **Inputs**: Request

* **Outputs**:

  * `success`: Forwards request to provided element if request is not rate limited
  * `fallback`: Optional output for rate-limited requests (route terminates if not provided)

**Properties**:

* `limitType`: "count" or "cost"
* `key`: Request field to use for rate limiting (e.g. "metadata.user\_id")
* `limit`: Maximum allowed requests/cost
* `interval`: Time window in seconds
* `technique`: "sliding" or "fixed" window

```json
{
  "id": "<id>",
  "type": "rate_limit",
  "properties": {
    "limitType": "count",
    "key": "metadata.user_id",
    "limit": 100,
    "interval": 3600,
    "technique": "sliding"
  },
  "outputs": {
    "success": { "elementId": "node_model_workers_ai" },
    "fallback": { "elementId": "node_model_openai_mini" }
  }
}
```

### Model

Executes inference using a specified model and provider with configurable timeout and retry settings.

* **Inputs**: Request

* **Outputs**:

  * `success`: Forwards request to provided element if model successfully starts streaming a response
  * `fallback`: Optional output if model fails after all retries or times out

**Properties**:

* `provider`: AI provider (e.g. "openai", "anthropic")
* `model`: Specific model name
* `timeout`: Request timeout in milliseconds
* `retries`: Number of retry attempts

```json
{
  "id": "<id>",
  "type": "model",
  "properties": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "timeout": 60000,
    "retries": 4
  },
  "outputs": {
    "success": { "elementId": "<id>" },
    "fallback": { "elementId": "<id>" }
  }
}
```

### End element

Marks the end of a route. Returns the last successful model response, or an error if no model response was generated.

* **Inputs**: Request
* **Outputs**: None

```json
{
  "id": "<id>",
  "type": "end"
}
```
