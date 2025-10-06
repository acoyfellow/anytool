---
title: ElevenLabs · Cloudflare AI Gateway docs
description: ElevenLabs offers advanced text-to-speech services, enabling
  high-quality voice synthesis in multiple languages.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/usage/providers/elevenlabs/
  md: https://developers.cloudflare.com/ai-gateway/usage/providers/elevenlabs/index.md
---

[ElevenLabs](https://elevenlabs.io/) offers advanced text-to-speech services, enabling high-quality voice synthesis in multiple languages.

## Endpoint

```txt
https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/elevenlabs
```

## Prerequisites

When making requests to ElevenLabs, ensure you have the following:

* Your AI Gateway Account ID.
* Your AI Gateway gateway name.
* An active ElevenLabs API token.
* The model ID of the ElevenLabs voice model you want to use.

## Example

### cURL

```bash
curl https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/elevenlabs/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128 \
  --header 'Content-Type: application/json' \
  --header 'xi-api-key: {elevenlabs_api_token}' \
  --data '{
    "text": "Welcome to Cloudflare - AI Gateway!",
    "model_id": "eleven_multilingual_v2"
}'
```
