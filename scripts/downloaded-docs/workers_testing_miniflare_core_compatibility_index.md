---
title: 📅 Compatibility Dates · Cloudflare Workers docs
description: >-
  Miniflare uses compatibility dates to opt-into backwards-incompatible changes

  from a specific date. If one isn't set, it will default to some time far in
  the

  past.
lastUpdated: 2024-12-18T20:15:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/core/compatibility/
  md: https://developers.cloudflare.com/workers/testing/miniflare/core/compatibility/index.md
---

* [Compatibility Dates Reference](https://developers.cloudflare.com/workers/configuration/compatibility-dates)

## Compatibility Dates

Miniflare uses compatibility dates to opt-into backwards-incompatible changes from a specific date. If one isn't set, it will default to some time far in the past.

```js
const mf = new Miniflare({
  compatibilityDate: "2021-11-12",
});
```

## Compatibility Flags

Miniflare also lets you opt-in/out of specific changes using compatibility flags:

```js
const mf = new Miniflare({
  compatibilityFlags: [
    "formdata_parser_supports_files",
    "durable_object_fetch_allows_relative_url",
  ],
});
```
