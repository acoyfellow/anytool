---
title: Glossary · Cloudflare Workflows docs
description: Review the definitions for terms used across Cloudflare's Workflows
  documentation.
lastUpdated: 2024-10-24T11:52:00.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workflows/reference/glossary/
  md: https://developers.cloudflare.com/workflows/reference/glossary/index.md
---

Review the definitions for terms used across Cloudflare's Workflows documentation.

| Term | Definition |
| - | - |
| Durable Execution | "Durable Execution" is a programming model that allows applications to execute reliably, automatically persist state, retry, and be resistant to errors caused by API, network or even machine/infrastructure failures. Cloudflare Workflows provide a way to build and deploy applications that align with this model. |
| Event | The event that triggered the Workflow instance. A `WorkflowEvent` may contain optional parameters (data) that a Workflow can operate on. |
| instance | A specific instance (running, paused, errored) of a Workflow. A Workflow can have a potentially infinite number of instances. |
| step | A step is self-contained, individually retriable component of a Workflow. Steps may emit (optional) state that allows a Workflow to persist and continue from that step, even if a Workflow fails due to a network or infrastructure issue. A Workflow can have one or more steps up to the [step limit](https://developers.cloudflare.com/workflows/reference/limits/). |
| Workflow | The named Workflow definition, associated with a single Workers script. |
