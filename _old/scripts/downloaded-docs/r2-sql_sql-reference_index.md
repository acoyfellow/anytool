---
title: SQL reference · R2 SQL docs
description: Comprehensive reference for SQL syntax and data types supported in R2 SQL.
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
tags: SQL
source_url:
  html: https://developers.cloudflare.com/r2-sql/sql-reference/
  md: https://developers.cloudflare.com/r2-sql/sql-reference/index.md
---

Note

R2 SQL is in public beta. Supported SQL grammar may change over time.

This page documents the R2 SQL syntax based on the currently supported grammar in public beta.

***

## Complete Query Syntax

```sql
SELECT column_list
FROM table_name
WHERE conditions --optional
[ORDER BY column_name [DESC | ASC]]
[LIMIT number]
```

***

## SELECT Clause

### Syntax

```sql
SELECT column_specification [, column_specification, ...]
```

### Column Specification

* **Column name**: `column_name`
* **All columns**: `*`

### Examples

```sql
SELECT * FROM table_name
SELECT user_id FROM table_name
SELECT user_id, timestamp, status FROM table_name
SELECT timestamp, user_id, response_code FROM table_name
```

***

## FROM Clause

### Syntax

```sql
SELECT * FROM table_name
```

***

## WHERE Clause

### Syntax

```sql
SELECT * WHERE condition [AND|OR condition ...]
```

### Conditions

#### Null Checks

* `column_name IS NULL`
* `column_name IS NOT NULL`

#### Value Comparisons

* `column_name BETWEEN value' AND 'value`
* `column_name = value`
* `column_name >= value`
* `column_name > value`
* `column_name <= value`
* `column_name < value`
* `column_name != value`
* `column_name LIKE 'value%'`

#### Logical Operators

* `AND` - Logical AND
* `OR` - Logical OR

### Data Types

* **integer** - Whole numbers
* **float** - Decimal numbers
* **string** - Text values (quoted)
* **timestamp** - RFC3339 format (`'YYYY-DD-MMT-HH:MM:SSZ'`)
* **date** - Date32/Data64 expressed as a string (`'YYYY-MM-DD'`)
* **boolean** - Explicitly valued (true, false)

### Examples

```sql
SELECT * FROM table_name WHERE timestamp BETWEEN '2025-09-24T01:00:00Z' AND '2025-09-25T01:00:00Z'
SELECT * FROM table_name WHERE status = 200
SELECT * FROM table_name WHERE response_time > 1000
SELECT * FROM table_name WHERE user_id IS NOT NULL
SELECT * FROM table_name WHERE method = 'GET' AND status >= 200 AND status < 300
SELECT * FROM table_name WHERE (status = 404 OR status = 500) AND timestamp > '2024-01-01'
```

***

## ORDER BY Clause

### Syntax

```sql
--Note: ORDER BY only supports ordering by the partition key
ORDER BY partition_key [DESC]
```

* **ASC**: Ascending order
* **DESC**: Descending order
* **Default**: DESC on all columns of the partition key
* Can contain any columns from the partition key

### Examples

```sql
SELECT * FROM table_name WHERE ... ORDER BY paetition_key_A
SELECT * FROM table_name WHERE ... ORDER BY partition_key_B DESC
SELECT * FROM table_name WHERE ... ORDER BY partitionKey_A ASC
```

***

## LIMIT Clause

### Syntax

```sql
LIMIT number
```

* **Range**: 1 to 10,000
* **Type**: Integer only
* **Default**: 500

### Examples

```sql
SELECT * FROM table_name WHERE ... LIMIT 100
```

***

## Complete Query Examples

### Basic Query

```sql
SELECT *
FROM http_requests
WHERE timestamp BETWEEN '2025-09-24T01:00:00Z' AND '2025-09-25T01:00:00Z'
LIMIT 100
```

### Filtered Query with Sorting

```sql
SELECT user_id, timestamp, status, response_time
FROM access_logs
WHERE status >= 400 AND response_time > 5000
ORDER BY response_time DESC
LIMIT 50
```

### Complex Conditions

```sql
SELECT timestamp, method, status, user_agent
FROM http_requests
WHERE (method = 'POST' OR method = 'PUT')
  AND status BETWEEN 200 AND 299
  AND user_agent IS NOT NULL
ORDER BY timestamp DESC
LIMIT 1000
```

### Null Handling

```sql
SELECT user_id, session_id, date_column
FROM user_events
WHERE session_id IS NOT NULL
  AND date_column >= '2024-01-01'
ORDER BY timestamp
LIMIT 500
```

***

## Data Type Reference

### Supported Types

| Type | Description | Example Values |
| - | - | - |
| `integer` | Whole numbers | `1`, `42`, `-10`, `0` |
| `float` | Decimal numbers | `1.5`, `3.14`, `-2.7`, `0.0` |
| `string` | Text values | `'hello'`, `'GET'`, `'2024-01-01'` |
| `boolean` | Boolean values | `true`, `false` |
| `timestamp` | RFC3339 | `'2025-09-24T01:00:00Z'` |
| `date` | 'YYYY-MM-DD' | `'2025-09-24'` |

### Type Usage in Conditions

```sql
-- Integer comparisons
SELECT * FROM table_name WHERE status = 200
SELECT * FROM table_name WHERE response_time > 1000


-- Float comparisons
SELECT * FROM table_name WHERE cpu_usage >= 85.5
SELECT * FROM table_name WHERE memory_ratio < 0.8


-- String comparisons
SELECT * FROM table_name WHERE method = 'POST'
SELECT * FROM table_name WHERE user_agent != 'bot'
SELECT * FROM table_name WHERE country_code = 'US'
```

***

## Operator Precedence

1. **Comparison operators**: `=`, `!=`, `<`, `<=`, `>`, `>=`, `LIKE`, `BETWEEN`, `IS NULL`, `IS NOT NULL`
2. **AND** (higher precedence)
3. **OR** (lower precedence)

Use parentheses to override default precedence:

```sql
SELECT * FROM table_name WHERE (status = 404 OR status = 500) AND method = 'GET'
```

***
