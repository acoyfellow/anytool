---
title: Version metadata binding · Cloudflare Workers docs
description: Exposes Worker version metadata (`versionID` and `versionTag`).
  These fields can be added to events emitted from the Worker to send to
  downstream observability systems.
lastUpdated: 2025-01-29T12:28:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/bindings/version-metadata/
  md: https://developers.cloudflare.com/workers/runtime-apis/bindings/version-metadata/index.md
---

The version metadata binding can be used to access metadata associated with a [version](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/#versions) from inside the Workers runtime.

Worker version ID, version tag and timestamp of when the version was created are available through the version metadata binding. They can be used in events sent to [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) or to any third-party analytics/metrics service in order to aggregate by Worker version.

To use the version metadata binding, update your Worker's Wrangler file:

* wrangler.jsonc

  ```jsonc
  {
    "version_metadata": {
      "binding": "CF_VERSION_METADATA"
    }
  }
  ```

* wrangler.toml

  ```toml
  [version_metadata]
  binding = "CF_VERSION_METADATA"
  ```

### Interface

An example of how to access the version ID and version tag from within a Worker to send events to [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/):

* JavaScript

  ```js
  export default {
    async fetch(request, env, ctx) {
      const { id: versionId, tag: versionTag, timestamp: versionTimestamp } = env.CF_VERSION_METADATA;
      env.WAE.writeDataPoint({
        indexes: [versionId],
        blobs: [versionTag, versionTimestamp],
        //...
      });
      //...
    },
  };
  ```

* TypeScript

  ```ts
  interface Environment {
    CF_VERSION_METADATA: WorkerVersionMetadata;
    WAE: AnalyticsEngineDataset;
  }


  export default {
    async fetch(request, env, ctx) {
      const { id: versionId, tag: versionTag } = env.CF_VERSION_METADATA;
      env.WAE.writeDataPoint({
        indexes: [versionId],
        blobs: [versionTag],
        //...
      });
      //...
    },
  } satisfies ExportedHandler<Env>;
  ```
