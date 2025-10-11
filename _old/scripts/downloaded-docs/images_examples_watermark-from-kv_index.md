---
title: Watermarks · Cloudflare Images docs
description: Draw a watermark from KV on an image from R2
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/examples/watermark-from-kv/
  md: https://developers.cloudflare.com/images/examples/watermark-from-kv/index.md
---

```ts
interface Env {
    BUCKET: R2Bucket,
    NAMESPACE: KVNamespace,
    IMAGES: ImagesBinding,
}
export default {
    async fetch(request, env, ctx): Promise<Response> {
        const watermarkKey = "my-watermark";
        const sourceKey = "my-source-image";


        const cache = await caches.open("transformed-images");
        const cacheKey = new URL(sourceKey + "/" + watermarkKey, request.url);
        const cacheResponse = await cache.match(cacheKey);


        if (cacheResponse) {
            return cacheResponse;
        }


        let watermark = await env.NAMESPACE.get(watermarkKey, "stream");
        let source = await env.BUCKET.get(sourceKey);


        if (!watermark || !source) {
            return new Response("Not found", { status: 404 });
        }


        const result = await env.IMAGES.input(source.body)
            .draw(watermark)
            .output({ format: "image/jpeg" });


        const response = result.response();


        ctx.waitUntil(cache.put(cacheKey, response.clone()));


        return result.response();
  },
} satisfies ExportedHandler<Env>;
```
