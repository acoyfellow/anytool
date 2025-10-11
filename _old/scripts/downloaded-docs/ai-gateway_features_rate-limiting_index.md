---
title: Rate limiting · Cloudflare AI Gateway docs
description: Rate limiting controls the traffic that reaches your application,
  which prevents expensive bills and suspicious activity.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/features/rate-limiting/
  md: https://developers.cloudflare.com/ai-gateway/features/rate-limiting/index.md
---

Rate limiting controls the traffic that reaches your application, which prevents expensive bills and suspicious activity.

## Parameters

You can define rate limits as the number of requests that get sent in a specific time frame. For example, you can limit your application to 100 requests per 60 seconds.

You can also select if you would like a **fixed** or **sliding** rate limiting technique. With rate limiting, we allow a certain number of requests within a window of time. For example, if it is a fixed rate, the window is based on time, so there would be no more than `x` requests in a ten minute window. If it is a sliding rate, there would be no more than `x` requests in the last ten minutes.

To illustrate this, let us say you had a limit of ten requests per ten minutes, starting at 12:00. So the fixed window is 12:00-12:10, 12:10-12:20, and so on. If you sent ten requests at 12:09 and ten requests at 12:11, all 20 requests would be successful in a fixed window strategy. However, they would fail in a sliding window strategy since there were more than ten requests in the last ten minutes.

## Handling rate limits

When your requests exceed the allowed rate, you will encounter rate limiting. This means the server will respond with a `429 Too Many Requests` status code and your request will not be processed.

## Default configuration

* Dashboard

  To set the default rate limiting configuration in the dashboard:

  1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
  2. Go to **AI** > **AI Gateway**.
  3. Go to **Settings**.
  4. Enable **Rate-limiting**.
  5. Adjust the rate, time period, and rate limiting method as desired.

* API

  To set the default rate limiting configuration using the API:

  1. [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the following permissions:

  * `AI Gateway - Read`
  * `AI Gateway - Edit`

  1. Get your [Account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).
  2. Using that API token and Account ID, send a [`POST` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/) to create a new Gateway and include a value for the `rate_limiting_interval`, `rate_limiting_limit`, and `rate_limiting_technique`.

This rate limiting behavior will be uniformly applied to all requests for that gateway.
