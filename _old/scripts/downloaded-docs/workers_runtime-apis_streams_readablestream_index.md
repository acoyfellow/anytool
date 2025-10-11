---
title: ReadableStream · Cloudflare Workers docs
description: A ReadableStream is returned by the readable property inside TransformStream.
lastUpdated: 2025-07-17T13:26:40.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/streams/readablestream/
  md: https://developers.cloudflare.com/workers/runtime-apis/streams/readablestream/index.md
---

## Background

A `ReadableStream` is returned by the `readable` property inside [`TransformStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/).

## Properties

* `locked` boolean
  * A Boolean value that indicates if the readable stream is locked to a reader.

## Methods

* `pipeTo(destinationWritableStream, optionsPipeToOptions)` : Promise\<void>

  * Pipes the readable stream to a given writable stream `destination` and returns a promise that is fulfilled when the `write` operation succeeds or rejects it if the operation fails.

* `getReader(optionsObject)` : ReadableStreamDefaultReader

  * Gets an instance of `ReadableStreamDefaultReader` and locks the `ReadableStream` to that reader instance. This method accepts an object argument indicating options. The only supported option is `mode`, which can be set to `byob` to create a [`ReadableStreamBYOBReader`](https://developers.cloudflare.com/workers/runtime-apis/streams/readablestreambyobreader/), as shown here:

```js
let reader = readable.getReader({ mode: 'byob' });
```

### `PipeToOptions`

* `preventClose` bool

  * When `true`, closure of the source `ReadableStream` will not cause the destination `WritableStream` to be closed.

* `preventAbort` bool

  * When `true`, errors in the source `ReadableStream` will no longer abort the destination `WritableStream`. `pipeTo` will return a rejected promise with the error from the source or any error that occurred while aborting the destination.

***

## Related resources

* [Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/)
* [Readable streams in the WHATWG Streams API specification](https://streams.spec.whatwg.org/#rs-model)
* [MDN’s `ReadableStream` documentation](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
