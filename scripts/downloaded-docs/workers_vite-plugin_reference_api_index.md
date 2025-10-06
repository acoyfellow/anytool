---
title: API · Cloudflare Workers docs
description: Vite plugin API
lastUpdated: 2025-04-08T14:18:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/vite-plugin/reference/api/
  md: https://developers.cloudflare.com/workers/vite-plugin/reference/api/index.md
---

## `cloudflare()`

The `cloudflare` plugin should be included in the Vite `plugins` array:

```ts
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";


export default defineConfig({
  plugins: [cloudflare()],
});
```

It accepts an optional `PluginConfig` parameter.

## `interface PluginConfig`

* `configPath` string optional

  An optional path to your Worker config file. By default, a `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml` file in the root of your application will be used as the Worker config.

  For more information about the Worker configuration, see [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

* `viteEnvironment` { name?: string } optional

  Optional Vite environment options. By default, the environment name is the Worker name with `-` characters replaced with `_`. Setting the name here will override this. A typical use case is setting `viteEnvironment: { name: "ssr" }` to apply the Worker to the SSR environment.

  See [Vite Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/vite-environments/) for more information.

* `persistState` boolean | { path: string } optional

  An optional override for state persistence. By default, state is persisted to `.wrangler/state`. A custom `path` can be provided or, alternatively, persistence can be disabled by setting the value to `false`.

* `inspectorPort` number | false optional

  An optional override for debugging your Workers. By default, the debugging inspector is enabled and listens on port `9229`. A custom port can be provided or, alternatively, setting this to `false` will disable the debugging inspector.

  See [Debugging](https://developers.cloudflare.com/workers/vite-plugin/reference/debugging/) for more information.

* `auxiliaryWorkers` Array\<AuxiliaryWorkerConfig> optional

  An optional array of auxiliary Workers. Auxiliary Workers are additional Workers that are used as part of your application. You can use [service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) to call auxiliary Workers from your main (entry) Worker. All requests are routed through your entry Worker. During the build, each Worker is output to a separate subdirectory of `dist`.

  Note

  Auxiliary Workers are not currently supported when using [React Router](https://reactrouter.com/) as a framework.

  Note

  When running `wrangler deploy`, only your main (entry) Worker will be deployed. If using multiple Workers, each auxiliary Worker must be deployed individually. You can inspect the `dist` directory and then run `wrangler deploy -c dist/<auxiliary-worker>/wrangler.json` for each.

## `interface AuxiliaryWorkerConfig`

* `configPath` string

  A required path to your Worker config file.

  For more information about the Worker configuration, see [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

* `viteEnvironment` { name?: string } optional

  Optional Vite environment options. By default, the environment name is the Worker name with `-` characters replaced with `_`. Setting the name here will override this.

  See [Vite Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/vite-environments/) for more information.
