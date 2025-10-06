---
title: Load Zaraz manually · Cloudflare Zaraz docs
description: By default, if your domain is proxied by Cloudflare, Zaraz will
  automatically inject itself to HTML pages in your site. This makes it easier
  to get up and running quickly. However, you might want to load Zaraz manually,
  for example to test Zaraz on specific pages first.
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/zaraz/advanced/load-zaraz-manually/
  md: https://developers.cloudflare.com/zaraz/advanced/load-zaraz-manually/index.md
---

By default, if your domain is proxied by Cloudflare, Zaraz will automatically inject itself to HTML pages in your site. This makes it easier to get up and running quickly. However, you might want to load Zaraz manually, for example to test Zaraz on specific pages first.

After you turn off the [Auto-inject script](https://developers.cloudflare.com/zaraz/reference/settings/#auto-inject-script) option, you will have to manually include the Zaraz script in your HTML, immediately before the `</head>` tag closes. The path to your script would be `/cdn-cgi/zaraz/i.js`. Your script tag should look like this:

```html
<script src="/cdn-cgi/zaraz/i.js" referrerpolicy="origin"></script>
```

With the script, your page HTML should be similar to the following:

```html
<html>
  <head>
    ….
    <script src="/cdn-cgi/zaraz/i.js" referrerpolicy="origin"></script>
  </head>
  <body>
    …
  </body>
</html>
```

Note that if your site is not proxied by Cloudflare, you should refer to the section about [Using Zaraz on domains not proxied by Cloudflare](https://developers.cloudflare.com/zaraz/advanced/domains-not-proxied/).
