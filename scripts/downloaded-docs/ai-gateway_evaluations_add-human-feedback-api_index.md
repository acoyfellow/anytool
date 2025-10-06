---
title: Add Human Feedback using API · Cloudflare AI Gateway docs
description: This guide will walk you through the steps of adding human feedback
  to an AI Gateway request using the Cloudflare API. You will learn how to
  retrieve the relevant request logs, and submit feedback using the API.
lastUpdated: 2025-08-19T11:42:14.000Z
chatbotDeprioritize: true
source_url:
  html: https://developers.cloudflare.com/ai-gateway/evaluations/add-human-feedback-api/
  md: https://developers.cloudflare.com/ai-gateway/evaluations/add-human-feedback-api/index.md
---

This guide will walk you through the steps of adding human feedback to an AI Gateway request using the Cloudflare API. You will learn how to retrieve the relevant request logs, and submit feedback using the API.

If you prefer to add human feedback via the dashboard, refer to [Add Human Feedback](https://developers.cloudflare.com/ai-gateway/evaluations/add-human-feedback/).

## 1. Create an API Token

1. [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the following permissions:

* `AI Gateway - Read`
* `AI Gateway - Edit`

1. Get your [Account ID](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).
2. Using that API token and Account ID, send a [`POST` request](https://developers.cloudflare.com/api/resources/ai_gateway/methods/create/) to the Cloudflare API.

## 2. Retrieve the `cf-aig-log-id`

The `cf-aig-log-id` is a unique identifier for the specific log entry to which you want to add feedback. Below are two methods to obtain this identifier.

### Method 1: Locate the `cf-aig-log-id` in the request response

This method allows you to directly find the `cf-aig-log-id` within the header of the response returned by the AI Gateway. This is the most straightforward approach if you have access to the original API response.

The steps below outline how to do this.

1. **Make a Request to the AI Gateway**: This could be a request your application sends to the AI Gateway. Once the request is made, the response will contain various pieces of metadata.
2. **Check the Response Headers**: The response will include a header named `cf-aig-log-id`. This is the identifier you will need to submit feedback.

In the example below, the `cf-aig-log-id` is `01JADMCQQQBWH3NXZ5GCRN98DP`.

```json
{
  "status": "success",
  "headers": {
    "cf-aig-log-id": "01JADMCQQQBWH3NXZ5GCRN98DP"
  },
  "data": {
    "response": "Sample response data"
  }
}
```

### Method 2: Retrieve the `cf-aig-log-id` via API (GET request)

If you do not have the `cf-aig-log-id` in the response body or you need to access it after the fact, you are able to retrieve it by querying the logs using the [Cloudflare API](https://developers.cloudflare.com/api/resources/ai_gateway/subresources/logs/methods/list/).

Send a `GET` request to get a list of logs and then find a specific ID

Required API token permissions

At least one of the following [token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) is required:

* `AI Gateway Write`
* `AI Gateway Read`

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai-gateway/gateways/$GATEWAY_ID/logs" \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

```json
{
  "result": [
    {
      "id": "01JADMCQQQBWH3NXZ5GCRN98DP",
      "cached": true,
      "created_at": "2019-08-24T14:15:22Z",
      "custom_cost": true,
      "duration": 0,
      "id": "string",
      "metadata": "string",
      "model": "string",
      "model_type": "string",
      "path": "string",
      "provider": "string",
      "request_content_type": "string",
      "request_type": "string",
      "response_content_type": "string",
      "status_code": 0,
      "step": 0,
      "success": true,
      "tokens_in": 0,
      "tokens_out": 0
    }
  ]
}
```

### Method 3: Retrieve the `cf-aig-log-id` via a binding

You can also retrieve the `cf-aig-log-id` using a binding, which streamlines the process. Here's how to retrieve the log ID directly:

```js
const resp = await env.AI.run(
  "@cf/meta/llama-3-8b-instruct",
  {
    prompt: "tell me a joke",
  },
  {
    gateway: {
      id: "my_gateway_id",
    },
  },
);


const myLogId = env.AI.aiGatewayLogId;
```

Note:

The `aiGatewayLogId` property, will only hold the last inference call log id.

## 3. Submit feedback via PATCH request

Once you have both the API token and the `cf-aig-log-id`, you can send a PATCH request to submit feedback.

Required API token permissions

At least one of the following [token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) is required:

* `AI Gateway Write`

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai-gateway/gateways/$GATEWAY_ID/logs/$ID" \
  --request PATCH \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "feedback": 1
  }'
```

If you had negative feedback, adjust the body of the request to be `-1`.

```json
{
  "feedback": -1
}
```

## 4. Verify the feedback submission

You can verify the feedback submission in two ways:

* **Through the [Cloudflare dashboard ](https://dash.cloudflare.com)**: check the updated feedback on the AI Gateway interface.
* **Through the API**: Send another GET request to retrieve the updated log entry and confirm the feedback has been recorded.
