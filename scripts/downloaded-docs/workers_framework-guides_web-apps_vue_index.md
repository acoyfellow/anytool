---
title: Vue · Cloudflare Workers docs
description: Create a Vue application and deploy it to Cloudflare Workers with
  Workers Assets.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
tags: SPA
source_url:
  html: https://developers.cloudflare.com/workers/framework-guides/web-apps/vue/
  md: https://developers.cloudflare.com/workers/framework-guides/web-apps/vue/index.md
---

In this guide, you will create a new [Vue](https://vuejs.org/) application and deploy to Cloudflare Workers (with the new [Workers Assets](https://developers.cloudflare.com/workers/static-assets/)).

## 1. Set up a new project

Use the [`create-cloudflare`](https://www.npmjs.com/package/create-cloudflare) CLI (C3) to set up a new project. C3 will create a new project directory, use code from the official Vue template, and provide the option to deploy instantly.

To use `create-cloudflare` to create a new Vue project with Workers Assets, run the following command:

* npm

  ```sh
  npm create cloudflare@latest -- my-vue-app --framework=vue
  ```

* yarn

  ```sh
  yarn create cloudflare my-vue-app --framework=vue
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-vue-app --framework=vue
  ```

How is this project set up?

Below is a simplified file tree of the project.

`wrangler.jsonc` is your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). In this file:

* `main` points to `server/index.ts`. This is your Worker, which is going to act as your backend API.
* `assets.not_found_handling` is set to `single-page-application`, which means that routes that are handled by your Vue SPA do not go to the Worker, and are thus free.
* If you want to add bindings to resources on Cloudflare's developer platform, you configure them here. Read more about [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/).

`vite.config.ts` is set up to use the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/). This runs your Worker in the Cloudflare Workers runtime, ensuring your local development environment is as close to production as possible.

`server/index.ts` is your backend API, which contains a single endpoint, `/api/`, that returns a text response. At `src/App.vue`, your Vue app calls this endpoint to get a message back and displays this.

## **Develop locally with the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)**

After you have created your project, run the following command in the project directory to start a local server. This will allow you to preview your project locally during development.

* npm

  ```sh
  npm run dev
  ```

* yarn

  ```sh
  yarn run dev
  ```

* pnpm

  ```sh
  pnpm run dev
  ```

What's happening in local development?

This project uses Vite for local development and build, and thus comes with all of Vite's features, including hot module replacement (HMR). In addition, `vite.config.ts` is set up to use the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/). This runs your application in the Cloudflare Workers runtime, just like in production, and enables access to local emulations of bindings.

## 3. Deploy your project

Your project can be deployed to a `*.workers.dev` subdomain or a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), from your own machine or from any CI/CD system, including [Cloudflare's own](https://developers.cloudflare.com/workers/ci-cd/builds/).

The following command will build and deploy your project. If you are using CI, ensure you update your ["deploy command"](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings) configuration appropriately.

* npm

  ```sh
  npm run deploy
  ```

* yarn

  ```sh
  yarn run deploy
  ```

* pnpm

  ```sh
  pnpm run deploy
  ```

***

## Asset Routing

If you're using Vue as a SPA, you will want to set `not_found_handling = "single_page_application"` in your Wrangler configuration file.

By default, Cloudflare first tries to match a request path against a static asset path, which is based on the file structure of the uploaded asset directory. This is either the directory specified by `assets.directory` in your Wrangler config or, in the case of the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), the output directory of the client build. Failing that, we invoke a Worker if one is present. If there is no Worker, or the Worker then uses the asset binding, Cloudflare will fallback to the behaviour set by [`not_found_handling`](https://developers.cloudflare.com/workers/static-assets/#routing-behavior).

Refer to the [routing documentation](https://developers.cloudflare.com/workers/static-assets/routing/) for more information about how routing works with static assets, and how to customize this behavior.

## Use bindings with Vue

Your new project also contains a Worker at `./server/index.ts`, which you can use as a backend API for your Vue application. While your Vue application cannot directly access Workers bindings, it can interact with them through this Worker. You can make [`fetch()` requests](https://developers.cloudflare.com/workers/runtime-apis/fetch/) from your Vue application to the Worker, which can then handle the request and use bindings.

With bindings, your application can be fully integrated with the Cloudflare Developer Platform, giving you access to compute, storage, AI and more.

[Bindings ](https://developers.cloudflare.com/workers/runtime-apis/bindings/)Access to compute, storage, AI and more.
