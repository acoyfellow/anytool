---
title: 2. Update to Wrangler v2 · Cloudflare Workers docs
description: This document describes the steps to migrate a project from
  Wrangler v1 to Wrangler v2. Before updating your Wrangler version, review and
  complete Migrate webpack projects from Wrangler version 1 if it applies to
  your project.
lastUpdated: 2025-02-12T13:41:31.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/wrangler/migration/v1-to-v2/update-v1-to-v2/
  md: https://developers.cloudflare.com/workers/wrangler/migration/v1-to-v2/update-v1-to-v2/index.md
---

This document describes the steps to migrate a project from Wrangler v1 to Wrangler v2. Before updating your Wrangler version, review and complete [Migrate webpack projects from Wrangler version 1](https://developers.cloudflare.com/workers/wrangler/migration/v1-to-v2/eject-webpack/) if it applies to your project.

Wrangler v2 ships with new features and improvements that may require some changes to your configuration.

The CLI itself will guide you through the upgrade process.

Note

To learn more about the improvements to Wrangler, refer to [Wrangler v1 and v2 comparison](https://developers.cloudflare.com/workers/wrangler/deprecations/#wrangler-v1-and-v2-comparison-tables).

## Update Wrangler version

### 1. Uninstall Wrangler v1

If you had previously installed Wrangler v1 globally using npm, you can uninstall it with:

```sh
npm uninstall -g @cloudflare/wrangler
```

If you used Cargo to install Wrangler v1, you can uninstall it with:

```sh
cargo uninstall wrangler
```

### 2. Install Wrangler

Now, install the latest version of Wrangler.

```sh
npm install -g wrangler
```

### 3. Verify your install

To check that you have installed the correct Wrangler version, run:

```sh
npx wrangler --version
```

## Test Wrangler v2 on your previous projects

Now you will test that Wrangler v2 can build your Wrangler v1 project. In most cases, it will build just fine. If there are errors, the command line should instruct you with exactly what to change to get it to build.

If you would like to read more on the deprecated [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/) fields that cause Wrangler v2 to error, refer to [Deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/).

Run the `wrangler dev` command. This will show any warnings or errors that should be addressed. Note that in most cases, the messages will include actionable instructions on how to resolve the issue.

```sh
npx wrangler dev
```

* Errors need to be fixed before Wrangler can build your Worker.
* In most cases, you will only see warnings. These do not stop Wrangler from building your Worker, but consider updating the configuration to remove them.

Here is an example of some warnings and errors:

```bash
 ⛅️ wrangler 2.x
-------------------------------------------------------
▲ [WARNING] Processing wrangler.toml configuration:
  - 😶 Ignored: "type":
    Most common features now work out of the box with wrangler, including modules, jsx,
  typescript, etc. If you need anything more, use a custom build.
  - Deprecation: "zone_id":
    This is unnecessary since we can deduce this from routes directly.
  - Deprecation: "build.upload.format":
    The format is inferred automatically from the code.




✘ [ERROR] Processing wrangler.toml configuration:
  - Expected "route" to be either a string, or an object with shape { pattern, zone_id | zone_name }, but got "".
```

## Deprecations

Refer to [Deprecations](https://developers.cloudflare.com/workers/wrangler/deprecations/) for more details on what is no longer supported.
