---
title: Workers Analytics Engine SQL Reference · Cloudflare Analytics docs
description: "The following operators are supported:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/index.md
---

The following operators are supported:

## Arithmetic operators

| Operator | Description |
| - | - |
| `+` | addition |
| `-` | subtraction |
| `*` | multiplication |
| `/` | division |
| `%` | modulus |

## Comparison operators

| Operator | Description |
| - | - |
| `=` | equals |
| `<` | less than |
| `>` | greater than |
| `<=` | less than or equal to |
| `>=` | greater than or equal to |
| `<>` or `!=` | not equal |
| `IN` | true if the preceding expression's value is in the list `column IN ('a', 'list', 'of', 'values')` |
| `NOT IN` | true if the preceding expression's value is not in the list `column NOT IN ('a', 'list', 'of', 'values')` |

We also support the `BETWEEN` operator for checking a value is in an inclusive range: `a [NOT] BETWEEN b AND c`.

## Boolean operators

| Operator | Description |
| - | - |
| `AND` | boolean "AND" (true if both sides are true) |
| `OR` | boolean "OR" (true if either side or both sides are true) |
| `NOT` | boolean "NOT" (true if following expression is false and visa-versa) |

## Unary operators

| Operator | Description |
| - | - |
| `-` | negation operator (for example, `-42`) |
