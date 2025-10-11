---
title: Langchain · Cloudflare Workers docs
description: LangChain is the most popular framework for building AI
  applications powered by large language models (LLMs).
lastUpdated: 2025-09-01T10:19:51.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/languages/python/packages/langchain/
  md: https://developers.cloudflare.com/workers/languages/python/packages/langchain/index.md
---

[LangChain](https://www.langchain.com/) is the most popular framework for building AI applications powered by large language models (LLMs).

LangChain publishes multiple Python packages. The following are provided by the Workers runtime:

* [`langchain`](https://pypi.org/project/langchain/) (version `0.1.8`)
* [`langchain-core`](https://pypi.org/project/langchain-core/) (version `0.1.25`)
* [`langchain-openai`](https://pypi.org/project/langchain-openai/) (version `0.0.6`)

## Get Started

Python Workers are in beta. Packages do not run in production.

Currently, you can only deploy Python Workers that use the standard library. [Packages](https://developers.cloudflare.com/workers/languages/python/packages/#supported-packages) **cannot be deployed** and will only work in local development for the time being.

Clone the `cloudflare/python-workers-examples` repository and run the LangChain example:

```bash
git clone https://github.com/cloudflare/python-workers-examples
cd 04-langchain
npx wrangler@latest dev
```

### Example code

```python
from workers import WorkerEntrypoint, Response
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        prompt = PromptTemplate.from_template("Complete the following sentence: I am a {profession} and ")
        llm = OpenAI(api_key=self.env.API_KEY)
        chain = prompt | llm


        res = await chain.ainvoke({"profession": "electrician"})
        return Response(res.split(".")[0].strip())
```
