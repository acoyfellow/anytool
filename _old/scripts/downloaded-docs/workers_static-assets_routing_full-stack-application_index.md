---
title: Full-stack application · Cloudflare Workers docs
description: How to configure and use a full-stack application with Workers.
lastUpdated: 2025-06-05T13:25:05.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/
  md: https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/index.md
---

Full-stack applications are web applications which are span both the client and server. The build process of these applications will produce a HTML files, accompanying client-side resources (e.g. JavaScript bundles, CSS stylesheets, images, fonts, etc.) and a Worker script. Data is typically fetched the Worker script at request-time and the initial page response is usually server-side rendered (SSR). From there, the client is then hydrated and a SPA-like experience ensues.

The following full-stack frameworks are natively supported by Workers:

* [Astro](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
* [React Router (formerly Remix)](https://developers.cloudflare.com/workers/framework-guides/web-apps/react-router/)
* [Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
* [RedwoodSDK](https://developers.cloudflare.com/workers/framework-guides/web-apps/redwoodsdk/)
* [TanStack](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/)

- [Angular](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/angular/)
- [Nuxt](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/nuxt/)
- [Qwik](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/qwik/)
- [Solid](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/solid/)
