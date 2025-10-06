---
title: Delete variants · Cloudflare Images docs
description: You can delete variants via the Images dashboard or API. The only
  variant you cannot delete is public.
lastUpdated: 2025-09-05T07:54:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/manage-images/delete-variants/
  md: https://developers.cloudflare.com/images/manage-images/delete-variants/index.md
---

You can delete variants via the Images dashboard or API. The only variant you cannot delete is public.

Warning

Deleting a variant is a global action that will affect other images that contain that variant.

## Delete variants via the Cloudflare dashboard

1. In the Cloudflare dashboard, go to the **Variants** page.

   [Go to **Variants**](https://dash.cloudflare.com/?to=/:account/images/variants)

2. Find the variant you want to remove and select **Delete**.

## Delete variants via the API

Make a `DELETE` request to the delete variant endpoint.

```bash
curl --request DELETE https://api.cloudflare.com/client/v4/account/{account_id}/images/v1/variants/{variant_name} \
--header "Authorization: Bearer <API_TOKEN>"
```

After the variant has been deleted, the response returns `"success": true.`
