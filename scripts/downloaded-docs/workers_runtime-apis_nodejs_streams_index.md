---
title: Streams - Node.js APIs · Cloudflare Workers docs
description: The Node.js streams API is the original API for working with
  streaming data in JavaScript, predating the WHATWG ReadableStream standard. A
  stream is an abstract interface for working with streaming data in Node.js.
  Streams can be readable, writable, or both. All streams are instances of
  EventEmitter.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/streams/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/streams/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

The [Node.js streams API](https://nodejs.org/api/stream.html) is the original API for working with streaming data in JavaScript, predating the [WHATWG ReadableStream standard](https://streams.spec.whatwg.org/). A stream is an abstract interface for working with streaming data in Node.js. Streams can be readable, writable, or both. All streams are instances of [EventEmitter](https://developers.cloudflare.com/workers/runtime-apis/nodejs/eventemitter/).

Where possible, you should use the [WHATWG standard "Web Streams" API](https://streams.spec.whatwg.org/), which is [supported in Workers](https://streams.spec.whatwg.org/).

```js
import { Readable, Transform } from "node:stream";


import { text } from "node:stream/consumers";


import { pipeline } from "node:stream/promises";


// A Node.js-style Transform that converts data to uppercase
// and appends a newline to the end of the output.
class MyTransform extends Transform {
  constructor() {
    super({ encoding: "utf8" });
  }
  _transform(chunk, _, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  }
  _flush(cb) {
    this.push("\n");
    cb();
  }
}


export default {
  async fetch() {
    const chunks = [
      "hello ",
      "from ",
      "the ",
      "wonderful ",
      "world ",
      "of ",
      "node.js ",
      "streams!",
    ];


    function nextChunk(readable) {
      readable.push(chunks.shift());
      if (chunks.length === 0) readable.push(null);
      else queueMicrotask(() => nextChunk(readable));
    }


    // A Node.js-style Readable that emits chunks from the
    // array...
    const readable = new Readable({
      encoding: "utf8",
      read() {
        nextChunk(readable);
      },
    });


    const transform = new MyTransform();
    await pipeline(readable, transform);
    return new Response(await text(transform));
  },
};
```

Refer to the [Node.js documentation for `stream`](https://nodejs.org/api/stream.html) for more information.
