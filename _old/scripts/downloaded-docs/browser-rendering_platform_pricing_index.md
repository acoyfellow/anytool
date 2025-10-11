---
title: Pricing · Cloudflare Browser Rendering docs
description: "There are two ways to use Browser Rendering. Depending on the
  method you use, here is how billing works:"
lastUpdated: 2025-09-15T16:22:10.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/platform/pricing/
  md: https://developers.cloudflare.com/browser-rendering/platform/pricing/index.md
---

There are two ways to use Browser Rendering. Depending on the method you use, here is how billing works:

* [**REST API**](https://developers.cloudflare.com/browser-rendering/rest-api/): Charged for **Duration** only ($/browser hour)
* [**Workers Bindings**](https://developers.cloudflare.com/browser-rendering/workers-bindings/): Charged for both **Duration** and **Concurrency** ($/browser hour and # of concurrent browsers)

| Plan | Included duration | Included concurrency | Price (beyond included) |
| - | - | - | - |
| **Workers Free** | 10 minutes per day | 3 concurrent browsers | N/A |
| **Workers Paid** | 10 hours per month | 10 concurrent browsers (averaged monthly) | **1. REST API**: $0.09 per additional browser hour **2. Workers Bindings**: $0.09 per additional browser hour $2.00 per additional concurrent browser |

## Examples of Workers Paid pricing



#### Example: REST API pricing

If a Workers Paid user uses the REST API for 50 hours during the month, the estimated cost for the month is as follows.

For **browser duration**:\
50 hours - 10 hours (included in plan) = 40 hours\
40 hours × $0.09 per hour = $3.60

#### Example: Workers Bindings pricing

If a Workers paid user uses the Workers Bindings method for 50 hours during the month, and uses 10 concurrent browsers for the first 15 days and 20 concurrent browsers the last 15 days, the estimated cost for the month is as follows.

For **browser duration**:\
50 hours - 10 hours (included in plan) = 40 hours\
40 hours × $0.09 per hour = $3.60

For **concurrent browsers**:\
((10 browsers × 15 days) + (20 browsers × 15 days)) = 450 total browsers used in month\
450 browsers used in month ÷ 30 days in month = 15 browsers (averaged monthly)\
15 browsers (averaged monthly) − 10 (included in plan) = 5 browsers\
5 browsers × $2.00 per browser = $10.00

For **browser duration** and **concurrent browsers**:\
$3.60 + $10.00 = $13.60

## FAQ

### How do I estimate my Browser Rendering costs?

To monitor your Browser Rendering usage in the Cloudflare dashboard, go to the **Browser Rendering** page.

[Go to **Browser Rendering**](https://dash.cloudflare.com/?to=/:account/workers/browser-rendering)

Then, you can use [the pricing page](https://developers.cloudflare.com/browser-rendering/platform/pricing/) to estimate your costs.

### Do failed API calls, such as those that time out, add to billable browser hours?

No. If a request to the Browser Rendering REST API fails with a `waitForTimeout` error, the browser session is not charged.

### How is the number of concurrent browsers calculated?

Cloudflare calculates concurrent browsers as the monthly average of your daily peak usage. In other words, we record the peak number of concurrent browsers each day and then average those values over the month. This approach reflects your typical traffic and ensures you are not disproportionately charged for brief spikes in browser concurrency.

### How is billing time calculated?

At the end of each day, Cloudflare totals all of your browser usage for that day in seconds. At the end of each billing cycle, we add up all of the daily totals to find the monthly total of browser hours, rounded to the nearest hour.

For example, if you only use 1 minute of browser time in a day, that day counts as 1 minute. If you do that every day for a 30-day month, your total would be 30 minutes. For billing, we round that up to 1 browser hour.
