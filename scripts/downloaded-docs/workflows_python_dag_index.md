---
title: DAG Workflows · Cloudflare Workflows docs
description: The Python Workflows SDK supports DAG workflows in a declarative
  way, using the step.do decorator with the depends parameter to define
  dependencies (other steps that must complete before this step can run).
lastUpdated: 2025-08-21T09:27:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/python/dag/
  md: https://developers.cloudflare.com/workflows/python/dag/index.md
---

The Python Workflows SDK supports DAG workflows in a declarative way, using the `step.do` decorator with the `depends` parameter to define dependencies (other steps that must complete before this step can run).

```python
from workers import WorkflowEntrypoint


class MyWorkflow(WorkflowEntrypoint):
    async def run(self, event, step):
        @step.do("dependency a")
        async def step_a():
            # do some work
            return 10


        @step.do("dependency b")
        async def step_b():
            # do some work
            return 20


        @step.do("my final step", depends=[step_a, step_b], concurrent=True)
        async def my_final_step(result_a=0, result_b=0):
            # should return 30
            return result_a + result_b


        await my_final_step()
```

On this example, `step_a` and `step_b` are run concurrently before execution of `my_final_step`, which depends on both of them.

Having `concurrent=True` allows the dependencies to be resolved concurrently. If one of the callables passed to `depends` has already completed, it will be skipped and its return value will be reused.

This pattern is useful for diamond shaped workflows, where a step depends on two or more other steps that can run concurrently.
