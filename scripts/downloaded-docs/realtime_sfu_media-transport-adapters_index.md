---
title: Media Transport Adapters · Cloudflare Realtime docs
description: Media Transport Adapters bridge WebRTC and other transport
  protocols. Adapters handle protocol conversion, codec transcoding, and
  bidirectional media flow between WebRTC sessions and external endpoints.
lastUpdated: 2025-09-02T18:06:00.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/sfu/media-transport-adapters/
  md: https://developers.cloudflare.com/realtime/sfu/media-transport-adapters/index.md
---

Media Transport Adapters bridge WebRTC and other transport protocols. Adapters handle protocol conversion, codec transcoding, and bidirectional media flow between WebRTC sessions and external endpoints.

## What adapters do

Adapters extend Realtime beyond WebRTC-to-WebRTC communication:

* Ingest audio/video from external sources into WebRTC sessions
* Stream WebRTC media to external systems for processing or storage
* Integrate with AI services for transcription, translation, or generation
* Bridge WebRTC applications with legacy communication systems

## Available adapters

### WebSocket adapter (beta)

Stream audio between WebRTC tracks and WebSocket endpoints. Currently in beta; the API may change.

[Learn more](https://developers.cloudflare.com/realtime/sfu/media-transport-adapters/websocket-adapter/)

## Architecture

Media Transport Adapters operate as intermediaries between Cloudflare Realtime SFU sessions and external endpoints:

```mermaid
graph LR
    A[WebRTC Client] <--> B[Realtime SFU Session]
    B <--> C[Media Transport Adapter]
    C <--> D[External Endpoint]
```

### Key concepts

**Adapter instance**: Each connection creates a unique instance with an `adapterId` to manage its lifecycle.

**Location types**:

* `local` (Ingest): Receives media from external endpoints to create new WebRTC tracks
* `remote` (Stream): Sends media from existing WebRTC tracks to external endpoints

**Codec support**: Adapters convert between WebRTC and external system formats.

## Common use cases

### AI processing

* Speech-to-text transcription
* Text-to-speech generation
* Real-time translation
* Audio enhancement

### Media recording

* Cloud recording
* Content delivery networks
* Media processing pipelines

### Legacy integration

* Traditional telephony
* Broadcasting infrastructure
* Custom media servers

## API overview

Media Transport Adapters are managed through the Realtime SFU API:

```plaintext
POST /v1/apps/{appId}/adapters/{adapterType}/new
POST /v1/apps/{appId}/adapters/{adapterType}/close
```

Each adapter type has specific configuration requirements and capabilities. Refer to individual adapter documentation for detailed API specifications.

## Best practices

* Close adapter instances when no longer needed
* Implement reconnection logic for network failures
* Choose codecs based on bandwidth and quality requirements
* Secure endpoints with authentication for sensitive media

## Limitations

* Each adapter type has specific codec and format support
* Network latency between Cloudflare edge and external endpoints affects real-time performance
* Maximum message size and streaming modes vary by adapter type

## Get started

[WebSocket adapter (beta)](https://developers.cloudflare.com/realtime/sfu/media-transport-adapters/websocket-adapter/) - Stream audio between WebRTC and WebSocket endpoints
