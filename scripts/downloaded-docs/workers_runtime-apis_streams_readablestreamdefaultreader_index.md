---
title: ReadableStreamDefaultReader · Cloudflare Workers docs
description: A reader is used when you want to read from a ReadableStream,
  rather than piping its output to a WritableStream.
lastUpdated: 2025-02-19T14:52:46.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/streams/readablestreamdefaultreader/
  md: https://developers.cloudflare.com/workers/runtime-apis/streams/readablestreamdefaultreader/index.md
---

## Background

A reader is used when you want to read from a [`ReadableStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/readablestream/), rather than piping its output to a [`WritableStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/writablestream/).

A `ReadableStreamDefaultReader` is not instantiated via its constructor. Rather, it is retrieved from a [`ReadableStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/readablestream/):

```js
const { readable, writable } = new TransformStream();
const reader = readable.getReader();
```

***

## Properties

* `reader.closed` : Promise

  * A promise indicating if the reader is closed. The promise is fulfilled when the reader stream closes and is rejected if there is an error in the stream.

## Methods

* `read()` : Promise

  * A promise that returns the next available chunk of data being passed through the reader queue.

* `cancel(reasonstringoptional)` : void

  * Cancels the stream. `reason` is an optional human-readable string indicating the reason for cancellation. `reason` will be passed to the underlying source’s cancel algorithm -- if this readable stream is one side of a [`TransformStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/), then its cancel algorithm causes the transform’s writable side to become errored with `reason`.

  Warning

  Any data not yet read is lost.

* `releaseLock()` : void

  * Releases the lock on the readable stream. A lock cannot be released if the reader has pending read operations. A `TypeError` is thrown and the reader remains locked.

***

## Related resources

* [Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/)
* [Readable streams in the WHATWG Streams API specification](https://streams.spec.whatwg.org/#rs-model)
