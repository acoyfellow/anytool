---
title: Binary string functions · Cloudflare Pipelines Docs
description: Scalar functions for manipulating binary strings
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/binary-string/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/binary-string/index.md
---

*Cloudflare Pipelines scalar function implementations are based on [Apache DataFusion](https://arrow.apache.org/datafusion/) (via [Arroyo](https://www.arroyo.dev/)) and these docs are derived from the DataFusion function reference.*

## `encode`

Encode binary data into a textual representation.

```plaintext
encode(expression, format)
```

**Arguments**

* **expression**: Expression containing string or binary data

* **format**: Supported formats are: `base64`, `hex`

**Related functions**: [decode](#decode)

## `decode`

Decode binary data from textual representation in string.

```plaintext
decode(expression, format)
```

**Arguments**

* **expression**: Expression containing encoded string data

* **format**: Same arguments as [encode](#encode)

**Related functions**: [encode](#encode)
