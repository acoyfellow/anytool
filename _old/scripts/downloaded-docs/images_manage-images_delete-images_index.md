---
title: Delete images · Cloudflare Images docs
description: You can delete an image from the Cloudflare Images storage using
  the dashboard or the API.
lastUpdated: 2025-09-05T07:54:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/manage-images/delete-images/
  md: https://developers.cloudflare.com/images/manage-images/delete-images/index.md
---

You can delete an image from the Cloudflare Images storage using the dashboard or the API.

## Delete images via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to **Images** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/images)

2. Find the image you want to remove and select **Delete**.

3. (Optional) To delete more than one image, select the checkbox next to the images you want to delete and then **Delete selected**.

Your image will be deleted from your account.

## Delete images via the API

Make a `DELETE` request to the [delete image endpoint](https://developers.cloudflare.com/api/resources/images/subresources/v1/methods/delete/). `{image_id}` must be fully URL encoded in the API call URL.

```bash
curl --request DELETE https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id} \
--header "Authorization: Bearer <API_TOKEN>"
```

After the image has been deleted, the response returns `"success": true`.
