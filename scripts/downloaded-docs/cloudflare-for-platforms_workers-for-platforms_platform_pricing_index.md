---
title: Pricing · Cloudflare for Platforms docs
description: The Workers for Platforms Paid plan is $25 monthly. Workers for
  Platforms can be purchased through the Cloudflare dashboard.
lastUpdated: 2025-08-11T21:01:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/
  md: https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/index.md
---

The Workers for Platforms Paid plan is **$25 monthly**. Workers for Platforms can be purchased through the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers-for-platforms).

Workers for Platforms comes with the following usage allotments and overage pricing.

| | Requests1 2 | Duration | CPU time2 | Scripts |
| - | - | - | - | - |
| | 20 million requests included per month +$0.30 per additional million | No charge or limit for duration | 60 million CPU milliseconds included per month +$0.02 per additional million CPU milliseconds Max of 30 seconds of CPU time per invocation Max of 15 minutes of CPU time per [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/) or [Queue Consumer](https://developers.cloudflare.com/queues/configuration/javascript-apis/#consumer) invocation | 1000 scripts +$0.02 per additional script |

1 Inbound requests to your Worker. Cloudflare does not bill for [subrequests](https://developers.cloudflare.com/workers/platform/limits/#subrequests) you make from your Worker.\
2 Workers for Platforms only charges for 1 request across the chain of [dispatch Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#dynamic-dispatch-worker) -> [user Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/#user-workers) -> [outbound Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/). CPU time is charged across these Workers.

## Example pricing:

A Workers for Platforms project that serves 100 million requests per month, uses an average of 10 milliseconds (ms) of CPU time per request and uses 1200 scripts would have the following estimated costs:

| | Monthly Costs | Formula |
| - | - | - |
| **Subscription** | $25.00 | |
| **Requests** | $24.00 | (100,000,000 requests - 20,000,000 included requests) / 1,000,000 \* $0.30 |
| **CPU time** | $18.80 | ((10 ms of CPU time per request \* 100,000,000 requests) - 60,000,000 included CPU ms) / 1,000,000 \* $0.02 |
| **Scripts** | $4.00 | (1200 scripts - 1000 included scripts) \* $0.02 |
| **Total** | $71.80 | |

Custom limits

Set [custom limits](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/custom-limits/) for user Workers to get control over your Cloudflare bill, prevent accidental runaway bills or denial-of-wallet attacks. Configure the maximum amount of CPU time that can be used per invocation by [defining custom limits in your dispatch Worker](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/custom-limits/#set-custom-limits).
