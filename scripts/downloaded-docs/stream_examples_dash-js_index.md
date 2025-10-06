---
title: dash.js · Cloudflare Stream docs
description: Example of video playback with Cloudflare Stream and the DASH
  reference player (dash.js)
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
tags: Playback
source_url:
  html: https://developers.cloudflare.com/stream/examples/dash-js/
  md: https://developers.cloudflare.com/stream/examples/dash-js/index.md
---

```html
<html>
  <head>
    <script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
  </head>
  <body>
    <div>
      <div class="code">
        <video
          data-dashjs-player=""
          autoplay=""
          src="https://customer-f33zs165nr7gyfy4.cloudflarestream.com/6b9e68b07dfee8cc2d116e4c51d6a957/manifest/video.mpd"
          controls="true"
        ></video>
      </div>
    </div>
  </body>
</html>
```

Refer to the [dash.js documentation](https://github.com/Dash-Industry-Forum/dash.js/) for more information.
