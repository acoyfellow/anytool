---
title: Build caching · Cloudflare Pages docs
description: Improve Pages build times by caching dependencies and build output
  between builds with a project-wide shared cache.
lastUpdated: 2025-09-17T11:00:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/configuration/build-caching/
  md: https://developers.cloudflare.com/pages/configuration/build-caching/index.md
---

Improve Pages build times by caching dependencies and build output between builds with a project-wide shared cache.

The first build to occur after enabling build caching on your Pages project will save to cache. Every subsequent build will restore from cache unless configured otherwise.

## About build cache

When enabled, the build cache will automatically detect and cache data from each build. Refer to [Frameworks](https://developers.cloudflare.com/pages/configuration/build-caching/#frameworks) to review what directories are automatically saved and restored from the build cache.

### Requirements

Build caching requires the [V2 build system](https://developers.cloudflare.com/pages/configuration/build-image/#v2-build-system) or later. To update from V1, refer to the [V2 build system migration instructions](https://developers.cloudflare.com/pages/configuration/build-image/#v1-to-v2-migration).

### Package managers

Pages will cache the global cache directories of the following package managers:

| Package Manager | Directories cached |
| - | - |
| [npm](https://www.npmjs.com/) | `.npm` |
| [yarn](https://yarnpkg.com/) | `.cache/yarn` |
| [pnpm](https://pnpm.io/) | `.pnpm-store` |
| [bun](https://bun.sh/) | `.bun/install/cache` |

### Frameworks

Some frameworks provide a cache directory that is typically populated by the framework with intermediate build outputs or dependencies during build time. Pages will automatically detect the framework you are using and cache this directory for reuse in subsequent builds.

The following frameworks support build output caching:

| Framework | Directories cached |
| - | - |
| Astro | `node_modules/.astro` |
| Docusaurus | `node_modules/.cache`, `.docusaurus`, `build` |
| Eleventy | `.cache` |
| Gatsby | `.cache`, `public` |
| Next.js | `.next/cache` |
| Nuxt | `node_modules/.cache/nuxt` |

### Limits

The following limits are imposed for build caching:

* **Retention**: Cache is purged seven days after its last read date. Unread cache artifacts are purged seven days after creation.
* **Storage**: Every project is allocated 10 GB. If the project cache exceeds this limit, the project will automatically start deleting artifacts that were read least recently.

## Enable build cache

To enable build caching :

1. Go to the **Workers & Pages** in the Cloudflare dashboard.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Find your Pages project.

3. Go to **Settings** > **Build** > **Build cache**.

4. Select **Enable** to turn on build caching.

## Clear build cache

The build cache can be cleared for a project if needed, such as when debugging build issues. To clear the build cache:

1. Go to the **Workers & Pages** in the Cloudflare dashboard.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Find your Pages project.

3. Go to **Settings** > **Build** > **Build cache**.

4. Select **Clear Cache** to clear the build cache.
