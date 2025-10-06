---
title: FastAPI · Cloudflare Workers docs
description: The FastAPI package is supported in Python Workers.
lastUpdated: 2025-09-01T10:19:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/languages/python/packages/fastapi/
  md: https://developers.cloudflare.com/workers/languages/python/packages/fastapi/index.md
---

The FastAPI package is supported in Python Workers.

FastAPI applications use a protocol called the [Asynchronous Server Gateway Interface (ASGI)](https://asgi.readthedocs.io/en/latest/). This means that FastAPI never reads from or writes to a socket itself. An ASGI application expects to be hooked up to an ASGI server, typically [uvicorn](https://www.uvicorn.org/). The ASGI server handles all of the raw sockets on the application’s behalf.

The Workers runtime provides [an ASGI server](https://github.com/cloudflare/workerd/blob/main/src/pyodide/internal/asgi.py) directly to your Python Worker, which lets you use FastAPI in Python Workers.

## Get Started

Python Workers are in beta. Packages do not run in production.

Currently, you can only deploy Python Workers that use the standard library. [Packages](https://developers.cloudflare.com/workers/languages/python/packages/#supported-packages) **cannot be deployed** and will only work in local development for the time being.

Clone the `cloudflare/python-workers-examples` repository and run the FastAPI example:

```bash
git clone https://github.com/cloudflare/python-workers-examples
cd python-workers-examples/03-fastapi
npx wrangler@latest dev
```

### Example code

```python
from workers import WorkerEntrypoint
from fastapi import FastAPI, Request
from pydantic import BaseModel


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        import asgi


        return await asgi.fetch(app, request, self.env)


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello, World!"}


@app.get("/env")
async def root(req: Request):
    env = req.scope["env"]
    return {"message": "Here is an example of getting an environment variable: " + env.MESSAGE}


class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.post("/items/")
async def create_item(item: Item):
    return item


@app.put("/items/{item_id}")
async def create_item(item_id: int, item: Item, q: str | None = None):
    result = {"item_id": item_id, **item.dict()}
    if q:
        result.update({"q": q})
    return result


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```
