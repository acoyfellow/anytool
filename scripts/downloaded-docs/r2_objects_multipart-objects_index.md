---
title: Multipart upload · Cloudflare R2 docs
description: R2 supports S3 API's Multipart Upload with some limitations.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/objects/multipart-objects/
  md: https://developers.cloudflare.com/r2/objects/multipart-objects/index.md
---

R2 supports [S3 API's Multipart Upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) with some limitations.

## Limitations

Object part sizes must be at least 5MiB but no larger than 5GiB. All parts except the last one must be the same size. The last part has no minimum size, but must be the same or smaller than the other parts.

The maximum number of parts is 10,000.

Most S3 clients conform to these expectations.

## Lifecycles

The default object lifecycle policy for multipart uploads is that incomplete uploads will be automatically aborted after 7 days. This can be changed by [configuring a custom lifecycle policy](https://developers.cloudflare.com/r2/buckets/object-lifecycles/).

## ETags

The ETags for objects uploaded via multipart are different than those uploaded with PutObject.

For uploads created after June 21, 2023, R2's multipart ETags now mimic the behavior of S3. The ETag of each individual part is the MD5 hash of the contents of the part. The ETag of the completed multipart object is the hash of the MD5 sums of each of the constituent parts concatenated together followed by a hyphen and the number of parts uploaded.

For example, consider a multipart upload with two parts. If they have the ETags `bce6bf66aeb76c7040fdd5f4eccb78e6` and `8165449fc15bbf43d3b674595cbcc406` respectively, the ETag of the completed multipart upload will be `f77dc0eecdebcd774a2a22cb393ad2ff-2`.

Note that the binary MD5 sums themselves are concatenated and then summed, not the hexadecimal representation. For example, in order to validate the above example on the command line, you would need do the following:

```plaintext
echo -n $(echo -n bce6bf66aeb76c7040fdd5f4eccb78e6 | xxd -r -p -)\
$(echo -n 8165449fc15bbf43d3b674595cbcc406 | xxd -r -p -) | md5sum
```

## Other resources

For information on R2 Workers Binding API, refer to [R2 Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/).
