---
title: Remote development · Cloudflare D1 docs
description: D1 supports remote development using the dashboard playground. The
  dashboard playground uses a browser version of Visual Studio Code, allowing
  you to rapidly iterate on your Worker entirely in your browser.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/best-practices/remote-development/
  md: https://developers.cloudflare.com/d1/best-practices/remote-development/index.md
---

D1 supports remote development using the [dashboard playground](https://developers.cloudflare.com/workers/playground/#use-the-playground). The dashboard playground uses a browser version of Visual Studio Code, allowing you to rapidly iterate on your Worker entirely in your browser.

## 1. Bind a D1 database to a Worker

Note

This guide assumes you have previously created a Worker, and a D1 database.

Users new to D1 and/or Cloudflare Workers should read the [D1 tutorial](https://developers.cloudflare.com/d1/get-started/) to install `wrangler` and deploy their first database.

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select an existing Worker.

3. Go to the **Bindings** tab.

4. Select **Add binding**.

5. Select **D1 database** > **Add binding**.

6. Enter a variable name, such as `DB`, and select the D1 database you wish to access from this Worker.

7. Select **Add binding**.

## 2. Start a remote development session

1. On the Worker's page on the Cloudflare dashboard, select **Edit Code** at the top of the page.
2. Your Worker now has access to D1.

Use the following Worker script to verify that the Worker has access to the bound D1 database:

```js
export default {
  async fetch(request, env, ctx) {
    const res = await env.DB.prepare("SELECT 1;").run();
    return new Response(JSON.stringify(res, null, 2));
  },
};
```

## Related resources

* Learn [how to debug D1](https://developers.cloudflare.com/d1/observability/debug-d1/).
* Understand how to [access logs](https://developers.cloudflare.com/workers/observability/logs/) generated from your Worker and D1.
