---
title: Send Zaraz logs to Logpush · Cloudflare Zaraz docs
description: Send Zaraz logs to an external storage provider like R2 or S3.
lastUpdated: 2025-09-23T13:15:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/zaraz/advanced/logpush/
  md: https://developers.cloudflare.com/zaraz/advanced/logpush/index.md
---

Send Zaraz logs to an external storage provider like R2 or S3.

This is an Enterprise only feature.

## Setup

Follow these steps to configure Logpush support for Zaraz:

### 1. Create a Logpush job

1. In the Cloudflare dashboard, go to the **Logpush** page.

   [Go to **Logpush**](https://dash.cloudflare.com/?to=/:account/:zone/analytics/logs)

2. Select **Create a Logpush Job** and follow the steps described in the [Logpush](https://developers.cloudflare.com/logs/logpush/) documentation.\
   When selecting a dataset, make sure you select **Zaraz Events**.

### 2. Enable Logpush from Zaraz settings

1. Go to your website's [Zaraz settings](https://dash.cloudflare.com/?to=/:account/:zone/zaraz/settings).
2. Enable **Export Zaraz Logs**.

## Fields

Logs will have the following fields:

| Field | Type | Description |
| - | - | - |
| RequestHeaders | `JSON` | The headers that were sent with the request. |
| URL | `String` | The Zaraz URL to which the request was made. |
| IP | `String` | The originating IP. |
| Body | `JSON` | The body that was sent along with the request. |
| Event Type | `String` | Can be one of the following: `server_request`, `server_response`, `action_triggered`, `ecommerce_triggered`, `client_request`, `component_error`. |
| Event Details | `JSON` | Details about the event. |
| TimestampStart | `String` | The time at which the event occurred. |
