---
title: url · Cloudflare Workers docs
description: Returns the Punycode ASCII serialization of the domain. If domain
  is an invalid domain, the empty string is returned.
lastUpdated: 2025-08-20T18:47:44.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers/runtime-apis/nodejs/url/
  md: https://developers.cloudflare.com/workers/runtime-apis/nodejs/url/index.md
---

Note

To enable built-in Node.js APIs and polyfills, add the nodejs\_compat compatibility flag to your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). This also enables nodejs\_compat\_v2 as long as your compatibility date is 2024-09-23 or later. [Learn more about the Node.js compatibility flag and v2](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag).

## domainToASCII

Returns the Punycode ASCII serialization of the domain. If domain is an invalid domain, the empty string is returned.

```js
import { domainToASCII } from "node:url";


console.log(domainToASCII("español.com"));
// Prints xn--espaol-zwa.com
console.log(domainToASCII("中文.com"));
// Prints xn--fiq228c.com
console.log(domainToASCII("xn--iñvalid.com"));
// Prints an empty string
```

## domainToUnicode

Returns the Unicode serialization of the domain. If domain is an invalid domain, the empty string is returned.

It performs the inverse operation to `domainToASCII()`.

```js
import { domainToUnicode } from "node:url";


console.log(domainToUnicode("xn--espaol-zwa.com"));
// Prints español.com
console.log(domainToUnicode("xn--fiq228c.com"));
// Prints 中文.com
console.log(domainToUnicode("xn--iñvalid.com"));
// Prints an empty string
```
