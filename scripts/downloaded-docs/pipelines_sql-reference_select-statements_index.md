---
title: SELECT statements · Cloudflare Pipelines Docs
description: Query syntax for data transformation in Cloudflare Pipelines SQL
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/select-statements/
  md: https://developers.cloudflare.com/pipelines/sql-reference/select-statements/index.md
---

SELECT statements are used to transform data in Cloudflare Pipelines. The general form is:

```sql
[WITH with_query [, ...]]
SELECT select_expr [, ...]
FROM from_item
[WHERE condition]
```

## WITH clause

The WITH clause allows you to define named subqueries that can be referenced in the main query. This can improve query readability by breaking down complex transformations.

Syntax:

```sql
WITH query_name AS (subquery) [, ...]
```

Simple example:

```sql
WITH filtered_events AS
    (SELECT user_id, event_type, amount
        FROM user_events WHERE amount > 50)
SELECT user_id, amount * 1.1 as amount_with_tax
FROM filtered_events
WHERE event_type = 'purchase';
```

## SELECT clause

The SELECT clause is a comma-separated list of expressions, with optional aliases. Column names must be unique.

```sql
SELECT select_expr [, ...]
```

Examples:

```sql
-- Select specific columns
SELECT user_id, event_type, amount FROM events


-- Use expressions and aliases
SELECT
    user_id,
    amount * 1.1 as amount_with_tax,
    UPPER(event_type) as event_type_upper
FROM events


-- Select all columns
SELECT * FROM events
```

## FROM clause

The FROM clause specifies the data source for the query. It will be either a table name or subquery. The table name can be either a stream name or a table created in the WITH clause.

```sql
FROM from_item
```

Tables can be given aliases:

```sql
SELECT e.user_id, e.amount
FROM user_events e
WHERE e.event_type = 'purchase'
```

## WHERE clause

The WHERE clause filters data using boolean conditions. Predicates are applied to input rows.

```sql
WHERE condition
```

Examples:

```sql
-- Filter by field value
SELECT * FROM events WHERE event_type = 'purchase'


-- Multiple conditions
SELECT * FROM events
WHERE event_type = 'purchase' AND amount > 50


-- String operations
SELECT * FROM events
WHERE user_id LIKE 'user_%'


-- Null checks
SELECT * FROM events
WHERE description IS NOT NULL
```

## UNNEST operator

The UNNEST operator converts arrays into multiple rows. This is useful for processing list data types.

UNNEST restrictions:

* May only appear in the SELECT clause
* Only one array may be unnested per SELECT statement

Example:

```sql
SELECT
    UNNEST([1, 2, 3]) as numbers
FROM events;
```

This will produce:

```plaintext
+---------+
| numbers |
+---------+
|       1 |
|       2 |
|       3 |
+---------+
```
