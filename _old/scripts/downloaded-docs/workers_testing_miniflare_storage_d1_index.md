---
title: 💾 D1 · Cloudflare Workers docs
description: "Specify D1 Databases to add to your environment as follows:"
lastUpdated: 2025-01-09T09:58:03.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/testing/miniflare/storage/d1/
  md: https://developers.cloudflare.com/workers/testing/miniflare/storage/d1/index.md
---

* [D1 Reference](https://developers.cloudflare.com/d1/)

## Databases

Specify D1 Databases to add to your environment as follows:

```js
const mf = new Miniflare({
  d1Databases:{
    DB:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
});
```

## Working with D1 Databases

For testing, it can be useful to put/get data from D1 storage bound to a Worker. You can do this with the `getD1Database` method:

```js
const db = await mf.getD1Database("DB");
const stmt = await db.prepare("<Query>");
const returnValue = await stmt.run();


return Response.json(returnValue.results);
```
