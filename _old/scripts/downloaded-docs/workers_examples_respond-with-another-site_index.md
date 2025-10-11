---
title: Respond with another site · Cloudflare Workers docs
description: Respond to the Worker request with the response from another
  website (example.com in this example).
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
tags: Middleware,JavaScript,TypeScript,Python
source_url:
  html: https://developers.cloudflare.com/workers/examples/respond-with-another-site/
  md: https://developers.cloudflare.com/workers/examples/respond-with-another-site/index.md
---

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/respond-with-another-site)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

* JavaScript

  ```js
  export default {
    async fetch(request) {
      async function MethodNotAllowed(request) {
        return new Response(`Method ${request.method} not allowed.`, {
          status: 405,
          headers: {
            Allow: "GET",
          },
        });
      }
      // Only GET requests work with this proxy.
      if (request.method !== "GET") return MethodNotAllowed(request);
      return fetch(`https://example.com`);
    },
  };
  ```

  [Run Worker in Playground](https://workers.cloudflare.com/playground#LYVwNgLglgDghgJwgegGYHsHALQBM4RwDcABAEbogB2+CAngLzbPYZb6HbW5QDGU2AAwAmYQE4AzAA5BANgAsAdgkBWAFwsWbYBzhcafASPHS5S1QFgAUAGF0VCAFMH2ACJQAzjHQeo0e2ok2ngExCRUcMCODABEUDSOAB4AdABWHjGkqFBgzpHRcQkp6THWdg7OENgAKnQwjoFwMDBgfARQ9sipcABucB68CLAQANTA6LjgjtbWSd5IJLiOqHDgECQA3lYkJP10VLxBjhC8ABYAFAiOAI4gjh4QAJSb2zu7HvuHqNS8-lQkAFljqcJgA5dAQACCYDA6AA7o5cJcbncHs8tm83lcICAEP8qI44SQAEr3bxUDyOc4AAyBEBBuBIABINldbvcIMkovSJgBfcIQ3Yw+GI5LUgA0L0xmIeBBAHkC8kEKnFr2lJFOjjgSwQCql6re0NhcMCMQA4gBRaoxVUGki823S3mPIhq+1u5DIEgAeSoYDoJEt1RIbNREA8JDhmAA1pG-KcSPTPCQYAh0Ik6Mk3VBUCRkeyHlzgRMSABCBgMEjmq0xZ7Y3H-OkM8FQ4UIpGhjkut31vFHE4XamnCAQGAKz1JSItRzJXjoYDU7s7B1WXlEayaZjaXT6Hj8ISiSQyBTKFRlexOFzuLw+PwdKiBYK6UgRKKxbna0KZII5PJvmJkLCZClLYF6VDUdQNLszStLw7SdOk9gzFYGwxMAcDxAA+uMky5DEaiFEsxQZLyG6btuoS7oYB4mMe5gqMwQA)

* TypeScript

  ```ts
  export default {
    async fetch(request): Promise<Response> {
      async function MethodNotAllowed(request) {
        return new Response(`Method ${request.method} not allowed.`, {
          status: 405,
          headers: {
            Allow: "GET",
          },
        });
      }
      // Only GET requests work with this proxy.
      if (request.method !== "GET") return MethodNotAllowed(request);
      return fetch(`https://example.com`);
    },
  } satisfies ExportedHandler;
  ```

* Python

  ```py
  from workers import WorkerEntrypoint, Response, fetch


  class Default(WorkerEntrypoint):
      def fetch(self, request):
          def method_not_allowed(request):
              msg = f'Method {request.method} not allowed.'
              headers = {"Allow": "GET"}
              return Response(msg, headers=headers, status=405)


          # Only GET requests work with this proxy.
          if request.method != "GET":
              return method_not_allowed(request)


          return fetch("https://example.com")
  ```
