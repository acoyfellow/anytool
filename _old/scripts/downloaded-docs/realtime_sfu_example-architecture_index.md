---
title: Example architecture · Cloudflare Realtime docs
lastUpdated: 2025-08-12T17:36:47.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/sfu/example-architecture/
  md: https://developers.cloudflare.com/realtime/sfu/example-architecture/index.md
---

![Example Architecture](https://developers.cloudflare.com/_astro/video-calling-application.CIYa-lzM_e7Gu.webp)

1. Clients connect to the backend service
2. Backend service manages the relationship between the clients and the tracks they should subscribe to
3. Backend service contacts the Cloudflare Realtime API to pass the SDP from the clients to establish the WebRTC connection.
4. Realtime API relays back the Realtime API SDP reply and renegotiation messages.
5. If desired, headless clients can be used to record the content from other clients or publish content.
6. Admin manages the rooms and room members.
