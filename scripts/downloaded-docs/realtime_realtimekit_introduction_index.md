---
title: Introduction · Cloudflare Realtime docs
description: Cloudflare RealtimeKit allows you to integrate programmable and
  easily customizable live video and voice into your web, mobile, and desktop
  applications. With just a few lines of code, you can enable live video
  communication, voice calls, and interactive live streaming.
lastUpdated: 2025-08-18T10:34:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/realtimekit/introduction/
  md: https://developers.cloudflare.com/realtime/realtimekit/introduction/index.md
---

Cloudflare RealtimeKit allows you to integrate programmable and easily customizable live video and voice into your web, mobile, and desktop applications. With just a few lines of code, you can enable live video communication, voice calls, and interactive live streaming.

## How RealtimeKit Works

RealtimeKit is composed of three core components that work together to provide a complete real-time communication platform: the UI Kit, the Core SDK, and the backend infrastructure.

* **UI Kit**: It provides a library of pre-built, customizable UI components that sits on top of the Core SDK, allowing you to quickly build a polished user interface for your real-time application. The UI Kit is available for React, Angular, HTML, React Native, iOS, and Android.

* **Core SDK**: The Core SDK provides the business logic for the UI Kit. It **can be used independently** to build a custom UI from the ground up, but the UI Kit offers a simpler and faster way to get started. The SDK interacts directly with the RealtimeKit backend and SFU, providing powerful APIs for features like live video, audio, and streaming while abstracting away the complexities of WebRTC. The Core SDK is available for JavaScript, React, React Native, iOS, and Android.

* **Backend Infrastructure**: This is the foundation of RealtimeKit. It includes REST APIs for creating meetings, adding participants, retrieving session information, webhooks for server-side notifications, and so on. A dedicated socket server handles real-time signalling, while the [Realtime SFU](https://developers.cloudflare.com/realtime/sfu) relays media between users with low latency. The entire backend runs on Cloudflare's global network, ensuring reliability and scale.

## Use Cases

RealtimeKit is designed for a variety of real-time communication needs. Here are some of the most common use cases:

### Group Calls

Build collaborative experiences for team meetings, online classrooms, or social applications. These use cases are powered by WebRTC for real-time, low-latency communication.

* **Team Meetings:** Connect with your team through high-quality video conferencing. Share screens, record meetings, and use interactive features.
* **Virtual Classrooms:** Create engaging learning environments with live video and audio, whiteboards, and breakout rooms.
* **Social Networking:** Enable users to have private or group video chats within your platform.

### Webinars

Webinars are one-to-many events designed for a presenter to share information with a large, interactive audience. Unlike group calls where all participants collaborate freely, webinars have distinct roles for presenters and viewers, managed through [presets](https://developers.cloudflare.com/realtime/realtimekit/concepts/#presets). This structure, powered by WebRTC, is ideal for product demos, company all-hands, and live workshops, with features like chat, Q\&A, and polls to engage the audience.

* **Product Demos:** Showcase your product to a large audience with live video and Q\&A sessions.
* **Company All-Hands:** Broadcast company-wide meetings to all your employees, no matter where they are.
* **Live Workshops:** Conduct training sessions and workshops with a live instructor and interactive participation.

### Livestreaming

Livestreaming allows you to broadcast video to a large public audience. While the video itself is a one-way feed, you can enhance audience engagement by adding interactive features like chat and polls. This is powered by [Cloudflare Stream](https://developers.cloudflare.com/stream/) using HLS (HTTP Live Streaming) for maximum scalability, making it perfect for events like sports and concerts.

* **Live Sports:** Stream sporting events to fans around the world in real-time.
* **Gaming:** Build your own platform to livestream gameplay directly to your followers with RealtimeKit.
* **Concerts and Events:** Share live performances and events with a global audience.

## Capabilities

Explore the capabilities that you can incrementally add to your live video experiences.

* **[Recording](https://docs.realtime.cloudflare.com/guides/capabilities/recording/recording-overview):** Record meetings and save them to [Cloudflare R2](https://developers.cloudflare.com/r2/), or a provider of your choice.
* **[Chat](https://docs.realtime.cloudflare.com/web-core/chat/introduction):** Enable real-time text-based chat for participants during a video call.
* **[Polls](https://docs.realtime.cloudflare.com/web-core/polls/introduction):** Create and manage interactive polls to engage your audience during calls.
* **[Breakout Rooms](https://docs.realtime.cloudflare.com/guides/capabilities/breakoutroom/create-breakout-rooms):** Split participants into smaller, private groups for focused discussions.
* **[Virtual Backgrounds](https://docs.realtime.cloudflare.com/guides/capabilities/video/add-virtual-background):** Allow users to apply custom virtual backgrounds to their video streams.
* **[Video Filters](https://docs.realtime.cloudflare.com/guides/capabilities/video/processing) & [Audio Filters](https://docs.realtime.cloudflare.com/guides/capabilities/audio/processing):** Apply custom middlewares to create unique audio and video effects.
* **[Multi-Screen Share](https://docs.realtime.cloudflare.com/web-core/local-user/introduction#enable--disable-screen-share):** Allow multiple participants to share their screens simultaneously.
* **[Transcription](https://docs.realtime.cloudflare.com/guides/capabilities/audio/transcriptions):** Enable live transcription of audio from video calls for captions or records.
