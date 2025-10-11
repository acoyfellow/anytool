---
title: SQL Reference · Cloudflare Analytics docs
description: "Usage:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/conditional-functions/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/conditional-functions/index.md
---

## if

Usage:

```sql
if(<condition>, <true_expression>, <false_expression>)
```

Returns `<true_expression>` if `<condition>` evaluates to true, else returns `<false_expression>`.

Example:

```sql
if(temp > 20, 'It is warm', 'Bring a jumper')
```
