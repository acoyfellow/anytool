---
title: Upload via a Worker · Cloudflare Images docs
description: Learn how to upload images to Cloudflare using Workers. This guide
  provides code examples for uploading both standard and AI-generated images
  efficiently.
lastUpdated: 2025-04-02T16:09:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/upload-images/upload-file-worker/
  md: https://developers.cloudflare.com/images/upload-images/upload-file-worker/index.md
---

You can use a Worker to upload your image to Cloudflare Images.

Refer to the example below or refer to the [Workers documentation](https://developers.cloudflare.com/workers/) for more information.

```ts
const API_URL = "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1";
const TOKEN = "<YOUR_TOKEN_HERE>";


const image = await fetch("https://example.com/image.png");
const bytes = await image.bytes();


const formData = new FormData();
formData.append('file', new File([bytes], 'image.png'));


const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
  },
  body: formData,
});
```

## Upload from AI generated images

You can use an AI Worker to generate an image and then upload that image to store it in Cloudflare Images. For more information about using Workers AI to generate an image, refer to the [SDXL-Lightning Model](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-lightning).

```ts
const API_URL = "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1";
const TOKEN = "YOUR_TOKEN_HERE";


const stream = await env.AI.run(
  "@cf/bytedance/stable-diffusion-xl-lightning",
  {
    prompt: YOUR_PROMPT_HERE
  }
);
const bytes = await (new Response(stream)).bytes();


const formData = new FormData();
formData.append('file', new File([bytes], 'image.jpg');


const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
  },
  body: formData,
});
```
