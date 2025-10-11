---
title: Return JSON · Cloudflare Workers docs
description: Return JSON directly from a Worker script, useful for building APIs
  and middleware.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
tags: JSON,JavaScript,TypeScript,Python,Rust
source_url:
  html: https://developers.cloudflare.com/workers/examples/return-json/
  md: https://developers.cloudflare.com/workers/examples/return-json/index.md
---

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/return-json)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

* JavaScript

  ```js
  export default {
    async fetch(request) {
      const data = {
        hello: "world",
      };


      return Response.json(data);
    },
  };
  ```

  [Run Worker in Playground](https://workers.cloudflare.com/playground#LYVwNgLglgDghgJwgegGYHsHALQBM4RwDcABAEbogB2+CAngLzbPYZb6HbW5QDGU2AAwBmAKwA2ABzDx40QHYALOIBcLFm2Ac4XGnwEiJ02QuUBYAFABhdFQgBTO9gAiUAM4x0bqNFsqSmngExCRUcMD2DABEUDT2AB4AdABWblGkqFBgjuGRMXFJqVGWNnaOENgAKnQw9v5wMDBgfARQtsjJcABucG68CLAQANTA6Ljg9paWCZ5IJLj2qHDgECQA3hYkJL10VLwB9hC8ABYAFAj2AI4g9m4QAJTrm1skvLZ388EkDE8vL8f2MBgdD+KIAd0wYFwUQANM8tgBfIgWeEkC4QEAIKgkABKt08VDc9hSblsp2092RiLhSMs6mYmm0uh4-CEYikMjkSnEJVsDicrg8Xh8bSo-kC2lIYQi0QihG06QCWRyMqiZGBZGK1j55SqNTq20azV4rXaqVsUwsayiwDgsQA+qNxtkoip8gtCmkEXT6Yzgsz9GyjJzTOJmEA)

* TypeScript

  ```ts
  export default {
    async fetch(request): Promise<Response> {
      const data = {
        hello: "world",
      };


      return Response.json(data);
    },
  } satisfies ExportedHandler;
  ```

* Python

  ```py
  from workers import WorkerEntrypoint, Response
  import json


  class Default(WorkerEntrypoint):
      def fetch(self, request):
          data = json.dumps({"hello": "world"})
          headers = {"content-type": "application/json"}
          return Response(data, headers=headers)
  ```

* Rust

  ```rs
  use serde::{Deserialize, Serialize};
  use worker::*;


  #[derive(Deserialize, Serialize, Debug)]
  struct Json {
      hello: String,
  }


  #[event(fetch)]
  async fn fetch(_req: Request, _env: Env, _ctx: Context) -> Result<Response> {
      let data = Json {
          hello: String::from("world"),
      };
      Response::from_json(&data)
  }
  ```

* Hono

  ```ts
  import { Hono } from "hono";


  const app = new Hono();


  app.get("*", (c) => {
    const data = {
      hello: "world",
    };


    return c.json(data);
  });


  export default app;
  ```
