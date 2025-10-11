---
title: Manage gateways · Cloudflare AI Gateway docs
description: You have several different options for managing an AI Gateway.
lastUpdated: 2025-08-20T18:25:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-gateway/configuration/manage-gateway/
  md: https://developers.cloudflare.com/ai-gateway/configuration/manage-gateway/index.md
---

You have several different options for managing an AI Gateway.

## Create gateway

* Dashboard

  [Create a Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway#create)

  1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
  2. Go to **AI** > **AI Gateway**.
  3. Select **Create Gateway**.
  4. Enter your **Gateway name**. Note: Gateway name has a 64 character limit.
  5. Select **Create**.

* API

  To set up an AI Gateway using the API:

  1. [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the following permissions:

     * `AI Gateway - Read`
     * `AI Gateway - Edit`

  2. Get your [Account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).

  3. Using that API token and Account ID, send a [`POST` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/) to the Cloudflare API.

## Edit gateway

* Dashboard

  To edit an AI Gateway in the dashboard:

  1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
  2. Go to **AI** > **AI Gateway**.
  3. Select your gateway.
  4. Go to **Settings** and update as needed.

* API

  To edit an AI Gateway, send a [`PUT` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/update/) to the Cloudflare API.

Note

For more details about what settings are available for editing, refer to [Configuration](https://developers.cloudflare.com/ai-gateway/configuration/).

## Delete gateway

Deleting your gateway is permanent and can not be undone.

* Dashboard

  To delete an AI Gateway in the dashboard:

  1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
  2. Go to **AI** > **AI Gateway**.
  3. Select your gateway from the list of available options.
  4. Go to **Settings**.
  5. For **Delete Gateway**, select **Delete** (and confirm your deletion).

* API

  To delete an AI Gateway, send a [`DELETE` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/delete/) to the Cloudflare API.
