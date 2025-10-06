---
title: Status Hooks · Cloudflare Containers docs
description: Execute Workers code in reaction to Container status changes
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/examples/status-hooks/
  md: https://developers.cloudflare.com/containers/examples/status-hooks/index.md
---

When a Container starts, stops, and errors, it can trigger code execution in a Worker that has defined status hooks on the `Container` class. Refer to the [Container package docs](https://github.com/cloudflare/containers/blob/main/README.md#lifecycle-hooks) for more details.

```js
import { Container } from '@cloudflare/containers';


export class MyContainer extends Container {
  defaultPort = 4000;
  sleepAfter = '5m';


  override onStart() {
    console.log('Container successfully started');
  }


  override onStop(stopParams) {
    if (stopParams.exitCode === 0) {
      console.log('Container stopped gracefully');
    } else {
      console.log('Container stopped with exit code:', stopParams.exitCode);
    }


    console.log('Container stop reason:', stopParams.reason);
  }


  override onError(error: string) {
    console.log('Container error:', error);
  }
}
```
