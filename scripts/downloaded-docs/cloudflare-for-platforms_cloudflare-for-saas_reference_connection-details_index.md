---
title: Connection request details · Cloudflare for Platforms docs
description: "When forwarding connections to your origin server, Cloudflare will
  set request parameters according to the following:"
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/connection-details/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/reference/connection-details/index.md
---

When forwarding connections to your origin server, Cloudflare will set request parameters according to the following:

## Host header

Cloudflare will not alter the Host header by default, and will forward exactly as sent by the client. If you wish to change the value of the Host header you can utilise [Page-Rules](https://developers.cloudflare.com/workers/configuration/workers-with-page-rules/) or [Workers](https://developers.cloudflare.com/workers/) using the steps outlined in [certificate management](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/).

## SNI

When establishing a TLS connection to your origin server, if the request is being sent to your configured Fallback Host then the value of the SNI sent by Cloudflare will match the value of the Host header sent by the client (i.e. the custom hostname).

If however the request is being forwarded to a Custom Origin, then the value of the SNI will be that of the Custom Origin.
