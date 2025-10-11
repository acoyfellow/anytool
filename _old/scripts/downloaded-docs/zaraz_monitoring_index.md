---
title: Monitoring · Cloudflare Zaraz docs
description: Zaraz Monitoring shows you different metrics regarding Zaraz. This
  helps you to detect issues when they occur. For example, if a third-party
  analytics provider stops collecting data, you can use the information
  presented by Zaraz Monitoring to find where in the workflow the problem
  occurred.
lastUpdated: 2025-09-05T07:54:06.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/zaraz/monitoring/
  md: https://developers.cloudflare.com/zaraz/monitoring/index.md
---

Zaraz Monitoring shows you different metrics regarding Zaraz. This helps you to detect issues when they occur. For example, if a third-party analytics provider stops collecting data, you can use the information presented by Zaraz Monitoring to find where in the workflow the problem occurred.

You can also check activity data in the **Activity last 24hr** section, when you access [tools](https://developers.cloudflare.com/zaraz/get-started/), [actions](https://developers.cloudflare.com/zaraz/custom-actions/) and [triggers](https://developers.cloudflare.com/zaraz/custom-actions/create-trigger/) in the dashboard.

To use Zaraz Monitoring:

1. In the Cloudflare dashboard, go to the **Monitoring** page.

   [Go to **Monitoring**](https://dash.cloudflare.com/?to=/:account/tag-management/monitoring)

2. Select one of the options (Loads, Events, Triggers, Actions). Zaraz Monitoring will show you how the traffic for that section evolved for the time period selected.

## Zaraz Monitoring options

* **Loads**: Counts how many times Zaraz was loaded on pages of your website. When [Single Page Application support](https://developers.cloudflare.com/zaraz/reference/settings/#single-page-application-support) is enabled, Loads will count every change of navigation as well.
* **Events**: Counts how many times a specific event was tracked by Zaraz. It includes the [Pageview event](https://developers.cloudflare.com/zaraz/get-started/), [Track events](https://developers.cloudflare.com/zaraz/web-api/track/), and [E-commerce events](https://developers.cloudflare.com/zaraz/web-api/ecommerce/).
* **Triggers**: Counts how many times a specific trigger was activated. It includes the built-in [Pageview trigger](https://developers.cloudflare.com/zaraz/custom-actions/create-trigger/) and any other trigger you set in Zaraz.
* **Actions**: Counts how many times a [specific action](https://developers.cloudflare.com/zaraz/custom-actions/) was activated. It includes the pre-configured Pageview action, and any other actions you set in Zaraz.
* **Server-side requests**: tracks the status codes returned from server-side requests that Zaraz makes to your third-party tools.
