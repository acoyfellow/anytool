---
title: Functions - Get started · Cloudflare Pages docs
description: This guide will instruct you on creating and deploying a Pages Function.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/functions/get-started/
  md: https://developers.cloudflare.com/pages/functions/get-started/index.md
---

This guide will instruct you on creating and deploying a Pages Function.

## Prerequisites

You must have a Pages project set up on your local machine or deployed on the Cloudflare dashboard. To create a Pages project, refer to [Get started](https://developers.cloudflare.com/pages/get-started/).

## Create a Function

To get started with generating a Pages Function, create a `/functions` directory. Make sure that the `/functions` directory is at the root of your Pages project (and not in the static root, such as `/dist`).

Advanced mode

For existing applications where Pages Functions’ built-in file path based routing and middleware system is not desirable, use [Advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/). Advanced mode allows you to develop your Pages Functions with a `_worker.js` file rather than the `/functions` directory.

Writing your Functions files in the `/functions` directory will automatically generate a Worker with custom functionality at predesignated routes.

Copy and paste the following code into a `helloworld.js` file that you create in your `/functions` folder:

```js
export function onRequest(context) {
  return new Response("Hello, world!");
}
```

In the above example code, the `onRequest` handler takes a request [`context`](https://developers.cloudflare.com/pages/functions/api-reference/#eventcontext) object. The handler must return a `Response` or a `Promise` of a `Response`.

This Function will run on the `/helloworld` route and returns `"Hello, world!"`. The reason this Function is available on this route is because the file is named `helloworld.js`. Similarly, if this file was called `howdyworld.js`, this function would run on `/howdyworld`.

Refer to [Routing](https://developers.cloudflare.com/pages/functions/routing/) for more information on route customization.

### Runtime features

[Workers runtime features](https://developers.cloudflare.com/workers/runtime-apis/) are configurable on Pages Functions, including [compatibility with a subset of Node.js APIs](https://developers.cloudflare.com/workers/runtime-apis/nodejs) and the ability to set a [compatibility date or compatibility flag](https://developers.cloudflare.com/workers/configuration/compatibility-dates/).

Set these configurations by passing an argument to your [Wrangler](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) command or by setting them in the dashboard. To set Pages compatibility flags in the Cloudflare dashboard:

1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Select **Workers & Pages** and select your Pages project.
3. Select **Settings** > **Functions** > **Compatibility Flags**.
4. Configure your Production and Preview compatibility flags as needed.

Additionally, use other Cloudflare products such as [D1](https://developers.cloudflare.com/d1/) (serverless DB) and [R2](https://developers.cloudflare.com/r2/) from within your Pages project by configuring [bindings](https://developers.cloudflare.com/pages/functions/bindings/).

## Deploy your Function

After you have set up your Function, deploy your Pages project. Deploy your project by:

* Connecting your [Git provider](https://developers.cloudflare.com/pages/get-started/git-integration/).
* Using [Wrangler](https://developers.cloudflare.com/workers/wrangler/commands/#pages) from the command line.

Warning

[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) from the Cloudflare dashboard is currently not supported with Functions.

## Related resources

* Customize your [Function's routing](https://developers.cloudflare.com/pages/functions/routing/)
* Review the [API reference](https://developers.cloudflare.com/pages/functions/api-reference/)
* Learn how to [debug your Function](https://developers.cloudflare.com/pages/functions/debugging-and-logging/)
