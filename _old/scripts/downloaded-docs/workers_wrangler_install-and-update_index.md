---
title: Install/Update Wrangler · Cloudflare Workers docs
description: Get started by installing Wrangler, and update to newer versions by
  following this guide.
lastUpdated: 2025-05-16T16:37:37.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/wrangler/install-and-update/
  md: https://developers.cloudflare.com/workers/wrangler/install-and-update/index.md
---

Wrangler is a command-line tool for building with Cloudflare developer products.

## Install Wrangler

To install [Wrangler](https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler), ensure you have [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/getting-started) installed, preferably using a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm). Using a version manager helps avoid permission issues and allows you to change Node.js versions.

Wrangler System Requirements

We support running the Wrangler CLI with the [Current, Active, and Maintenance](https://nodejs.org/en/about/previous-releases) versions of Node.js. Your Worker will always be executed in `workerd`, the open source Cloudflare Workers runtime.

Wrangler is only supported on macOS 13.5+, Windows 11, and Linux distros that support glib 2.35. This follows [`workerd`'s OS support policy](https://github.com/cloudflare/workerd?tab=readme-ov-file#running-workerd).

Wrangler is installed locally into each of your projects. This allows you and your team to use the same Wrangler version, control Wrangler versions for each project, and roll back to an earlier version of Wrangler, if needed.

To install Wrangler within your Worker project, run:

* npm

  ```sh
  npm i -D wrangler@latest
  ```

* yarn

  ```sh
  yarn add -D wrangler@latest
  ```

* pnpm

  ```sh
  pnpm add -D wrangler@latest
  ```

Since Cloudflare recommends installing Wrangler locally in your project (rather than globally), the way to run Wrangler will depend on your specific setup and package manager. Refer to [How to run Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/#how-to-run-wrangler-commands) for more information.

Warning

If Wrangler is not installed, running `npx wrangler` will use the latest version of Wrangler.

## Check your Wrangler version

To check your Wrangler version, run:

```sh
npx wrangler --version
// or
npx wrangler version
// or
npx wrangler -v
```

## Update Wrangler

To update the version of Wrangler used in your project, run:

* npm

  ```sh
  npm i -D wrangler@latest
  ```

* yarn

  ```sh
  yarn add -D wrangler@latest
  ```

* pnpm

  ```sh
  pnpm add -D wrangler@latest
  ```

## Related resources

* [Commands](https://developers.cloudflare.com/workers/wrangler/commands/) - A detailed list of the commands that Wrangler supports.
* [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) - Learn more about Wrangler's configuration file.
