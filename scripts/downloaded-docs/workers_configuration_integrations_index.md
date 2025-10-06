---
title: Integrations · Cloudflare Workers docs
description: Integrate with third-party services and products.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/configuration/integrations/
  md: https://developers.cloudflare.com/workers/configuration/integrations/index.md
---

One of the key features of Cloudflare Workers is the ability to integrate with other services and products. In this document, we will explain the types of integrations available with Cloudflare Workers and provide step-by-step instructions for using them.

## Types of integrations

Cloudflare Workers offers several types of integrations, including:

* [Databases](https://developers.cloudflare.com/workers/databases/): Cloudflare Workers can be integrated with a variety of databases, including SQL and NoSQL databases. This allows you to store and retrieve data from your databases directly from your Cloudflare Workers code.
* [APIs](https://developers.cloudflare.com/workers/configuration/integrations/apis/): Cloudflare Workers can be used to integrate with external APIs, allowing you to access and use the data and functionality exposed by those APIs in your own code.
* [Third-party services](https://developers.cloudflare.com/workers/configuration/integrations/external-services/): Cloudflare Workers can be used to integrate with a wide range of third-party services, such as payment gateways, authentication providers, and more. This makes it possible to use these services in your Cloudflare Workers code.

## How to use integrations

To use any of the available integrations:

* Determine which integration you want to use and make sure you have the necessary accounts and credentials for it.
* In your Cloudflare Workers code, import the necessary libraries or modules for the integration.
* Use the provided APIs and functions to connect to the integration and access its data or functionality.
* Store necessary secrets and keys using secrets via [`wrangler secret put <KEY>`](https://developers.cloudflare.com/workers/wrangler/commands/#secret).

## Tips and best practices

To help you get the most out of using integrations with Cloudflare Workers:

* Secure your integrations and protect sensitive data. Ensure you use secure authentication and authorization where possible, and ensure the validity of libraries you import.
* Use [caching](https://developers.cloudflare.com/workers/reference/how-the-cache-works) to improve performance and reduce the load on an external service.
* Split your Workers into service-oriented architecture using [Service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) to make your application more modular, easier to maintain, and more performant.
* Use [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) when communicating with external APIs and services, which create a DNS record on your behalf and treat your Worker as an application instead of a proxy.
