---
title: Overview · Cloudflare Privacy Gateway docs
description: Privacy Gateway is a managed service deployed on Cloudflare’s
  global network that implements part of the Oblivious HTTP (OHTTP) IETF
  standard. The goal of Privacy Gateway and Oblivious HTTP is to hide the
  client's IP address when interacting with an application backend.
lastUpdated: 2025-03-14T16:33:10.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/privacy-gateway/
  md: https://developers.cloudflare.com/privacy-gateway/index.md
---

Implements the Oblivious HTTP IETF standard to improve client privacy.

Enterprise-only

[Privacy Gateway](https://blog.cloudflare.com/building-privacy-into-internet-standards-and-how-to-make-your-app-more-private-today/) is a managed service deployed on Cloudflare’s global network that implements part of the [Oblivious HTTP (OHTTP) IETF](https://www.ietf.org/archive/id/draft-thomson-http-oblivious-01.html) standard. The goal of Privacy Gateway and Oblivious HTTP is to hide the client's IP address when interacting with an application backend.

OHTTP introduces a trusted third party between client and server, called a relay, whose purpose is to forward encrypted requests and responses between client and server. These messages are encrypted between client and server such that the relay learns nothing of the application data, beyond the length of the encrypted message and the server the client is interacting with.

***

## Availability

Privacy Gateway is currently in closed beta – available to select privacy-oriented companies and partners. If you are interested, [contact us](https://www.cloudflare.com/lp/privacy-edge/).

***

## Features

### Get started

Learn how to set up Privacy Gateway for your application.

[Get started](https://developers.cloudflare.com/privacy-gateway/get-started/)

### Legal

Learn about the different parties and data shared in Privacy Gateway.

[Learn more](https://developers.cloudflare.com/privacy-gateway/reference/legal/)

### Metrics

Learn about how to query Privacy Gateway metrics.

[Learn more](https://developers.cloudflare.com/privacy-gateway/reference/metrics/)
