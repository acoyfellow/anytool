---
title: Demos and architectures · Cloudflare D1 docs
description: Learn how you can use D1 within your existing application and architecture.
lastUpdated: 2025-04-09T22:35:27.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/demos/
  md: https://developers.cloudflare.com/d1/demos/index.md
---

Learn how you can use D1 within your existing application and architecture.

## Featured Demos

* [Starter code for D1 Sessions API](https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api-template): An introduction to D1 Sessions API. This demo simulates purchase orders administration.

  [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api-template)

Tip: Place your database further away for the read replication demo

To simulate how read replication can improve a worst case latency scenario, select your primary database location to be in a farther away region (one of the deployment steps).

You can find this in the **Database location hint** dropdown.

## Demos

Explore the following demo applications for D1.

* [Starter code for D1 Sessions API:](https://github.com/cloudflare/templates/tree/main/d1-starter-sessions-api-template) An introduction to D1 Sessions API. This demo simulates purchase orders administration.
* [E-commerce Store:](https://github.com/harshil1712/e-com-d1) An application to showcase D1 read replication in the context of an online store.
* [Jobs At Conf:](https://github.com/harshil1712/jobs-at-conf-demo) A job lisiting website to add jobs you find at in-person conferences. Built with Cloudflare Pages, R2, D1, Queues, and Workers AI.
* [Remix Authentication Starter:](https://github.com/harshil1712/remix-d1-auth-template) Implement authenticating to a Remix app and store user data in Cloudflare D1.
* [JavaScript-native RPC on Cloudflare Workers <> Named Entrypoints:](https://github.com/cloudflare/js-rpc-and-entrypoints-demo) This is a collection of examples of communicating between multiple Cloudflare Workers using the remote-procedure call (RPC) system that is built into the Workers runtime.
* [Workers for Platforms Example Project:](https://github.com/cloudflare/workers-for-platforms-example) Explore how you could manage thousands of Workers with a single Cloudflare Workers account.
* [Staff Directory demo:](https://github.com/lauragift21/staff-directory) Built using the powerful combination of HonoX for backend logic, Cloudflare Pages for fast and secure hosting, and Cloudflare D1 for seamless database management.
* [Wildebeest:](https://github.com/cloudflare/wildebeest) Wildebeest is an ActivityPub and Mastodon-compatible server whose goal is to allow anyone to operate their Fediverse server and identity on their domain without needing to keep infrastructure, with minimal setup and maintenance, and running in minutes.
* [D1 Northwind Demo:](https://github.com/cloudflare/d1-northwind) This is a demo of the Northwind dataset, running on Cloudflare Workers, and D1 - Cloudflare's SQL database, running on SQLite.

## Reference architectures

Explore the following reference architectures that use D1:

[Composable AI architecture](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-composable/)

[The architecture diagram illustrates how AI applications can be built end-to-end on Cloudflare, or single services can be integrated with external infrastructure and services.](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-composable/)

[Retrieval Augmented Generation (RAG)](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-rag/)

[RAG combines retrieval with generative models for better text. It uses external knowledge to create factual, relevant responses, improving coherence and accuracy in NLP tasks like chatbots.](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-rag/)

[Ingesting BigQuery Data into Workers AI](https://developers.cloudflare.com/reference-architecture/diagrams/ai/bigquery-workers-ai/)

[You can connect a Cloudflare Worker to get data from Google BigQuery and pass it to Workers AI, to run AI Models, powered by serverless GPUs.](https://developers.cloudflare.com/reference-architecture/diagrams/ai/bigquery-workers-ai/)

[Optimizing and securing connected transportation systems](https://developers.cloudflare.com/reference-architecture/diagrams/iot/optimizing-and-securing-connected-transportation-systems/)

[This diagram showcases Cloudflare components optimizing connected transportation systems. It illustrates how their technologies minimize latency, ensure reliability, and strengthen security for critical data flow.](https://developers.cloudflare.com/reference-architecture/diagrams/iot/optimizing-and-securing-connected-transportation-systems/)

[Fullstack applications](https://developers.cloudflare.com/reference-architecture/diagrams/serverless/fullstack-application/)

[A practical example of how these services come together in a real fullstack application architecture.](https://developers.cloudflare.com/reference-architecture/diagrams/serverless/fullstack-application/)

[Serverless global APIs](https://developers.cloudflare.com/reference-architecture/diagrams/serverless/serverless-global-apis/)

[An example architecture of a serverless API on Cloudflare and aims to illustrate how different compute and data products could interact with each other.](https://developers.cloudflare.com/reference-architecture/diagrams/serverless/serverless-global-apis/)
