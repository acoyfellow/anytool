---
title: Get started - CLI · Cloudflare Workers docs
description: Set up and deploy your first Worker with Wrangler, the Cloudflare
  Developer Platform CLI.
lastUpdated: 2025-05-26T07:51:19.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/get-started/guide/
  md: https://developers.cloudflare.com/workers/get-started/guide/index.md
---

Set up and deploy your first Worker with Wrangler, the Cloudflare Developer Platform CLI.

This guide will instruct you through setting up and deploying your first Worker.

## Prerequisites

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
2. Install [`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions. [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), discussed later in this guide, requires a Node version of `16.17.0` or later.

## 1. Create a new Worker project

Open a terminal window and run C3 to create your Worker project. [C3 (`create-cloudflare-cli`)](https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare) is a command-line tool designed to help you set up and deploy new applications to Cloudflare.

* npm

  ```sh
  npm create cloudflare@latest -- my-first-worker
  ```

* yarn

  ```sh
  yarn create cloudflare my-first-worker
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-first-worker
  ```

For setup, select the following options:

* For *What would you like to start with?*, choose `Hello World example`.
* For *Which template would you like to use?*, choose `Worker only`.
* For *Which language do you want to use?*, choose `JavaScript`.
* For *Do you want to use git for version control?*, choose `Yes`.
* For *Do you want to deploy your application?*, choose `No` (we will be making some changes before deploying).

Now, you have a new project set up. Move into that project folder.

```sh
cd my-first-worker
```

What files did C3 create?

In your project directory, C3 will have generated the following:

* `wrangler.jsonc`: Your [Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/#sample-wrangler-configuration) configuration file.
* `index.js` (in `/src`): A minimal `'Hello World!'` Worker written in [ES module](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/) syntax.
* `package.json`: A minimal Node dependencies configuration file.
* `package-lock.json`: Refer to [`npm` documentation on `package-lock.json`](https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json).
* `node_modules`: Refer to [`npm` documentation `node_modules`](https://docs.npmjs.com/cli/v7/configuring-npm/folders#node-modules).

What if I already have a project in a git repository?

In addition to creating new projects from C3 templates, C3 also supports creating new projects from existing Git repositories. To create a new project from an existing Git repository, open your terminal and run:

```sh
npm create cloudflare@latest -- --template <SOURCE>
```

`<SOURCE>` may be any of the following:

* `user/repo` (GitHub)
* `git@github.com:user/repo`
* `https://github.com/user/repo`
* `user/repo/some-template` (subdirectories)
* `user/repo#canary` (branches)
* `user/repo#1234abcd` (commit hash)
* `bitbucket:user/repo` (Bitbucket)
* `gitlab:user/repo` (GitLab)

Your existing template folder must contain the following files, at a minimum, to meet the requirements for Cloudflare Workers:

* `package.json`
* `wrangler.jsonc` [See sample Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#sample-wrangler-configuration)
* `src/` containing a worker script referenced from `wrangler.jsonc`

## 2. Develop with Wrangler CLI

C3 installs [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), the Workers command-line interface, in Workers projects by default. Wrangler lets you to [create](https://developers.cloudflare.com/workers/wrangler/commands/#init), [test](https://developers.cloudflare.com/workers/wrangler/commands/#dev), and [deploy](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) your Workers projects.

After you have created your first Worker, run the [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev) command in the project directory to start a local server for developing your Worker. This will allow you to preview your Worker locally during development.

```sh
npx wrangler dev
```

If you have never used Wrangler before, it will open your web browser so you can login to your Cloudflare account.

Go to <http://localhost:8787> to view your Worker.

Browser issues?

If you have issues with this step or you do not have access to a browser interface, refer to the [`wrangler login`](https://developers.cloudflare.com/workers/wrangler/commands/#login) documentation.

## 3. Write code

With your new project generated and running, you can begin to write and edit your code.

Find the `src/index.js` file. `index.js` will be populated with the code below:

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

Code explanation

This code block consists of a few different parts.

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

`export default` is JavaScript syntax required for defining [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#default_exports_versus_named_exports). Your Worker has to have a default export of an object, with properties corresponding to the events your Worker should handle.

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

This [`fetch()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/) will be called when your Worker receives an HTTP request. You can define additional event handlers in the exported object to respond to different types of events. For example, add a [`scheduled()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) to respond to Worker invocations via a [Cron Trigger](https://developers.cloudflare.com/workers/configuration/cron-triggers/).

Additionally, the `fetch` handler will always be passed three parameters: [`request`, `env` and `context`](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/).

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello World!");
  },
};
```

The Workers runtime expects `fetch` handlers to return a `Response` object or a Promise which resolves with a `Response` object. In this example, you will return a new `Response` with the string `"Hello World!"`.

Replace the content in your current `index.js` file with the content below, which changes the text output.

```js
export default {
  async fetch(request, env, ctx) {
    return new Response("Hello Worker!");
  },
};
```

Then, save the file and reload the page. Your Worker's output will have changed to the new text.

No visible changes?

If the output for your Worker does not change, make sure that:

1. You saved the changes to `index.js`.
2. You have `wrangler dev` running.
3. You reloaded your browser.

## 4. Deploy your project

Deploy your Worker via Wrangler to a `*.workers.dev` subdomain or a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

```sh
npx wrangler deploy
```

If you have not configured any subdomain or domain, Wrangler will prompt you during the publish process to set one up.

Preview your Worker at `<YOUR_WORKER>.<YOUR_SUBDOMAIN>.workers.dev`.

Seeing 523 errors?

If you see [`523` errors](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-523/) when pushing your `*.workers.dev` subdomain for the first time, wait a minute or so and the errors will resolve themselves.

## Next steps

To do more:

* Push your project to a GitHub or GitLab repository then [connect to builds](https://developers.cloudflare.com/workers/ci-cd/builds/#get-started) to enable automatic builds and deployments.
* Visit the [Cloudflare dashboard](https://dash.cloudflare.com/) for simpler editing.
* Review our [Examples](https://developers.cloudflare.com/workers/examples/) and [Tutorials](https://developers.cloudflare.com/workers/tutorials/) for inspiration.
* Set up [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) to allow your Worker to interact with other resources and unlock new functionality.
* Learn how to [test and debug](https://developers.cloudflare.com/workers/testing/) your Workers.
* Read about [Workers limits and pricing](https://developers.cloudflare.com/workers/platform/).
