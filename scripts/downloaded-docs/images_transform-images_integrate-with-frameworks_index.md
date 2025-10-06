---
title: Integrate with frameworks · Cloudflare Images docs
description: Image transformations can be used automatically with the Next.js
  <Image /> component.
lastUpdated: 2025-02-03T14:37:08.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/transform-images/integrate-with-frameworks/
  md: https://developers.cloudflare.com/images/transform-images/integrate-with-frameworks/index.md
---

## Next.js

Image transformations can be used automatically with the Next.js [`<Image />` component](https://nextjs.org/docs/api-reference/next/image).

To use image transformations, define a global image loader or multiple custom loaders for each `<Image />` component.

Next.js will request the image with the correct parameters for width and quality.

Image transformations will be responsible for caching and serving an optimal format to the client.

### Global Loader

To use Images with **all** your app's images, define a global [loaderFile](https://nextjs.org/docs/pages/api-reference/components/image#loaderfile) for your app.

Add the following settings to the **next.config.js** file located at the root our your Next.js application.

```ts
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.ts',
  },
}
```

Next, create the `imageLoader.ts` file in the specified path (relative to the root of your Next.js application).

```ts
const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
};


export default function cloudflareLoader({
    src,
    width,
    quality,
}: { src: string; width: number; quality?: number }) {
    if (process.env.NODE_ENV === "development") {
        return src;
    }
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(",");
    return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}
```

### Custom Loaders

Alternatively, define a loader for each `<Image />` component.

```js
import Image from 'next/image';


const normalizeSrc = src => {
  return src.startsWith('/') ? src.slice(1) : src;
};


const cloudflareLoader = ({ src, width, quality }) => {
  if (process.env.NODE_ENV === "development") {
    return src;
  }
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};


const MyImage = props => {
  return (
    <Image
      loader={cloudflareLoader}
      src="/me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
};
```

Note

For local development, you can enable [Resize images from any origin checkbox](https://developers.cloudflare.com/images/get-started/) for your zone. Then, replace `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}` with an absolute URL path:

`https://<YOUR_DOMAIN.COM>/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`
