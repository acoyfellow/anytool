---
title: 🔑 Variables and Secrets · Cloudflare Workers docs
description: "Variable and secrets are bound as follows:"
lastUpdated: 2024-12-18T20:15:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/core/variables-secrets/
  md: https://developers.cloudflare.com/workers/testing/miniflare/core/variables-secrets/index.md
---

## Bindings

Variable and secrets are bound as follows:

```js
const mf = new Miniflare({
  bindings: {
    KEY1: "value1",
    KEY2: "value2",
  },
});
```

## Text and Data Blobs

Text and data blobs can be loaded from files. File contents will be read and bound as `string`s and `ArrayBuffer`s respectively.

```js
const mf = new Miniflare({
  textBlobBindings: { TEXT: "text.txt" },
  dataBlobBindings: { DATA: "data.bin" },
});
```

## Globals

Injecting arbitrary globals is not supported by [workerd](https://github.com/cloudflare/workerd). If you're using a service Worker, bindings will be injected as globals, but these must be JSON-serialisable.
