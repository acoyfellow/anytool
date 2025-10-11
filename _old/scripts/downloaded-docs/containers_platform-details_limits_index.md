---
title: Limits and Instance Types · Cloudflare Containers docs
description: >-
  The memory, vCPU, and disk space for Containers are set through predefined
  instance types.

  Six instance types are currently available:
lastUpdated: 2025-10-01T19:57:11.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/platform-details/limits/
  md: https://developers.cloudflare.com/containers/platform-details/limits/index.md
---

## Instance Types

The memory, vCPU, and disk space for Containers are set through predefined instance types. Six instance types are currently available:

| Instance Type | vCPU | Memory | Disk |
| - | - | - | - |
| lite | 1/16 | 256 MiB | 2 GB |
| basic | 1/4 | 1 GiB | 4 GB |
| standard-1 | 1/2 | 4 GiB | 8 GB |
| standard-2 | 1 | 6 GiB | 12 GB |
| standard-3 | 2 | 8 GiB | 16 GB |
| standard-4 | 4 | 12 GiB | 20 GB |

These are specified using the [`instance_type` property](https://developers.cloudflare.com/workers/wrangler/configuration/#containers) in your Worker's Wrangler configuration file. Looking for larger instances? [Give us feedback here](https://developers.cloudflare.com/containers/beta-info/#feedback-wanted) and tell us what size instances you need, and what you want to use them for.

Note

The `dev` and `standard` instance types are preserved for backward compatibility and are aliases for `lite` and `standard-1`, respectively.

## Limits

While in open beta, the following limits are currently in effect:

| Feature | Workers Paid |
| - | - |
| GiB Memory for all concurrent live Container instances | 400GiB |
| vCPU for all concurrent live Container instances | 100 |
| TB Disk for all concurrent live Container instances | 2TB |
| Image size | Same as [instance disk space](#instance-types) |
| Total image storage per account | 50 GB [1](#user-content-fn-1) |

## Footnotes

1. Delete container images with `wrangler containers delete` to free up space. Note that if you delete a container image and then [roll back](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/) your Worker to a previous version, this version may no longer work. [↩](#user-content-fnref-1)
