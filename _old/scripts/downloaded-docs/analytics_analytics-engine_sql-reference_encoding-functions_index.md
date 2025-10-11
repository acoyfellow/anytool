---
title: SQL Reference · Cloudflare Analytics docs
description: "Usage:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/encoding-functions/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/encoding-functions/index.md
---

## bin New

Usage:

```sql
bin(<expression>)
```

`bin` returns a string containing the binary representation of its argument.

Examples:

```sql
-- get the binary representation of 1
bin(1)
-- get the binary representation of a string`
bin('abc')
```

## hex New

Usage:

```sql
hex(<expression>)
```

`hex` returns a string containing the hexadecimal representation of its argument.

Examples:

```sql
-- get the hexadecimal representation of 1
hex(1)
-- get the hexadecimal representation of a string`
hex('abc')
```
