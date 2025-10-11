---
title: Hashing functions · Cloudflare Pipelines Docs
description: Scalar functions for hashing values
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/hashing/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/hashing/index.md
---

*Cloudflare Pipelines scalar function implementations are based on [Apache DataFusion](https://arrow.apache.org/datafusion/) (via [Arroyo](https://www.arroyo.dev/)) and these docs are derived from the DataFusion function reference.*

## `digest`

Computes the binary hash of an expression using the specified algorithm.

```plaintext
digest(expression, algorithm)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

* **algorithm**: String expression specifying algorithm to use. Must be one of:

  * md5
  * sha224
  * sha256
  * sha384
  * sha512
  * blake2s
  * blake2b
  * blake3

## `md5`

Computes an MD5 128-bit checksum for a string expression.

```plaintext
md5(expression)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

## `sha224`

Computes the SHA-224 hash of a binary string.

```plaintext
sha224(expression)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

## `sha256`

Computes the SHA-256 hash of a binary string.

```plaintext
sha256(expression)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

## `sha384`

Computes the SHA-384 hash of a binary string.

```plaintext
sha384(expression)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

## `sha512`

Computes the SHA-512 hash of a binary string.

```plaintext
sha512(expression)
```

**Arguments**

* **expression**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
