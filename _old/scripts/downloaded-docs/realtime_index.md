---
title: Overview · Cloudflare Realtime docs
description: "Cloudflare Realtime is a comprehensive suite of products designed
  to help you build powerful, scalable real-time applications. It has three main
  offerings:"
lastUpdated: 2025-08-18T10:34:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/
  md: https://developers.cloudflare.com/realtime/index.md
---

Build Realtime apps with lowest latency - at any scale!

Cloudflare Realtime is a comprehensive suite of products designed to help you build powerful, scalable real-time applications. It has three main offerings:

### RealtimeKit

Cloudflare [RealtimeKit](https://developers.cloudflare.com/realtime/realtimekit/) allows you to integrate programmable and easily customizable live video and voice into your web, mobile, and desktop applications. With just a few lines of code, you can enable live video communication, voice calls, and interactive live streaming.

At its core, RealtimeKit is powered by the [Realtime SFU](https://developers.cloudflare.com/realtime/sfu/), which efficiently routes video and audio streams between participants. RealtimeKit provides a set of user-friendly SDKs and APIs that act as a layer on top of the SFU, so you don't have to handle the complexities of media track management, peer management, and other intricate WebRTC-related tasks.

### Realtime SFU

The [Realtime SFU (Selective Forwarding Unit)](https://developers.cloudflare.com/realtime/sfu/) is a powerful media server that efficiently routes video and audio streams between participants, and underpins the RealtimeKit. The Realtime SFU runs on [Cloudflare's global cloud network](https://www.cloudflare.com/network/) in hundreds of cities worldwide. For developers with WebRTC expertise, the SFU can be used independently to build highly custom applications that require full control over media streams. This is recommended only for those who want to leverage Cloudflare's network with their own WebRTC logic.

### TURN Service

The [TURN service](https://developers.cloudflare.com/realtime/turn/) is a managed service that acts as a relay for WebRTC traffic. It ensures connectivity for users behind restrictive firewalls or NATs by providing a public relay point for media streams.

## Related products

**[Workers AI](https://developers.cloudflare.com/workers-ai/)**

Run machine learning models, powered by serverless GPUs, on Cloudflare’s global network.

**[Stream](https://developers.cloudflare.com/stream/)**

Cloudflare Stream lets you or your end users upload, store, encode, and deliver live and on-demand video with one API, without configuring or maintaining infrastructure.

## More resources

[Developer Discord](https://discord.cloudflare.com)

Connect with the Realtime community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[Use cases](https://developers.cloudflare.com/realtime/realtimekit/introduction#use-cases)

Learn how you can build and deploy ambitious Realtime applications to Cloudflare's global network.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Realtime.
