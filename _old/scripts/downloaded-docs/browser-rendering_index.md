---
title: Browser Rendering · Cloudflare Browser Rendering docs
description: Control headless browsers with Cloudflare's Workers Browser
  Rendering API. Automate tasks, take screenshots, convert pages to PDFs, and
  test web apps.
lastUpdated: 2025-09-03T23:32:34.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/browser-rendering/
  md: https://developers.cloudflare.com/browser-rendering/index.md
---

Browser automation for [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [quick browser actions](https://developers.cloudflare.com/browser-rendering/rest-api/).

Available on Free and Paid plans

Browser Rendering enables developers to programmatically control and interact with headless browser instances running on Cloudflare’s global network. This facilitates tasks such as automating browser interactions, capturing screenshots, generating PDFs, and extracting data from web pages.

## Integration Methods

You can integrate Browser Rendering into your applications using one of the following methods:

* **[REST API](https://developers.cloudflare.com/browser-rendering/rest-api/)**: Ideal for simple, stateless tasks like capturing screenshots, generating PDFs, extracting HTML content, and more.
* **[Workers Bindings](https://developers.cloudflare.com/browser-rendering/workers-bindings/)**: Suitable for advanced browser automation within [Cloudflare Workers](https://developers.cloudflare.com/workers/). This method provides greater control, enabling more complex workflows and persistent sessions.

Choose the method that best fits your use case. For example, use the [REST API endpoints](https://developers.cloudflare.com/browser-rendering/rest-api/) for straightforward tasks from external applications and use [Workers Bindings](https://developers.cloudflare.com/browser-rendering/workers-bindings/) for complex automation within the Cloudflare ecosystem.

## Use Cases

Browser Rendering can be utilized for various purposes, including:

* Fetch HTML content of a page.
* Capture screenshot of a webpage.
* Convert a webpage into a PDF document.
* Take a webpage snapshot.
* Scrape specified HTML elements from a webpage.
* Retrieve data in a structured format.
* Extract Markdown content from a webpage.
* Gather all hyperlinks found on a webpage.

## Related products

**[Workers](https://developers.cloudflare.com/workers/)**

Build serverless applications and deploy instantly across the globe for exceptional performance, reliability, and scale.

**[Durable Objects](https://developers.cloudflare.com/durable-objects/)**

A globally distributed coordination API with strongly consistent storage.

**[Agents](https://developers.cloudflare.com/agents/)**

Build and deploy AI-powered agents that can autonomously perform tasks.

## More resources

[Get started](https://developers.cloudflare.com/browser-rendering/get-started/)

Deploy your first Browser Rendering project using Wrangler and Cloudflare's version of Puppeteer.

[Limits](https://developers.cloudflare.com/browser-rendering/platform/limits/)

Learn about Browser Rendering limits.

[Pricing](https://developers.cloudflare.com/browser-rendering/platform/pricing/)

Learn about Browser Rendering pricing.

[Learning Path](https://developers.cloudflare.com/learning-paths/workers/concepts/)

New to Workers? Get started with the Workers Learning Path.

[Developer Discord](https://discord.cloudflare.com)

Connect with the Workers community on Discord to ask questions, show what you are building, and discuss the platform with other developers.

[@CloudflareDev](https://x.com/cloudflaredev)

Follow @CloudflareDev on Twitter to learn about product announcements, and what is new in Cloudflare Workers.
