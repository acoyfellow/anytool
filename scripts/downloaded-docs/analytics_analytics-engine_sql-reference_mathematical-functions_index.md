---
title: SQL Reference · Cloudflare Analytics docs
description: "Usage:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/mathematical-functions/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/mathematical-functions/index.md
---

## intDiv

Usage:

```sql
intDiv(a, b)
```

Divide `a` by `b`, rounding the answer down to the nearest whole number.

## log New

Usage:

```sql
log(<expression>)
```

`log` returns the natural logarithm of a provided number. `ln` is also available as an alias.

Examples:

```sql
-- get the natural logarithm of the double1 column
log(double1)
```

## pow New

Usage:

```sql
pow(<expression>, <expression>)
```

`pow` returns the first argument raised to the power of the second argument.

Examples:

```sql
-- get the square of the double1 column
pow(double1, 2)
```

## round New

Usage:

```sql
round(<expression>[, n])
```

`round` returns a number rounded to the nearest whole number, or to a given number of decimal points specified by the second argument.

Examples:

```sql
-- round 5.5 to 6
round(5.5)
-- round 3.14 to 3.1
round(3.14, 1)
```

## floor New

Usage:

```sql
floor(<expression>[, n])
```

`floor` returns a number rounded down to a whole number, or rounded down to a given number of decimal points specified by the second argument.

Examples:

```sql
-- round down 5.5 to 5
floor(5.5)
-- round down 3.14 to 3.1
floor(3.14, 1)
```

## ceil New

Usage:

```sql
ceil(<expression>[, n])
```

`ceil` returns a number rounded up to a whole number, or rounded up to a given number of decimal points specified by the second argument.

Examples:

```sql
-- round up 5.5 to 6
ceil(5.5)
-- round up 3.14 to 3.2
ceil(3.14, 1)
```
