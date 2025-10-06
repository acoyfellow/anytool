---
title: Cartesia · Cloudflare AI Gateway docs
description: Cartesia provides advanced text-to-speech services with
  customizable voice models.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/cartesia/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/cartesia/index.md
---

[Cartesia](https://docs.cartesia.ai/) provides advanced text-to-speech services with customizable voice models.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/cartesia
```

## URL Structure

When making requests to Cartesia, replace `https://api.cartesia.ai/v1` in the URL you are currently using with `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/cartesia`.

## Prerequisites

When making requests to Cartesia, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active Cartesia API token.
* The model ID and voice ID for the Cartesia voice model you want to use.

## Example

### cURL

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/cartesia/tts/bytes \
  --header 'Content-Type: application/json' \
  --header 'Cartesia-Version: 2024-06-10' \
  --header 'X-API-Key: {cartesia_api_token}' \
  --data '{
    "transcript": "Welcome to Cloudflare - AI Gateway!",
    "model_id": "sonic-english",
    "voice": {
        "mode": "id",
        "id": "694f9389-aac1-45b6-b726-9d9369183238"
    },
    "output_format": {
        "container": "wav",
        "encoding": "pcm_f32le",
        "sample_rate": 44100
    }
}
```
