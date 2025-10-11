---
title: Read POST · Cloudflare Workers docs
description: Serve an HTML form, then read POST requests. Use also to read JSON
  or POST data from an incoming request.
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
tags: JSON,JavaScript,TypeScript,Python,Rust
source_url:
  html: https://developers.cloudflare.com/workers/examples/read-post/
  md: https://developers.cloudflare.com/workers/examples/read-post/index.md
---

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/read-post)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

* JavaScript

  ```js
  export default {
    async fetch(request) {
      /**
       * rawHtmlResponse returns HTML inputted directly
       * into the worker script
       * @param {string} html
       */
      function rawHtmlResponse(html) {
        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        });
      }


      /**
       * readRequestBody reads in the incoming request body
       * Use await readRequestBody(..) in an async function to get the string
       * @param {Request} request the incoming request to read from
       */
      async function readRequestBody(request) {
        const contentType = request.headers.get("content-type");
        if (contentType.includes("application/json")) {
          return JSON.stringify(await request.json());
        } else if (contentType.includes("application/text")) {
          return request.text();
        } else if (contentType.includes("text/html")) {
          return request.text();
        } else if (contentType.includes("form")) {
          const formData = await request.formData();
          const body = {};
          for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
          }
          return JSON.stringify(body);
        } else {
          // Perhaps some other type of data was submitted in the form
          // like an image, or some other binary data.
          return "a file";
        }
      }


      const { url } = request;
      if (url.includes("form")) {
        return rawHtmlResponse(someForm);
      }
      if (request.method === "POST") {
        const reqBody = await readRequestBody(request);
        const retBody = `The request body sent in was ${reqBody}`;
        return new Response(retBody);
      } else if (request.method === "GET") {
        return new Response("The request was a GET");
      }
    },
  };
  ```

* TypeScript

  ```ts
  export default {
    async fetch(request): Promise<Response> {
      /**
       * rawHtmlResponse returns HTML inputted directly
       * into the worker script
       * @param {string} html
       */
      function rawHtmlResponse(html) {
        return new Response(html, {
          headers: {
            "content-type": "text/html;charset=UTF-8",
          },
        });
      }


      /**
       * readRequestBody reads in the incoming request body
       * Use await readRequestBody(..) in an async function to get the string
       * @param {Request} request the incoming request to read from
       */
      async function readRequestBody(request: Request) {
        const contentType = request.headers.get("content-type");
        if (contentType.includes("application/json")) {
          return JSON.stringify(await request.json());
        } else if (contentType.includes("application/text")) {
          return request.text();
        } else if (contentType.includes("text/html")) {
          return request.text();
        } else if (contentType.includes("form")) {
          const formData = await request.formData();
          const body = {};
          for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
          }
          return JSON.stringify(body);
        } else {
          // Perhaps some other type of data was submitted in the form
          // like an image, or some other binary data.
          return "a file";
        }
      }


      const { url } = request;
      if (url.includes("form")) {
        return rawHtmlResponse(someForm);
      }
      if (request.method === "POST") {
        const reqBody = await readRequestBody(request);
        const retBody = `The request body sent in was ${reqBody}`;
        return new Response(retBody);
      } else if (request.method === "GET") {
        return new Response("The request was a GET");
      }
    },
  } satisfies ExportedHandler;
  ```

* Python

  ```py
  from workers import WorkerEntrypoint
  from js import Object, Response, Headers, JSON


  async def read_request_body(request):
      headers = request.headers
      content_type = headers["content-type"] or ""


      if "application/json" in content_type:
          return JSON.stringify(await request.json())
      if "form" in content_type:
          form = await request.formData()
          data = Object.fromEntries(form.entries())
          return JSON.stringify(data)
      return await request.text()


  class Default(WorkerEntrypoint):
      async def fetch(self, request):
          def raw_html_response(html):
              headers = Headers.new({"content-type": "text/html;charset=UTF-8"}.items())
              return Response.new(html, headers=headers)


          if "form" in request.url:
              return raw_html_response("")


          if "POST" in request.method:
              req_body = await read_request_body(request)
              ret_body = f"The request body sent in was {req_body}"
              return Response.new(ret_body)


          return Response.new("The request was not POST")
  ```

* Rust

  ```rs
  use serde::{Deserialize, Serialize};
  use worker::*;


  fn raw_html_response(html: &str) -> Result<Response> {
      Response::from_html(html)
  }


  #[derive(Deserialize, Serialize, Debug)]
  struct Payload {
      msg: String,
  }


  async fn read_request_body(mut req: Request) -> String {
      let ctype = req.headers().get("content-type").unwrap().unwrap();
      match ctype.as_str() {
          "application/json" => format!("{:?}", req.json::<Payload>().await.unwrap()),
          "text/html" => req.text().await.unwrap(),
          "multipart/form-data" => format!("{:?}", req.form_data().await.unwrap()),
          _ => String::from("a file"),
      }
  }


  #[event(fetch)]
  async fn fetch(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
      if String::from(req.url()?).contains("form") {
          return raw_html_response("some html form");
      }


      match req.method() {
          Method::Post => {
              let req_body = read_request_body(req).await;
              Response::ok(format!("The request body sent in was {}", req_body))
          }
          _ => Response::ok(format!("The result was a {:?}", req.method())),
      }
  }
  ```

* Hono

  ```ts
  import { Hono } from "hono";
  import { html } from "hono/html";


  const app = new Hono();


  /**
   * readRequestBody reads in the incoming request body
   * @param {Request} request the incoming request to read from
   */
  async function readRequestBody(request: Request): Promise<string> {
    const contentType = request.headers.get("content-type") || "";


    if (contentType.includes("application/json")) {
      const body = await request.json();
      return JSON.stringify(body);
    } else if (contentType.includes("application/text")) {
      return request.text();
    } else if (contentType.includes("text/html")) {
      return request.text();
    } else if (contentType.includes("form")) {
      const formData = await request.formData();
      const body: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        body[key] = value.toString();
      }
      return JSON.stringify(body);
    } else {
      // Perhaps some other type of data was submitted in the form
      // like an image, or some other binary data.
      return "a file";
    }
  }


  const someForm = html`<!DOCTYPE html>
    <html>
      <body>
        <form action="/" method="post">
          <div>
            <label for="message">Message:</label>
            <input id="message" name="message" type="text" />
          </div>
          <div>
            <button>Submit</button>
          </div>
        </form>
      </body>
    </html>`;


  app.get("*", async (c) => {
    const url = c.req.url;


    if (url.includes("form")) {
      return c.html(someForm);
    }


    return c.text("The request was a GET");
  });


  app.post("*", async (c) => {
    const reqBody = await readRequestBody(c.req.raw);
    const retBody = `The request body sent in was ${reqBody}`;
    return c.text(retBody);
  });


  export default app;
  ```

Prevent potential errors when accessing request.body

The body of a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) can only be accessed once. If you previously used `request.formData()` in the same request, you may encounter a TypeError when attempting to access `request.body`.

To avoid errors, create a clone of the Request object with `request.clone()` for each subsequent attempt to access a Request's body. Keep in mind that Workers have a [memory limit of 128 MB per Worker](https://developers.cloudflare.com/workers/platform/limits#worker-limits) and loading particularly large files into a Worker's memory multiple times may reach this limit. To ensure memory usage does not reach this limit, consider using [Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/).
