---
title: Parallel · Cloudflare AI Gateway docs
description: Parallel is a web API purpose-built for AIs, providing
  production-ready outputs with minimal hallucination and evidence-based
  results.
lastUpdated: 2025-10-03T11:34:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/parallel/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/parallel/index.md
---

[Parallel](https://parallel.ai/) is a web API purpose-built for AIs, providing production-ready outputs with minimal hallucination and evidence-based results.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/parallel
```

## URL structure

When making requests to Parallel, you can route to any Parallel endpoint through AI Gateway by appending the path after `parallel`. For example, to access the Tasks API at `/v1/tasks/runs`, use:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/parallel/v1/tasks/runs
```

## Prerequisites

When making requests to Parallel, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active Parallel API key.

## Examples

### Tasks API

The [Tasks API](https://docs.parallel.ai/task-api/task-quickstart) allows you to create comprehensive research and analysis tasks.

#### cURL example

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/parallel/v1/tasks/runs \
  --header 'x-api-key: {parallel_api_key}' \
  --header 'Content-Type: application/json' \
  --data '{
    "input": "Create a comprehensive market research report on the HVAC industry in the USA including an analysis of recent M&A activity and other relevant details.",
    "processor": "ultra"
  }'
```

### Search API

The [Search API](https://docs.parallel.ai/search-api/search-quickstart) enables advanced search with configurable parameters.

#### cURL example

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/parallel/v1beta/search \
  --header 'x-api-key: {parallel_api_key}' \
  --header 'Content-Type: application/json' \
  --data '{
    "objective": "When was the United Nations established? Prefer UN'\''s websites.",
    "search_queries": [
      "Founding year UN",
      "Year of founding United Nations"
    ],
    "processor": "base",
    "max_results": 10,
    "max_chars_per_result": 6000
  }'
```

## Chat API

The [Chat API](https://docs.parallel.ai/chat-api/chat-quickstart) is supported through AI Gateway's Unified Chat Completions API. See below for more details:

## OpenAI-Compatible Endpoint

You can also use the [OpenAI-compatible endpoint](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) (`/ai-gateway/usage/chat-completion/`) to access Parallel models using the OpenAI API schema. To do so, send your requests to:

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

Specify:

```json
{
"model": "parallel/{model}"
}
```

#### JavaScript SDK example

```js
import OpenAI from "openai";


const apiKey = "{parallel_api_key}";
const accountId = "{account_id}";
const gatewayId = "{gateway_id}";
const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat`;


const client = new OpenAI({
  apiKey,
  baseURL,
});


try {
  const model = "parallel/speed";
  const messages = [{ role: "user", content: "Hello!" }];
  const chatCompletion = await client.chat.completions.create({
    model,
    messages,
  });
  const response = chatCompletion.choices[0].message;
  console.log(response);
} catch (e) {
  console.error(e);
}
```

### FindAll API

The [FindAll API](https://docs.parallel.ai/findall-api/findall-quickstart) enables structured data extraction from complex queries.

#### cURL example

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/parallel/v1beta/findall/ingest \
  --header 'x-api-key: {parallel_api_key}' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "Find all AI companies that recently raised money and get their website, CEO name, and CTO name."
  }'
```
