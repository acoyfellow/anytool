---
title: Test Email Routing · Cloudflare Email Routing docs
description: To test that your configuration is working properly, send an email
  to the custom address you set up in the dashboard. You should send your test
  email from a different address than the one you specified as the destination
  address.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/email-routing/get-started/test-email-routing/
  md: https://developers.cloudflare.com/email-routing/get-started/test-email-routing/index.md
---

To test that your configuration is working properly, send an email to the custom address [you set up in the dashboard](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/). You should send your test email from a different address than the one you specified as the destination address.

For example, if you set up `your-name@gmail.com` as the destination address, do not send your test email from that same Gmail account. Send a test email to that destination address from another email account (for example, `your-name@outlook.com`).

The reason for this is that some email providers will discard what they interpret as an incoming duplicate email and will not show it in your inbox, making it seem like Email Routing is not working properly.
