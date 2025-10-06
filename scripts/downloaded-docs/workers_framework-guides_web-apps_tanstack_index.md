---
title: TanStack · Cloudflare Workers docs
description: Create a TanStack Start application and deploy it to Cloudflare
  Workers with Workers Assets.
lastUpdated: 2025-10-01T11:39:45.000Z
chatbotDeprioritize: false
tags: Full stack
source_url:
  html: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/
  md: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/index.md
---

In this guide, you will create a new [TanStack Start](https://tanstack.com/start) application and deploy it to Cloudflare Workers (with the new [Workers Assets](https://developers.cloudflare.com/workers/static-assets/)).

## 1. Set up a new project

Start by cloning the Cloudflare example from the official TanStack repository.

* npm

  ```sh
  npx gitpick TanStack/router/tree/main/examples/react/start-basic-cloudflare my-tanstack-app
  ```

* yarn

  ```sh
  yarn dlx gitpick TanStack/router/tree/main/examples/react/start-basic-cloudflare my-tanstack-app
  ```

* pnpm

  ```sh
  pnpx gitpick TanStack/router/tree/main/examples/react/start-basic-cloudflare my-tanstack-app
  ```

After setting up your project, change your directory by running the following command:

```sh
cd my-tanstack-app
```

And install the project's dependencies with:

* npm

  ```sh
  npm install
  ```

* yarn

  ```sh
  yarn install
  ```

* pnpm

  ```sh
  pnpm install
  ```

## 2. Develop locally

After you have created your project, run the following command in the project directory to start a local development server. This will allow you to preview your project locally during development.

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

## 3. Deploy your Project

Your project can be deployed to a `*.workers.dev` subdomain or a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), from your own machine or from any CI/CD system, including [Cloudflare's own](https://developers.cloudflare.com/workers/ci-cd/builds/).

To deploy your application you will first need to build it:

* npm

  ```sh
  npm run build
  ```

* yarn

  ```sh
  yarn run build
  ```

* pnpm

  ```sh
  pnpm run build
  ```

Once it's been built you can deploy it via:

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

If you're using CI, ensure you update your ["deploy command"](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings) configuration appropriately.

Note

After having built the application you can run the `preview` script to preview the built output locally before deploying it. This can help you making sure that your application will work as intended once it's been deployed to the Cloudflare network:

* npm

  ```sh
  npm run preview
  ```

* yarn

  ```sh
  yarn run preview
  ```

* pnpm

  ```sh
  pnpm run preview
  ```

***

## Bindings

Your TanStack Start application can be fully integrated with the Cloudflare Developer Platform, in both local development and in production, by using bindings.

You can use bindings simply by [importing the `env` object](https://developers.cloudflare.com/workers/runtime-apis/bindings/#importing-env-as-a-global) and accessing it in your server side code.

For example in the following way:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";


export const Route = createFileRoute("/")({
  loader: () => getData(),
  component: RouteComponent,
});


const getData = createServerFn().handler(() => {
  // Use env here
});


function RouteComponent() {
  // ...
}
```

See `src/routes/index.tsx` for an example.

Note

Running the `cf-typegen` script:

* npm

  ```sh
  npm run cf-typegen
  ```

* yarn

  ```sh
  yarn run cf-typegen
  ```

* pnpm

  ```sh
  pnpm run cf-typegen
  ```

Will populate the `env` object with the various bindings based on your configuration.

With bindings, your application can be fully integrated with the Cloudflare Developer Platform, giving you access to compute, storage, AI and more.

[Bindings ](https://developers.cloudflare.com/workers/runtime-apis/bindings/)Access to compute, storage, AI and more.
