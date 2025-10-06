---
title: Pricing · Cloudflare Containers docs
description: "Containers are billed for every 10ms that they are actively
  running at the following rates, with included monthly usage as part of the $5
  USD per month Workers Paid plan:"
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/pricing/
  md: https://developers.cloudflare.com/containers/pricing/index.md
---

## vCPU, Memory and Disk

Containers are billed for every 10ms that they are actively running at the following rates, with included monthly usage as part of the $5 USD per month [Workers Paid plan](https://developers.cloudflare.com/workers/platform/pricing/):

| | Memory | CPU | Disk |
| - | - | - | - |
| **Free** | N/A | N/A | |
| **Workers Paid** | 25 GiB-hours/month included +$0.0000025 per additional GiB-second | 375 vCPU-minutes/month + $0.000020 per additional vCPU-second | 200 GB-hours/month +$0.00000007 per additional GB-second |

You only pay for what you use — charges start when a request is sent to the container or when it is manually started. Charges stop after the container instance goes to sleep, which can happen automatically after a timeout. This makes it easy to scale to zero, and allows you to get high utilization even with bursty traffic.

#### Instance Types

When you add containers to your Worker, you specify an [instance type](https://developers.cloudflare.com/containers/platform-details/#instance-types). The instance type you select will impact your bill — larger instances include more vCPUs, memory and disk, and therefore incur additional usage costs. The following instance types are currently available, and larger instance types are coming soon:

| Name | Memory | CPU | Disk |
| - | - | - | - |
| dev | 256 MiB | 1/16 vCPU | 2 GB |
| basic | 1 GiB | 1/4 vCPU | 4 GB |
| standard | 4 GiB | 1/2 vCPU | 4 GB |

## Network Egress

Egress from Containers is priced at the following rates:

| Region | Price per GB | Included Allotment per month |
| - | - | - |
| North America & Europe | $0.025 | 1 TB |
| Oceania, Korea, Taiwan | $0.05 | 500 GB |
| Everywhere Else | $0.04 | 500 GB |

## Workers and Durable Objects Pricing

When you use Containers, incoming requests to your containers are handled by your [Worker](https://developers.cloudflare.com/workers/platform/pricing/), and each container has its own [Durable Object](https://developers.cloudflare.com/durable-objects/platform/pricing/). You are billed for your usage of both Workers and Durable Objects.

## Logs and Observability

Containers are integrated with the [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) platform, and billed at the same rate. Refer to [Workers Logs pricing](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#pricing) for details.

When you [enable observability for your Worker](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs) with a binding to a container, logs from your container will show in both the Containers and Observability sections of the Cloudflare dashboard.
