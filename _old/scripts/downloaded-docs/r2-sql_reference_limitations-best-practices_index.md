---
title: Limitations and best practices · R2 SQL docs
description: R2 SQL is designed for querying partitioned Apache Iceberg tables
  in your R2 data catalog. This document outlines the supported features,
  limitations, and best practices of R2 SQL.
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
tags: SQL
source_url:
  html: https://developers.cloudflare.com/r2-sql/reference/limitations-best-practices/
  md: https://developers.cloudflare.com/r2-sql/reference/limitations-best-practices/index.md
---

Note

R2 SQL is in open beta. Limitations and best practices will change over time.

R2 SQL is designed for querying **partitioned** Apache Iceberg tables in your R2 data catalog. This document outlines the supported features, limitations, and best practices of R2 SQL.

## Quick Reference

| Feature | Supported | Notes |
| - | - | - |
| Basic SELECT | Yes | Columns, \* |
| Aggregation functions | No | No COUNT, AVG, etc. |
| Single table FROM | Yes | Note, aliasing not supported |
| WHERE clause | Yes | Filters, comparisons, equality, etc |
| JOINs | No | No table joins |
| Array filtering | No | No array type support |
| JSON filtering | No | No nested object queries |
| Simple LIMIT | Yes | 1-10,000 range, no pagination support |
| ORDER BY | Yes | Any columns of the partition key only |
| GROUP BY | No | Not supported |

## Supported SQL Clauses

R2 SQL supports a limited set of SQL clauses: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, and `LIMIT`. All other SQL clauses are not supported at the moment. New features will be released in the future, keep an eye on this page for the latest.

***

## SELECT Clause

### Supported Features

* **Individual columns**: `SELECT column1, column2`
* **All columns**: `SELECT *`

### Limitations

* **No JSON field querying**: Cannot query individual fields from JSON objects
* **No SQL functions**: Functions like `AVG()`, `COUNT()`, `MAX()`, `MIN()`, quantiles are not supported
* **No synthetic data**: Cannot create synthetic columns like `SELECT 1 AS what, "hello" AS greeting`
* **No field aliasing**: `SELECT field AS another_name`

### Examples

```sql
-- Valid
SELECT timestamp, user_id, status FROM my_table;
SELECT * FROM my_table;


-- Invalid
SELECT user_id AS uid, timestamp AS ts FROM my_table;
SELECT COUNT(*) FROM events FROM FROM my_table;
SELECT json_field.property FROM my_table;
SELECT 1 AS synthetic_column FROM my_table;
```

***

## FROM Clause

### Supported Features

* **Single table queries**: `SELECT * FROM table_name`

### Limitations

* **No multiple tables**: Cannot specify multiple tables in FROM clause
* **No subqueries**: `SELECT ... FROM (SELECT ...)` is not supported
* **No JOINs**: No INNER, LEFT, RIGHT, or FULL JOINs
* **No SQL functions**: Cannot use functions like `read_parquet()`
* **No synthetic tables**: Cannot create tables from values
* **No schema evolution**: Schema cannot be altered (no ALTER TABLE, migrations)
* **Immutable datasets**: No UPDATE or DELETE operations allowed
* **Fully defined schema**: Dynamic or union-type fields are not supported
* **No table aliasing**: `SELECT * FROM table_name AS alias`

### Examples

```sql
--Valid
SELECT * FROM http_requests


--Invalid
SELECT * FROM table1, table2
SELECT * FROM table1 JOIN table2 ON table1.id = table2.id
SELECT * FROM (SELECT * FROM events WHERE status = 200)
```

***

## WHERE Clause

### Supported Features

* **Simple type filtering**: Supports `string`, `boolean`, `number` types, and timestamps expressed as RFC3339
* **Boolean logic**: Supports `AND`, `OR`, `NOT` operators
* **Comparison operators**: `>`, `>=`, `=`, `<`, `<=`, `!=`
* **Grouped conditions**: `WHERE col_a="hello" AND (col_b>5 OR col_c != 3)`
* **Pattern matching:** `WHERE col_a LIKE ‘hello w%’` (prefix matching only)
* **NULL Handling :** `WHERE col_a IS NOT NULL` (`IS`/`IS NOT`)

### Limitations

* **No column-to-column comparisons**: Cannot use `WHERE col_a = col_b`
* **No array filtering**: Cannot filter on array types (array\[number], array\[string], array\[boolean])
* **No JSON/object filtering**: Cannot filter on fields inside nested objects or JSON
* **No SQL functions**: No function calls in WHERE clause
* **No arithmetic operators**: Cannot use `+`, `-`, `*`, `/` in conditions

### Examples

```sql
--Valid
SELECT * FROM events WHERE timestamp BETWEEN '2024-01-01' AND '2024-01-02'
SELECT * FROM logs WHERE status = 200 AND user_type = 'premium'
SELECT * FROM requests WHERE (method = 'GET' OR method = 'POST') AND response_time < 1000


--Invalid
SELECT * FROM logs WHERE tags[0] = 'error' -- Array filtering
SELECT * FROM requests WHERE metadata.user_id = '123' -- JSON field filtering
SELECT * FROM events WHERE col_a = col_b -- Column comparison
SELECT * FROM logs WHERE response_time + latency > 5000 -- Arithmetic
```

***

## ORDER BY Clause

### Supported Features

* **ASC**: Ascending order
* **DESC**: Descending order (Default, on full partition key)

### Limitations

* **Non-partition keys not supported**: `ORDER BY` on columns other than the partition key is not supported

### Examples

```sql
SELECT * FROM table_name WHERE ... ORDER BY partitionKey
SELECT * FROM table_name WHERE ... ORDER BY partitionKey DESC
```

***

## LIMIT Clause

### Supported Features

* **Simple limits**: `LIMIT number`
* **Range**: Minimum 1, maximum 10,000

### Limitations

* **No pagination**: `LIMIT offset, count` syntax not supported
* **No SQL functions**: Cannot use functions to determine limit
* **No arithmetic**: Cannot use expressions like `LIMIT 10 * 50`

### Examples

```sql
-- Valid
SELECT * FROM events LIMIT 100
SELECT * FROM logs WHERE ... LIMIT 10000


-- Invalid
SELECT * FROM events LIMIT 100, 50 -- Pagination
SELECT * FROM logs LIMIT COUNT(*) / 2 -- Functions
SELECT * FROM events LIMIT 10 * 10 -- Arithmetic
```

***

## Unsupported SQL Clauses

The following SQL clauses are **not supported**:

* `GROUP BY`
* `HAVING`
* `UNION`/`INTERSECT`/`EXCEPT`
* `WITH` (Common Table Expressions)
* `WINDOW` functions
* `INSERT`/`UPDATE`/`DELETE`
* `CREATE`/`ALTER`/`DROP`

***

## Best Practices

1. Always include time filters in your WHERE clause to ensure efficient queries.
2. Use specific column selection instead of `SELECT *` when possible for better performance.
3. Structure your data to avoid nested JSON objects if you need to filter on those fields.

***
