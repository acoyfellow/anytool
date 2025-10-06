---
title: Legacy pipelines · Cloudflare Pipelines Docs
description: Legacy pipelines, those created before September 25, 2025 via the
  legacy API, are on a deprecation path.
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/reference/legacy-pipelines/
  md: https://developers.cloudflare.com/pipelines/reference/legacy-pipelines/index.md
---

Legacy pipelines, those created before September 25, 2025 via the legacy API, are on a deprecation path.

To check if your pipelines are legacy pipelines, view them in the dashboard under **Pipelines** > **Pipelines** or run the [`pipelines list`](https://developers.cloudflare.com/workers/wrangler/commands/#pipelines-list) command in [Wrangler](https://developers.cloudflare.com/workers/wrangler/). Legacy pipelines are labeled "legacy" in both locations.

New pipelines offer SQL transformations, multiple output formats, and improved architecture.

## Notable changes

* New pipelines support SQL transformations for data processing.
* New pipelines write to JSON, Parquet, and Apache Iceberg formats instead of JSON only.
* New pipelines separate streams, pipelines, and sinks into distinct resources.
* New pipelines support optional structured schemas with validation.
* New pipelines offer configurable rolling policies and customizable partitioning.

## Moving to new pipelines

Legacy pipelines will continue to work until Pipelines is Generally Available, but new features and improvements are only available in the new pipeline architecture. To migrate:

1. Create a new pipeline using the interactive setup:

   ```bash
   npx wrangler pipelines setup
   ```

2. Configure your new pipeline with the desired streams, SQL transformations, and sinks.

3. Update your applications to send data to the new stream endpoints.

4. Once verified, delete your legacy pipeline.

For detailed guidance, refer to the [getting started guide](https://developers.cloudflare.com/pipelines/getting-started/).
