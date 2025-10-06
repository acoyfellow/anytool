---
title: Turnstile with Workers · Cloudflare Workers docs
description: Inject [Turnstile](/turnstile/) implicitly into HTML elements using
  the HTMLRewriter runtime API.
lastUpdated: 2025-09-01T10:19:51.000Z
chatbotDeprioritize: false
tags: JavaScript,TypeScript,Python
source_url:
  html: https://developers.cloudflare.com/workers/examples/turnstile-html-rewriter/
  md: https://developers.cloudflare.com/workers/examples/turnstile-html-rewriter/index.md
---

* JavaScript

  ```js
  export default {
    async fetch(request, env) {
      const SITE_KEY = env.SITE_KEY; // The Turnstile Sitekey of your widget (pass as env or secret)
      const TURNSTILE_ATTR_NAME = "your_id_to_replace"; // The id of the element to put a Turnstile widget in
      let res = await fetch(request);


      // Instantiate the API to run on specific elements, for example, `head`, `div`
      let newRes = new HTMLRewriter()


        // `.on` attaches the element handler and this allows you to match on element/attributes or to use the specific methods per the API
        .on("head", {
          element(element) {
            // In this case, you are using `append` to add a new script to the `head` element
            element.append(
              `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`,
              { html: true },
            );
          },
        })
        .on("div", {
          element(element) {
            // Add a turnstile widget element into if an element with the id of TURNSTILE_ATTR_NAME is found
            if (element.getAttribute("id") === TURNSTILE_ATTR_NAME) {
              element.append(
                `<div class="cf-turnstile" data-sitekey="${SITE_KEY}"></div>`,
                { html: true },
              );
            }
          },
        })
        .transform(res);
      return newRes;
    },
  };
  ```

* TypeScript

  ```ts
  export default {
    async fetch(request, env): Promise<Response> {
      const SITE_KEY = env.SITE_KEY; // The Turnstile Sitekey of your widget (pass as env or secret)
      const TURNSTILE_ATTR_NAME = "your_id_to_replace"; // The id of the element to put a Turnstile widget in


      let res = await fetch(request);


      // Instantiate the API to run on specific elements, for example, `head`, `div`
      let newRes = new HTMLRewriter()


        // `.on` attaches the element handler and this allows you to match on element/attributes or to use the specific methods per the API
        .on("head", {
          element(element) {
            // In this case, you are using `append` to add a new script to the `head` element
            element.append(
              `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`,
              { html: true },
            );
          },
        })
        .on("div", {
          element(element) {
            // Add a turnstile widget element into if an element with the id of TURNSTILE_ATTR_NAME is found
            if (element.getAttribute("id") === TURNSTILE_ATTR_NAME) {
              element.append(
                `<div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>`,
                { html: true },
              );
            }
          },
        })
        .transform(res);
      return newRes;
    },
  } satisfies ExportedHandler<Env>;
  ```

* Hono

  ```ts
  import { Hono } from "hono";


  interface Env {
    SITE_KEY: string;
    SECRET_KEY: string;
    TURNSTILE_ATTR_NAME?: string;
  }


  const app = new Hono<{ Bindings: Env }>();


  // Middleware to inject Turnstile widget
  app.use("*", async (c, next) => {
    const SITE_KEY = c.env.SITE_KEY; // The Turnstile Sitekey from environment
    const TURNSTILE_ATTR_NAME = c.env.TURNSTILE_ATTR_NAME || "your_id_to_replace"; // The target element ID


    // Process the request through the original endpoint
    await next();


    // Only process HTML responses
    const contentType = c.res.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return;
    }


    // Clone the response to make it modifiable
    const originalResponse = c.res;
    const responseBody = await originalResponse.text();


    // Create an HTMLRewriter instance to modify the HTML
    const rewriter = new HTMLRewriter()
      // Add the Turnstile script to the head
      .on("head", {
        element(element) {
          element.append(
            `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`,
            { html: true },
          );
        },
      })
      // Add the Turnstile widget to the target div
      .on("div", {
        element(element) {
          if (element.getAttribute("id") === TURNSTILE_ATTR_NAME) {
            element.append(
              `<div class="cf-turnstile" data-sitekey="${SITE_KEY}" data-theme="light"></div>`,
              { html: true },
            );
          }
        },
      });


    // Create a new response with the same properties as the original
    const modifiedResponse = new Response(responseBody, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers: originalResponse.headers,
    });


    // Transform the response using HTMLRewriter
    c.res = rewriter.transform(modifiedResponse);
  });


  // Handle POST requests for form submission with Turnstile validation
  app.post("*", async (c) => {
    const formData = await c.req.formData();
    const token = formData.get("cf-turnstile-response");
    const ip = c.req.header("CF-Connecting-IP");


    // If no token, return an error
    if (!token) {
      return c.text("Missing Turnstile token", 400);
    }


    // Prepare verification data
    const verifyFormData = new FormData();
    verifyFormData.append("secret", c.env.SECRET_KEY || "");
    verifyFormData.append("response", token.toString());
    if (ip) verifyFormData.append("remoteip", ip);


    // Verify the token with Turnstile API
    const verifyResult = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verifyFormData,
      },
    );


    const outcome = await verifyResult.json<{ success: boolean }>;


    // If verification fails, return an error
    if (!outcome.success) {
      return c.text("The provided Turnstile token was not valid!", 401);
    }


    // If verification succeeds, proceed with the original request
    // You would typically handle the form submission logic here


    // For this example, we'll just send a success response
    return c.text("Form submission successful!");
  });


  // Default handler for GET requests
  app.get("*", async (c) => {
    // Fetch the original content (you'd replace this with your actual content source)
    return await fetch(c.req.raw);
  });


  export default app;
  ```

* Python

  ```py
  from workers import WorkerEntrypoint
  from pyodide.ffi import create_proxy
  from js import HTMLRewriter, fetch


  class Default(WorkerEntrypoint):
      async def fetch(self, request):
          site_key = self.env.SITE_KEY
          attr_name = self.env.TURNSTILE_ATTR_NAME
          res = await fetch(request)


          class Append:
              def element(self, element):
                  s = '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>'
                  element.append(s, {"html": True})


          class AppendOnID:
              def __init__(self, name):
                  self.name = name
              def element(self, element):
                  # You are using the `getAttribute` method here to retrieve the `id` or `class` of an element
                  if element.getAttribute("id") == self.name:
                      div = f'<div class="cf-turnstile" data-sitekey="{site_key}" data-theme="light"></div>'
                      element.append(div, { "html": True })


          # Instantiate the API to run on specific elements, for example, `head`, `div`
          head = create_proxy(Append())
          div = create_proxy(AppendOnID(attr_name))
          new_res = HTMLRewriter.new().on("head", head).on("div", div).transform(res)


          return new_res
  ```

Note

This is only half the implementation for Turnstile. The corresponding token that is a result of a widget being rendered also needs to be verified using the [Siteverify API](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). Refer to the example below for one such implementation.

Prevent potential errors when accessing request.body

The body of a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) can only be accessed once. If you previously used `request.formData()` in the same request, you may encounter a TypeError when attempting to access `request.body`.

To avoid errors, create a clone of the Request object with `request.clone()` for each subsequent attempt to access a Request's body. Keep in mind that Workers have a [memory limit of 128 MB per Worker](https://developers.cloudflare.com/workers/platform/limits#worker-limits) and loading particularly large files into a Worker's memory multiple times may reach this limit. To ensure memory usage does not reach this limit, consider using [Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/).
