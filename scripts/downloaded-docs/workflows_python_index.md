---
title: Python Workflows SDK · Cloudflare Workflows docs
description: >-
  Workflow entrypoints can be declared using Python. To achieve this, you can
  export a WorkflowEntrypoint that runs on the Cloudflare Workers platform.

  Refer to Python Workers for more information about Python on the Workers
  runtime.
lastUpdated: 2025-09-15T09:49:53.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/python/
  md: https://developers.cloudflare.com/workflows/python/index.md
---

Workflow entrypoints can be declared using Python. To achieve this, you can export a `WorkflowEntrypoint` that runs on the Cloudflare Workers platform. Refer to [Python Workers](https://developers.cloudflare.com/workers/languages/python) for more information about Python on the Workers runtime.

Python Workflows are in beta, as well as the underlying platform.

You must add both `python_workflows` and `python_workers` compatibility flags to your `wrangler.toml` file.

Also, Python Workflows requires `compatibility_date = "2025-08-01"`, or lower, to be set in your `wrangler.toml` file.

Join the #python-workers channel in the [Cloudflare Developers Discord](https://discord.cloudflare.com/) and let us know what you'd like to see next.

## Get Started

The main entrypoint for a Python workflow is the [`WorkflowEntrypoint`](https://developers.cloudflare.com/workflows/build/workers-api/#workflowentrypoint) class. Your workflow logic should exist inside the [`run`](https://developers.cloudflare.com/workflows/build/workers-api/#run) handler.

```python
from workers import WorkflowEntrypoint


class MyWorkflow(WorkflowEntrypoint):
    async def run(self, event, step):
        # steps here
```

To run a Python Workflow locally, you use [Wrangler](https://developers.cloudflare.com/workers/wrangler/), the CLI for Cloudflare Workers:

```bash
npx wrangler@latest dev
```

To deploy a Python Workflow to Cloudflare, run [`wrangler deploy`](https://developers.cloudflare.com/workers/wrangler/commands/#deploy):

```bash
npx wrangler@latest deploy
```
