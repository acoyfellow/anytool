---
title: crypto · Cloudflare Workers docs
description: The node:crypto module provides cryptographic functionality that
  includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign,
  and verify functions.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

The [`node:crypto`](https://nodejs.org/docs/latest/api/crypto.html) module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.

All `node:crypto` APIs are fully supported in Workers with the following exceptions:

* The functions [generateKeyPair](https://nodejs.org/api/crypto.html#cryptogeneratekeypairtype-options-callback) and [generateKeyPairSync](https://nodejs.org/api/crypto.html#cryptogeneratekeypairsynctype-options) do not support DSA or DH key pairs.
* `ed448` and `x448` curves are not supported.
* It is not possible to manually enable or disable [FIPS mode](https://nodejs.org/docs/latest/api/crypto.html#fips-mode).

The full `node:crypto` API is documented in the [Node.js documentation for `node:crypto`](https://nodejs.org/api/crypto.html).

The [WebCrypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/) is also available within Cloudflare Workers. This does not require the `nodejs_compat` compatibility flag.
