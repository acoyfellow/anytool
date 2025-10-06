---
title: Cache Tags using Workers · Cloudflare Workers docs
description: Send Additional Cache Tags using Workers
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
tags: Caching,JavaScript,TypeScript,Python
source_url:
  html: https://developers.cloudflare.com/workers/examples/cache-tags/
  md: https://developers.cloudflare.com/workers/examples/cache-tags/index.md
---

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/cache-tags)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

* JavaScript

  ```js
  export default {
    async fetch(request) {
      const requestUrl = new URL(request.url);
      const params = requestUrl.searchParams;
      const tags =
        params && params.has("tags") ? params.get("tags").split(",") : [];
      const url = params && params.has("uri") ? params.get("uri") : "";
      if (!url) {
        const errorObject = {
          error: "URL cannot be empty",
        };
        return new Response(JSON.stringify(errorObject), { status: 400 });
      }
      const init = {
        cf: {
          cacheTags: tags,
        },
      };
      return fetch(url, init)
        .then((result) => {
          const cacheStatus = result.headers.get("cf-cache-status");
          const lastModified = result.headers.get("last-modified");
          const response = {
            cache: cacheStatus,
            lastModified: lastModified,
          };
          return new Response(JSON.stringify(response), {
            status: result.status,
          });
        })
        .catch((err) => {
          const errorObject = {
            error: err.message,
          };
          return new Response(JSON.stringify(errorObject), { status: 500 });
        });
    },
  };
  ```

* TypeScript

  ```ts
  export default {
    async fetch(request): Promise<Response> {
      const requestUrl = new URL(request.url);
      const params = requestUrl.searchParams;
      const tags =
        params && params.has("tags") ? params.get("tags").split(",") : [];
      const url = params && params.has("uri") ? params.get("uri") : "";
      if (!url) {
        const errorObject = {
          error: "URL cannot be empty",
        };
        return new Response(JSON.stringify(errorObject), { status: 400 });
      }
      const init = {
        cf: {
          cacheTags: tags,
        },
      };
      return fetch(url, init)
        .then((result) => {
          const cacheStatus = result.headers.get("cf-cache-status");
          const lastModified = result.headers.get("last-modified");
          const response = {
            cache: cacheStatus,
            lastModified: lastModified,
          };
          return new Response(JSON.stringify(response), {
            status: result.status,
          });
        })
        .catch((err) => {
          const errorObject = {
            error: err.message,
          };
          return new Response(JSON.stringify(errorObject), { status: 500 });
        });
    },
  } satisfies ExportedHandler;
  ```

* Hono

  ```ts
  import { Hono } from "hono";


  const app = new Hono();


  app.all("*", async (c) => {
    const tags = c.req.query("tags") ? c.req.query("tags").split(",") : [];
    const uri = c.req.query("uri") ? c.req.query("uri") : "";


    if (!uri) {
      return c.json({ error: "URL cannot be empty" }, 400);
    }


    const init = {
      cf: {
        cacheTags: tags,
      },
    };


    const result = await fetch(uri, init);
    const cacheStatus = result.headers.get("cf-cache-status");
    const lastModified = result.headers.get("last-modified");


    const response = {
      cache: cacheStatus,
      lastModified: lastModified,
    };


    return c.json(response, result.status);
  });


  app.onError((err, c) => {
    return c.json({ error: err.message }, 500);
  });


  export default app;
  ```

* Python

  ```py
  from workers import WorkerEntrypoint
  from pyodide.ffi import to_js as _to_js
  from js import Response, URL, Object, fetch


  def to_js(x):
      return _to_js(x, dict_converter=Object.fromEntries)


  class Default(WorkerEntrypoint):
      async def fetch(self, request):
          request_url = URL.new(request.url)
          params = request_url.searchParams
          tags = params["tags"].split(",") if "tags" in params else []
          url = params["uri"] or None


          if url is None:
              error = {"error": "URL cannot be empty"}
              return Response.json(to_js(error), status=400)


          options = {"cf": {"cacheTags": tags}}
          result = await fetch(url, to_js(options))


          cache_status = result.headers["cf-cache-status"]
          last_modified = result.headers["last-modified"]
          response = {"cache": cache_status, "lastModified": last_modified}


          return Response.json(to_js(response), status=result.status)
  ```
