---
title: Google Vertex AI · Cloudflare AI Gateway docs
description: Google Vertex AI enables developers to easily build and deploy
  enterprise ready generative AI experiences.
lastUpdated: 2025-10-03T11:51:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/vertex/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/vertex/index.md
---

[Google Vertex AI](https://cloud.google.com/vertex-ai) enables developers to easily build and deploy enterprise ready generative AI experiences.

Below is a quick guide on how to set your Google Cloud Account:

1. Google Cloud Platform (GCP) Account

   * Sign up for a [GCP account](https://cloud.google.com/vertex-ai). New users may be eligible for credits (valid for 90 days).

2. Enable the Vertex AI API

   * Navigate to [Enable Vertex AI API](https://console.cloud.google.com/marketplace/product/google/aiplatform.googleapis.com) and activate the API for your project.

3. Apply for access to desired models.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-vertex-ai
```

## Prerequisites

When making requests to Google Vertex, you will need:

* AI Gateway account tag
* AI Gateway gateway name
* Google Vertex API key
* Google Vertex Project Name
* Google Vertex Region (for example, us-east4)
* Google Vertex model

## URL structure

Your new base URL will use the data above in this structure: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-vertex-ai/v1/projects/{project_name}/locations/{region}`.

Then you can append the endpoint you want to hit, for example: `/publishers/google/models/{model}:{generative_ai_rest_resource}`

So your final URL will come together as: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-vertex-ai/v1/projects/{project_name}/locations/{region}/publishers/google/models/gemini-1.0-pro-001:generateContent`

## Authenticating with Vertex AI

Authenticating with Vertex AI normally requires generating short-term credentials using the [Google Cloud SDKs](https://cloud.google.com/vertex-ai/docs/authentication) with a complicated setup, but AI Gateway simplifies this for you with multiple options:

### Option 1: Service Account JSON

AI Gateway supports passing a Google service account JSON directly in the `Authorization` header on requests or through AI Gateway's [Bring Your Own Keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/) feature.

You can [create a service account key](https://cloud.google.com/iam/docs/keys-create-delete) in the Google Cloud Console. Ensure that the service account has the required permissions for the Vertex AI endpoints and models you plan to use.

AI Gateway uses your service account JSON to generate short-term access tokens which are cached and used for consecutive requests, and are automatically refreshed when they expire.

Note

The service account JSON must include an additional key called `region` with the GCP region code (for example, `us-east1`) you intend to use for your [Vertex AI endpoint](https://cloud.google.com/vertex-ai/docs/reference/rest#service-endpoint). You can also pass the region code `global` to use the global endpoint.

#### Example service account JSON structure

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com",
  "region": "us-east1"
}
```

You can pass this JSON in the `Authorization` header or configure it in [Bring Your Own Keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/).

### Option 2: Direct Access Token

If you are already using the Google Cloud SDKs and generating a short-term access token (for example, with `gcloud auth print-access-token`), you can directly pass this as a Bearer token in the `Authorization` header of the request.

Note

This option is only supported for the provider-specific endpoint, not for the unified chat completions endpoint.

```bash
curl "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-vertex-ai/v1/projects/{project_name}/locations/{region}/publishers/google/models/gemini-1.0-pro-001:generateContent" \
    -H "Authorization: Bearer ya29.c.b0Aaekm1K..." \
    -H 'Content-Type: application/json' \
    -d '{
        "contents": {
          "role": "user",
          "parts": [
            {
              "text": "Tell me more about Cloudflare"
            }
          ]
        }
      }'
```

## Using Unified Chat Completions API

AI Gateway provides a [Unified API](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) that works across providers. For Google Vertex AI, you can use the standard chat completions format. Note that the model field includes the provider prefix, so your model string will look like `google-vertex-ai/google/gemini-2.5-pro`.

### Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions
```

### Example with OpenAI SDK

```javascript
import OpenAI from 'openai';


const client = new OpenAI({
  apiKey: '{service_account_json}',
  baseURL: 'https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat'
});


const response = await client.chat.completions.create({
  model: 'google-vertex-ai/google/gemini-2.5-pro',
  messages: [
    {
      role: 'user',
      content: 'What is Cloudflare?'
    }
  ]
});


console.log(response.choices[0].message.content);
```

### Example with cURL

```bash
curl "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions" \
    -H "Authorization: Bearer {service_account_json}" \
    -H 'Content-Type: application/json' \
    -d '{
        "model": "google-vertex-ai/google/gemini-2.5-pro",
        "messages": [
          {
            "role": "user",
            "content": "What is Cloudflare?"
          }
        ]
      }'
```

Note

See the [Authenticating with Vertex AI](#authenticating-with-vertex-ai) section below for details on the service account JSON structure and authentication options.

## Using Provider-Specific Endpoint

You can also use the provider-specific endpoint to access the full Vertex AI API.

### cURL

```bash
curl "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/google-vertex-ai/v1/projects/{project_name}/locations/{region}/publishers/google/models/gemini-1.0-pro-001:generateContent" \
    -H "Authorization: Bearer {vertex_api_key}" \
    -H 'Content-Type: application/json' \
    -d '{
        "contents": {
          "role": "user",
          "parts": [
            {
              "text": "Tell me more about Cloudflare"
            }
          ]
        }'
```
