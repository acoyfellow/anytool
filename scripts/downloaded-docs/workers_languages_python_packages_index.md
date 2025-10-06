---
title: Python packages supported in Cloudflare Workers · Cloudflare Workers docs
description: >-
  Pywrangler is a CLI tool for managing packages and Python Workers.

  It is meant as a wrapper for wrangler that sets up a full environment for you,
  including bundling your packages into

  your worker bundle on deployment.
lastUpdated: 2025-10-01T17:20:22.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/languages/python/packages/
  md: https://developers.cloudflare.com/workers/languages/python/packages/index.md
---

[Pywrangler](https://github.com/cloudflare/workers-py?tab=readme-ov-file#pywrangler) is a CLI tool for managing packages and Python Workers. It is meant as a wrapper for wrangler that sets up a full environment for you, including bundling your packages into your worker bundle on deployment.

To get started, create a pyproject.toml file with the following contents:

```toml
[project]
name = "YourProjectName"
version = "0.1.0"
description = "Add your description here"
requires-python = ">=3.12"
dependencies = [
    "fastapi"
]


[dependency-groups]
dev = ["workers-py"]
```

The above will allow your worker to depend on the [FastAPI](https://fastapi.tiangolo.com/) package.

To run the worker locally:

```plaintext
uv run pywrangler dev
```

To deploy your worker:

```plaintext
uv run pywrangler deploy
```

Your dependencies will get bundled with your worker automatically on deployment.

The `pywrangler` CLI also supports all commands supported by the `wrangler` tool, for the full list of commands run `uv run pywrangler --help`.

## Supported Libraries

Python Workers support pure Python packages on [PyPI](https://pypi.org/), as well as [packages that are included in Pyodide](https://pyodide.org/en/stable/usage/packages-in-pyodide.html).

If you would like to use a package that is not pure Python and not yet supported in Pyodide, request support via the [Python Packages Discussions](https://github.com/cloudflare/workerd/discussions/categories/python-packages) on the Cloudflare Workers Runtime GitHub repository.

## HTTP Client Libraries

Only HTTP libraries that are able to make requests asynchronously are supported. Currently, these include [`aiohttp`](https://docs.aiohttp.org/en/stable/index.html) and [`httpx`](https://www.python-httpx.org/). You can also use the [`fetch()` API](https://developers.cloudflare.com/workers/runtime-apis/fetch/) from JavaScript, using Python Workers' [foreign function interface](https://developers.cloudflare.com/workers/languages/python/ffi) to make HTTP requests.
