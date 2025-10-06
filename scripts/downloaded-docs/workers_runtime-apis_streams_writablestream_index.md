---
title: WritableStream · Cloudflare Workers docs
description: A WritableStream is the writable property of a TransformStream. On
  the Workers platform, WritableStream cannot be directly created using the
  WritableStream constructor.
lastUpdated: 2025-02-19T14:52:46.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/streams/writablestream/
  md: https://developers.cloudflare.com/workers/runtime-apis/streams/writablestream/index.md
---

## Background

A `WritableStream` is the `writable` property of a [`TransformStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/). On the Workers platform, `WritableStream` cannot be directly created using the `WritableStream` constructor.

A typical way to write to a `WritableStream` is to pipe a [`ReadableStream`](https://developers.cloudflare.com/workers/runtime-apis/streams/readablestream/) to it.

```js
readableStream
  .pipeTo(writableStream)
  .then(() => console.log('All data successfully written!'))
  .catch(e => console.error('Something went wrong!', e));
```

To write to a `WritableStream` directly, you must use its writer.

```js
const writer = writableStream.getWriter();
writer.write(data);
```

Refer to the [WritableStreamDefaultWriter](https://developers.cloudflare.com/workers/runtime-apis/streams/writablestreamdefaultwriter/) documentation for further detail.

## Properties

* `locked` boolean

  * A Boolean value to indicate if the writable stream is locked to a writer.

## Methods

* `abort(reasonstringoptional)` : Promise\<void>

  * Aborts the stream. This method returns a promise that fulfills with a response `undefined`. `reason` is an optional human-readable string indicating the reason for cancellation. `reason` will be passed to the underlying sink’s abort algorithm. If this writable stream is one side of a [TransformStream](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/), then its abort algorithm causes the transform’s readable side to become errored with `reason`.

  Warning

  Any data not yet written is lost upon abort.

* `getWriter()` : WritableStreamDefaultWriter

  * Gets an instance of `WritableStreamDefaultWriter` and locks the `WritableStream` to that writer instance.

***

## Related resources

* [Streams](https://developers.cloudflare.com/workers/runtime-apis/streams/)
* [Writable streams in the WHATWG Streams API specification](https://streams.spec.whatwg.org/#ws-model)
