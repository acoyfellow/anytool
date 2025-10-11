---
title: /json - Capture structured data using AI · Cloudflare Browser Rendering docs
description: The /json endpoint extracts structured data from a webpage. You can
  specify the expected output using either a prompt or a response_format
  parameter which accepts a JSON schema. The endpoint returns the extracted data
  in JSON format. By default, this endpoint leverages Workers AI. If you would
  like to specify your own AI model for the extraction, you can use the
  custom_ai parameter.
lastUpdated: 2025-09-11T17:11:57.000Z
chatbotDeprioritize: false
tags: JSON
source_url:
  html: https://developers.cloudflare.com/browser-rendering/rest-api/json-endpoint/
  md: https://developers.cloudflare.com/browser-rendering/rest-api/json-endpoint/index.md
---

The `/json` endpoint extracts structured data from a webpage. You can specify the expected output using either a `prompt` or a `response_format` parameter which accepts a JSON schema. The endpoint returns the extracted data in JSON format. By default, this endpoint leverages [Workers AI](https://developers.cloudflare.com/workers-ai/). If you would like to specify your own AI model for the extraction, you can use the `custom_ai` parameter.

Note

By default, the `/json` endpoint leverages [Workers AI](https://developers.cloudflare.com/workers-ai/) for data extraction. Using this endpoint incurs usage on Workers AI, which you can monitor usage through the Workers AI Dashboard.

## Basic Usage

* curl

  ### With a Prompt and JSON schema

  This example captures webpage data by providing both a prompt and a JSON schema. The prompt guides the extraction process, while the JSON schema defines the expected structure of the output.

  ```bash
  curl --request POST 'https://api.cloudflare.com/client/v4/accounts/CF_ACCOUNT_ID/browser-rendering/json' \
    --header 'authorization: Bearer CF_API_TOKEN' \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://developers.cloudflare.com/",
    "prompt": "Get me the list of AI products",
    "response_format": {
      "type": "json_schema",
      "schema": {
          "type": "object",
          "properties": {
            "products": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "link": {
                    "type": "string"
                  }
                },
                "required": [
                  "name"
                ]
              }
            }
          }
        }
    }
  }'
  ```

  ```json
  {
    "success": true,
    "result": {
      "products": [
        {
          "name": "Build a RAG app",
          "link": "https://developers.cloudflare.com/workers-ai/tutorials/build-a-retrieval-augmented-generation-ai/"
        },
        {
          "name": "Workers AI",
          "link": "https://developers.cloudflare.com/workers-ai/"
        },
        {
          "name": "Vectorize",
  13 collapsed lines
          "link": "https://developers.cloudflare.com/vectorize/"
        },
        {
          "name": "AI Gateway",
          "link": "https://developers.cloudflare.com/ai-gateway/"
        },
        {
          "name": "AI Playground",
          "link": "https://playground.ai.cloudflare.com/"
        }
      ]
    }
  }
  ```

  ### With only a prompt

  In this example, only a prompt is provided. The endpoint will use the prompt to extract the data, but the response will not be structured according to a JSON schema. This is useful for simple extractions where you do not need a specific format.

  ```bash
  curl --request POST 'https://api.cloudflare.com/client/v4/accounts/CF_ACCOUNT_ID/browser-rendering/json' \
    --header 'authorization: Bearer CF_API_TOKEN' \
    --header 'content-type: application/json' \
    --data '{
      "url": "https://developers.cloudflare.com/",
      "prompt": "get me the list of AI products"
    }'
  ```

  ```json
    "success": true,
    "result": {
      "AI Products": [
        "Build a RAG app",
        "Workers AI",
        "Vectorize",
        "AI Gateway",
        "AI Playground"
      ]
    }
  }
  ```

  ### With only a JSON schema (no prompt)

  In this case, you supply a JSON schema via the `response_format` parameter. The schema defines the structure of the extracted data.

  ```bash
  curl --request POST 'https://api.cloudflare.com/client/v4/accounts/CF_ACCOUNT_ID/browser-rendering/json' \
    --header 'authorization: Bearer CF_API_TOKEN' \
    --header 'content-type: application/json' \
    --data '"response_format": {
      "type": "json_schema",
      "schema": {
          "type": "object",
          "properties": {
            "products": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "link": {
                    "type": "string"
                  }
                },
                "required": [
                  "name"
                ]
              }
            }
          }
        }
    }'
  ```

  ```json
  {
    "success": true,
    "result": {
      "products": [
        {
          "name": "Workers",
          "link": "https://developers.cloudflare.com/workers/"
        },
        {
          "name": "Pages",
          "link": "https://developers.cloudflare.com/pages/"
        },
  55 collapsed lines
        {
          "name": "R2",
          "link": "https://developers.cloudflare.com/r2/"
        },
        {
          "name": "Images",
          "link": "https://developers.cloudflare.com/images/"
        },
        {
          "name": "Stream",
          "link": "https://developers.cloudflare.com/stream/"
        },
        {
          "name": "Build a RAG app",
          "link": "https://developers.cloudflare.com/workers-ai/tutorials/build-a-retrieval-augmented-generation-ai/"
        },
        {
          "name": "Workers AI",
          "link": "https://developers.cloudflare.com/workers-ai/"
        },
        {
          "name": "Vectorize",
          "link": "https://developers.cloudflare.com/vectorize/"
        },
        {
          "name": "AI Gateway",
          "link": "https://developers.cloudflare.com/ai-gateway/"
        },
        {
          "name": "AI Playground",
          "link": "https://playground.ai.cloudflare.com/"
        },
        {
          "name": "Access",
          "link": "https://developers.cloudflare.com/cloudflare-one/policies/access/"
        },
        {
          "name": "Tunnel",
          "link": "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/"
        },
        {
          "name": "Gateway",
          "link": "https://developers.cloudflare.com/cloudflare-one/policies/gateway/"
        },
        {
          "name": "Browser Isolation",
          "link": "https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/"
        },
        {
          "name": "Replace your VPN",
          "link": "https://developers.cloudflare.com/learning-paths/replace-vpn/concepts/"
        }
      ]
    }
  }
  ```

* TypeScript SDK

  Below is an example using the TypeScript SDK:

  ```typescript
  import Cloudflare from "cloudflare";


  const client = new Cloudflare({
    apiToken: process.env["CLOUDFLARE_API_TOKEN"], // This is the default and can be omitted
  });


  const json = await client.browserRendering.json.create({
    account_id: process.env["CLOUDFLARE_ACCOUNT_ID"],
    url: "https://developers.cloudflare.com/",
    prompt: "Get me the list of AI products",
    response_format: {
      type: "json_schema",
      schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string"
                  },
                  link: {
                    type: "string"
                  }
                },
                required: [
                  "name"
                ]
              }
            }
          }
        }
      }
    }
  );
  console.log(json);
  ```

## Advanced Usage

### Using a custom model (BYO API Key)

Browser Rendering can use a custom model for which you supply credentials. List the model(s) in the `custom_ai` array:

* `model` should be formed as `<provider>/<model_name>` and the provider must be one of these [supported providers](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/#supported-providers).
* `authorization` is the bearer token or API key that allows Browser Rendering to call the provider on your behalf.

This example uses the `custom_ai` parameter to instruct Browser Rendering to use a Anthropic's Claude Sonnet 4 model. The prompt asks the model to extract the main `<h1>` and `<h2>` headings from the target URL and return them in a structured JSON object.

```bash
curl --request POST \
  --url https://api.cloudflare.com/client/v4/accounts/CF_ACCOUNT_ID/browser-rendering/json \
  --header 'authorization: Bearer CF_API_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
  "url": "http://demoto.xyz/headings",
  "prompt": "Get the heading from the page in the form of an object like h1, h2. If there are many headings of the same kind then grab the first one.",
  "response_format": {
    "type": "json_schema",
    "schema": {
      "type": "object",
      "properties": {
        "h1": {
          "type": "string"
        },
        "h2": {
          "type": "string"
        }
      },
      "required": [
        "h1"
      ]
    }
  },
  "custom_ai": [
    {
      "model": "anthropic/claude-sonnet-4-20250514",
      "authorization": "Bearer <ANTHROPIC_API_KEY>"
    }
  ]
}
```

```json
{
  "success": true,
  "result": {
    "h1": "Heading 1",
    "h2": "Heading 2"
  }
}
```

### Using a custom model with fallbacks

You may specify multiple models to provide automatic failover. Browser Rendering will attempt the models in order until one succeeds. To add failover, list additional models in the `custom_ai` array.

In this example, Browser Rendering first calls Anthropic's Claude Sonnet 4 model. If that request returns an error, it automatically retries with Meta Llama 3.3 70B from [Workers AI](https://developers.cloudflare.com/workers-ai/), then OpenAI's GPT-4o.

```plaintext
"custom_ai": [
  {
    "model": "anthropic/claude-sonnet-4-20250514",
    "authorization": "Bearer <ANTHROPIC_API_KEY>"
  },
  {
    "model": "workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    "authorization": "Bearer <CLOUDFLARE_AUTH_TOKEN>"
  },
{
    "model": "openai/gpt-4o",
    "authorization": "Bearer <OPENAI_API_KEY>"
  }
]
```

### Set a custom user agent

You can change the user agent at the page level by passing `userAgent` as a top-level parameter in the JSON body. This is useful if the target website serves different content based on the user agent.

Note

The `userAgent` parameter does not bypass bot protection. Requests from Browser Rendering will always be identified as a bot.
