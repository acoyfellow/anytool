---
title: Write Cloudflare Workers in Python · Cloudflare Workers docs
description: Write Workers in 100% Python
lastUpdated: 2025-09-01T10:19:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/languages/python/
  md: https://developers.cloudflare.com/workers/languages/python/index.md
---

Cloudflare Workers provides first-class support for Python, including support for:

* The majority of Python's [Standard library](https://developers.cloudflare.com/workers/languages/python/stdlib/)
* All [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/), including [Workers AI](https://developers.cloudflare.com/workers-ai/), [Vectorize](https://developers.cloudflare.com/vectorize), [R2](https://developers.cloudflare.com/r2), [KV](https://developers.cloudflare.com/kv), [D1](https://developers.cloudflare.com/d1), [Queues](https://developers.cloudflare.com/queues/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) and more.
* [Environment Variables](https://developers.cloudflare.com/workers/configuration/environment-variables/), and [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
* A robust [foreign function interface (FFI)](https://developers.cloudflare.com/workers/languages/python/ffi) that lets you use JavaScript objects and functions directly from Python — including all [Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
* [Built-in packages](https://developers.cloudflare.com/workers/languages/python/packages), including [FastAPI](https://fastapi.tiangolo.com/), [Langchain](https://pypi.org/project/langchain/), [httpx](https://www.python-httpx.org/) and more.

Python Workers are in beta.

You must add the `python_workers` compatibility flag to your Worker, while Python Workers are in open beta. Packages are supported using the [pywrangler](https://developers.cloudflare.com/workers/languages/python/packages) tool.

We'd love your feedback. Join the #python-workers channel in the [Cloudflare Developers Discord](https://discord.cloudflare.com/) and let us know what you'd like to see next.

## Get started

```bash
git clone https://github.com/cloudflare/python-workers-examples
cd python-workers-examples/01-hello
npx wrangler@latest dev
```

A Python Worker can be as simple as three lines of code:

```python
from workers import WorkerEntrypoint, Response


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return Response("Hello World!")
```

Similar to Workers written in [JavaScript](https://developers.cloudflare.com/workers/languages/javascript), [TypeScript](https://developers.cloudflare.com/workers/languages/typescript), or [Rust](https://developers.cloudflare.com/workers/languages/rust/), the main entry point for a Python worker is the [`fetch` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch). In a Python Worker, this handler is placed in a `Default` class that extends the `WorkerEntrypoint` class (which you can import from the `workers` SDK module).

To run a Python Worker locally, you use [Wrangler](https://developers.cloudflare.com/workers/wrangler/), the CLI for Cloudflare Workers:

```bash
npx wrangler@latest dev
```

To deploy a Python Worker to Cloudflare, run [`wrangler deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy):

```bash
npx wrangler@latest deploy
```

## Modules

Python workers can be split across multiple files. Let's create a new Python file, called `src/hello.py`:

```python
def hello(name):
    return "Hello, " + name + "!"
```

Now, we can modify `src/entry.py` to make use of the new module.

```python
from hello import hello
from workers import WorkerEntrypoint, Response


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return Response(hello("World"))
```

Once you edit `src/entry.py`, Wrangler will automatically detect the change and reload your Worker.

## The `Request` Interface

The `request` parameter passed to your `fetch` handler is a JavaScript Request object, exposed via the foreign function interface, allowing you to access it directly from your Python code.

Let's try editing the worker to accept a POST request. We know from the [documentation for `Request`](https://developers.cloudflare.com/workers/runtime-apis/request) that we can call `await request.json()` within an `async` function to parse the request body as JSON. In a Python Worker, you would write:

```python
from workers import WorkerEntrypoint, Response
from hello import hello


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        name = (await request.json()).name
        return Response(hello(name))
```

Once you edit the `src/entry.py`, Wrangler should automatically restart the local development server. Now, if you send a POST request with the appropriate body, your Worker should respond with a personalized message.

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name": "Python"}' http://localhost:8787
```

```bash
Hello, Python!
```

## The `env` Parameter

In addition to the `request` parameter, the `env` parameter is also passed to the Python `fetch` handler and can be used to access [environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/), [secrets](https://developers.cloudflare.com/workers/configuration/secrets/),and [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/).

For example, let us try setting and using an environment variable in a Python Worker. First, add the environment variable to your Worker's [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/):

* wrangler.jsonc

  ```jsonc
  {
    "name": "hello-python-worker",
    "main": "src/entry.py",
    "compatibility_flags": [
      "python_workers"
    ],
    "compatibility_date": "2024-03-20",
    "vars": {
      "API_HOST": "example.com"
    }
  }
  ```

* wrangler.toml

  ```toml
  name = "hello-python-worker"
  main = "src/entry.py"
  compatibility_flags = ["python_workers"]
  compatibility_date = "2024-03-20"


  [vars]
  API_HOST = "example.com"
  ```

Then, you can access the `API_HOST` environment variable via the `env` parameter:

```python
from workers import WorkerEntrypoint, Response


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return Response(self.env.API_HOST)
```

## Further Reading

* Understand which parts of the [Python Standard Library](https://developers.cloudflare.com/workers/languages/python/stdlib) are supported in Python Workers.
* Learn about Python Workers' [foreign function interface (FFI)](https://developers.cloudflare.com/workers/languages/python/ffi), and how to use it to work with [bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings) and [Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/).
* Explore the [packages](https://developers.cloudflare.com/workers/languages/python/packages) docs for instructions on how to use packages with Python Workers.
