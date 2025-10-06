---
title: Python Workers API · Cloudflare Workflows docs
description: This guide covers the Python Workflows SDK, with instructions on
  how to build and create workflows using Python.
lastUpdated: 2025-08-21T09:27:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/python/python-workers-api/
  md: https://developers.cloudflare.com/workflows/python/python-workers-api/index.md
---

This guide covers the Python Workflows SDK, with instructions on how to build and create workflows using Python.

## WorkflowEntrypoint

The `WorkflowEntrypoint` is the main entrypoint for a Python workflow. It extends the `WorkflowEntrypoint` class, and implements the `run` method.

```python
from workers import WorkflowEntrypoint


class MyWorkflow(WorkflowEntrypoint):
    def run(self, event, step):
        # steps here
```

## WorkflowStep

* `step.do(name, depends=[], concurrent=False, config=None)` is a decorator that allows you to define a step in a workflow.

  * `name` - the name of the step.
  * `depends` - an optional list of steps that must complete before this step can run. See [DAG Workflows](https://developers.cloudflare.com/workflows/python/dag).
  * `concurrent` - an optional boolean that indicates whether this step can run concurrently with other steps.
  * `config` - an optional [`WorkflowStepConfig`](https://developers.cloudflare.com/workflows/build/workers-api/#workflowstepconfig) for configuring [step specific retry behaviour](https://developers.cloudflare.com/workflows/build/sleeping-and-retrying/). This is passed as a Python dictionary and then type translated into a `WorkflowStepConfig` object.

```python
from workers import WorkflowEntrypoint


class MyWorkflow(WorkflowEntrypoint):
    async def run(self, event, step):
        @step.do("my first step")
        async def my_first_step():
            # do some work
            return "Hello World!"


        await my_first_step()
```

Note that the decorator doesn't make the call to the step, it just returns a callable that can be used to invoke the step. You have to call the callable to make the step run.

When returning state from a step, you must make sure that the returned value is serializable. Since steps run through an FFI layer, the returned value gets type translated via [FFI.](https://pyodide.org/en/stable/usage/api/python-api/ffi.html#pyodide.ffi.to_js) Refer to [Pyodide's documentation](https://pyodide.org/en/stable/usage/type-conversions.html#type-translations-pyproxy-to-js) regarding type conversions for more information.

* `step.sleep(name, duration)`

  * `name` - the name of the step.
  * `duration` - the duration to sleep until, in either seconds or as a `WorkflowDuration` compatible string.

```python
async def run(self, event, step):
    await step.sleep("my-sleep-step", "10 seconds")
```

* `step.sleep_until(name, timestamp)`

  * `name` - the name of the step.
  * `timestamp` - a `datetime.datetime` object or seconds from the Unix epoch to sleep the workflow instance until.

```python
async def run(self, event, step):
    await step.sleep_until("my-sleep-step", datetime.datetime.now() + datetime.timedelta(seconds=10))
```

* `step.wait_for_event(name, event_type, timeout="24 hours")`

  * `name` - the name of the step.
  * `event_type` - the type of event to wait for.
  * `timeout` - the timeout for the `wait_for_event` call. The default timeout is 24 hours.

```python
async def run(self, event, step):
    await step.wait_for_event("my-wait-for-event-step", "my-event-type")
```

### `event` parameter

The `event` parameter is a dictionary that contains the payload passed to the workflow instance, along with other metadata:

* `payload` - the payload passed to the workflow instance.
* `timestamp` - the timestamp that the workflow was triggered.
* `instanceId` - the ID of the current workflow instance.
* `workflowName` - the name of the workflow.

## Error Handling

Workflows semantics allow users to catch exceptions that get thrown to the top level.

Catching specific exceptions within an `except` block may not work, as some Python errors will not be re-instantiated into the same type of error when they are passed through the RPC layer.

Note

Some built-in Python errors (e.g.: `ValueError`, `TypeError`) will work correctly. User defined exceptions, as well as other built-in Python errors will not and should be caught with the `Exception` class.

```python
async def run(self, event, step):
    async def try_step(fn):
        try:
            return await fn()
        except Exception as e:
            print(f"Successfully caught {type(e).__name__}: {e}")


    @step.do("my_failing")
    async def my_failing():
        print("Executing my_failing")
        raise TypeError("Intentional error in my_failing")


    await try_step(my_failing)
```

### NonRetryableError

The Python Workflows SDK provides a `NonRetryableError` class that can be used to signal that a step should not be retried.

```python
from workers.workflows import NonRetryableError


raise NonRetryableError(message)
```

## Configure a workflow instance

You can bind a step to a specific retry policy by passing a `WorkflowStepConfig` object to the `config` parameter of the `step.do` decorator. With Python Workflows, you need to make sure that your `dict` respects the [`WorkflowStepConfig`](https://developers.cloudflare.com/workflows/build/workers-api/#workflowstepconfig) type.

```python
class DemoWorkflowClass(WorkflowEntrypoint):
    async def run(self, event, step):
        @step.do('step-name', config={"retries": {"limit": 1, "delay": "10 seconds"}})
        async def first_step():
            # do some work
            pass
```

### Create an instance via binding

Note that `env` is a Javascript object exposed to the Python script via [JsProxy](https://pyodide.org/en/stable/usage/api/python-api/ffi.html#pyodide.ffi.JsProxy). You can access the binding like you would on a Javascript worker. Refer to the [Workflow binding documentation](https://developers.cloudflare.com/workflows/build/workers-api/#workflow) to learn more about the methods available.

Let's consider the previous binding called `MY_WORKFLOW`. Here's how you would create a new instance:

```python
async def on_fetch(request, env):
    instance = await env.MY_WORKFLOW.create()
    return Response.json({"status": "success"})
```
