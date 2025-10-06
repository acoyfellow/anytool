---
title: Transcode images · Cloudflare Images docs
description: Transcode an image from Workers AI before uploading to R2
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/examples/transcode-from-workers-ai/
  md: https://developers.cloudflare.com/images/examples/transcode-from-workers-ai/index.md
---

```js
const stream = await env.AI.run(
  "@cf/bytedance/stable-diffusion-xl-lightning",
  {
    prompt: YOUR_PROMPT_HERE
  }
);


// Convert to AVIF
const image = (
  await env.IMAGES.input(stream)
    .output({format: "image/avif"})
).response();


const fileName = "image.avif";


// Upload to R2
await env.R2.put(fileName, image.body);
```
