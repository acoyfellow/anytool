---
title: SQL Reference · Cloudflare Analytics docs
description: "Usage:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/type-conversion-functions/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/type-conversion-functions/index.md
---

## toUInt8 New

Usage:

```sql
toUInt8(<expression>)
```

Converts any numeric expression, or expression resulting in a string representation of a decimal, into an unsigned 8 bit integer.

Behaviour for negative numbers is undefined.

## toUInt32

Usage:

```sql
toUInt32(<expression>)
```

Converts any numeric expression, or expression resulting in a string representation of a decimal, into an unsigned 32 bit integer.

Behaviour for negative numbers is undefined.
