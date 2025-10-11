---
title: Common API Calls · Cloudflare for Platforms docs
description: As a SaaS provider, you may want to configure and manage Cloudflare
  for SaaS via the API rather than the Cloudflare dashboard. Below are relevant
  API calls for creating, editing, and deleting custom hostnames, as well as
  monitoring, updating, and deleting fallback origins. Further details can be
  found in the Cloudflare API documentation.
lastUpdated: 2024-12-16T22:33:26.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/common-api-calls/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/common-api-calls/index.md
---

As a SaaS provider, you may want to configure and manage Cloudflare for SaaS [via the API](https://developers.cloudflare.com/api/) rather than the [Cloudflare dashboard](https://dash.cloudflare.com/). Below are relevant API calls for creating, editing, and deleting custom hostnames, as well as monitoring, updating, and deleting fallback origins. Further details can be found in the [Cloudflare API documentation](https://developers.cloudflare.com/api/).

***

## Custom hostnames

| Endpoint | Notes |
| - | - |
| [List custom hostnames](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/list/) | Use the `page` parameter to pull additional pages. Add a `hostname` parameter to search for specific hostnames. |
| [Create custom hostname](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/create/) | In the `validation_records` object of the response, use the `txt_name` and `txt_record` listed to validate the custom hostname. |
| [Custom hostname details](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/get/) | |
| [Edit custom hostname](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/edit/) | When sent with an `ssl` object that matches the existing value, indicates that hostname should restart domain control validation (DCV). |
| [Delete custom hostname](https://developers.cloudflare.com/api/resources/custom_hostnames/methods/delete/) | Also deletes any associated SSL/TLS certificates. |

## Fallback origins

Our API includes the following endpoints related to the [fallback origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/#1-create-fallback-origin) of a custom hostname:

* [Get fallback origin](https://developers.cloudflare.com/api/resources/custom_hostnames/subresources/fallback_origin/methods/get/)
* [Update fallback origin](https://developers.cloudflare.com/api/resources/custom_hostnames/subresources/fallback_origin/methods/update/)
* [Remove fallback origin](https://developers.cloudflare.com/api/resources/custom_hostnames/subresources/fallback_origin/methods/delete/)
