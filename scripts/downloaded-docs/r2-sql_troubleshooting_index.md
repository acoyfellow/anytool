---
title: Troubleshooting guide · R2 SQL docs
description: This guide covers potential errors and limitations you may
  encounter when using R2 SQL. R2 SQL is in open beta, and supported
  functionality will evolve and change over time.
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
tags: SQL
source_url:
  html: https://developers.cloudflare.com/r2-sql/troubleshooting/
  md: https://developers.cloudflare.com/r2-sql/troubleshooting/index.md
---

This guide covers potential errors and limitations you may encounter when using R2 SQL. R2 SQL is in open beta, and supported functionality will evolve and change over time.

## Query Structure Errors

### Missing Required Clauses

**Error**: `expected exactly 1 table in FROM clause`

**Problem**: R2 SQL requires specific clauses in your query.

```sql
-- Invalid - Missing FROM clause
SELECT user_id WHERE status = 200;


-- Valid
SELECT user_id
FROM http_requests
WHERE status = 200 AND timestamp BETWEEN '2025-09-24T01:00:00Z' AND '2025-09-25T01:00:00Z';
```

**Solution**: Always include `FROM` in your queries.

***

## SELECT Clause Issues

### Unsupported SQL Functions

**Error**: `Function not supported`

**Problem**: Cannot use aggregate or SQL functions in SELECT.

```sql
-- Invalid - Aggregate functions not supported
SELECT COUNT(*) FROM events WHERE timestamp > '2025-09-24T01:00:00Z'
SELECT AVG(response_time) FROM http_requests WHERE status = 200
SELECT MAX(timestamp) FROM logs WHERE user_id = '123'
```

**Solution**: Use basic column selection, and handle aggregation in your application code.

### JSON Field Access

**Error**: `Cannot access nested fields`

**Problem**: Cannot query individual fields from JSON objects.

```sql
-- Invalid - JSON field access not supported
SELECT metadata.user_id FROM events
SELECT json_field->>'property' FROM logs


-- Valid - Select entire JSON field
SELECT metadata FROM events
SELECT json_field FROM logs
```

**Solution**: Select the entire JSON column and parse it in your application.

### Synthetic Data

**Error**: `aliases (AS) are not supported`

**Problem**: Cannot create synthetic columns with literal values.

```sql
-- Invalid - Synthetic data not supported
SELECT user_id, 'active' as status, 1 as priority FROM users


-- Valid
SELECT user_id, status, priority FROM users WHERE status = 'active'
```

**Solution**: Add the required data to your table schema, or handle it in post-processing.

***

## FROM Clause Issues

### Multiple Tables

**Error**: `Multiple tables not supported` or `JOIN operations not allowed`

**Problem**: Cannot query multiple tables or use JOINs.

```sql
-- Invalid - Multiple tables not supported
SELECT a.*, b.* FROM table1 a, table2 b WHERE a.id = b.id
SELECT * FROM events JOIN users ON events.user_id = users.id


-- Valid - Separate queries
SELECT * FROM table1 WHERE id IN ('id1', 'id2', 'id3')
-- Then in application code, query table2 separately
SELECT * FROM table2 WHERE id IN ('id1', 'id2', 'id3')
```

**Solution**:

* Denormalize your data by including necessary fields in a single table.
* Perform multiple queries and join data in your application.

### Subqueries

**Error**: `only table name is supported in FROM clause`

**Problem**: Cannot use subqueries in FROM clause.

```sql
-- Invalid - Subqueries not supported
SELECT * FROM (SELECT user_id FROM events WHERE status = 200) as active_users


-- Valid - Use direct query with appropriate filters
SELECT user_id FROM events WHERE status = 200
```

**Solution**: Flatten your query logic or use multiple sequential queries.

***

## WHERE Clause Issues

### Array Filtering

**Error**: `This feature is not implemented: GetFieldAccess`

**Problem**: Cannot filter on array fields.

```sql
-- Invalid - Array filtering not supported
SELECT * FROM logs WHERE tags[0] = 'error'
SELECT * FROM events WHERE 'admin' = ANY(roles)


-- Valid alternatives - denormalize or use string contains
SELECT * FROM logs WHERE tags_string LIKE '%error%'
-- Or restructure data to avoid arrays
```

**Solution**:

* Denormalize array data into separate columns.
* Use string concatenation of array values for pattern matching.
* Restructure your schema to avoid array types.

### JSON Object Filtering

**Error**: `unsupported binary operator` or `Error during planning: could not parse compound`

**Problem**: Cannot filter on fields inside JSON objects.

```sql
-- Invalid - JSON field filtering not supported
SELECT * FROM requests WHERE metadata.country = 'US'
SELECT * FROM logs WHERE json_data->>'level' = 'error'


-- Valid alternatives
SELECT * FROM requests WHERE country = 'US'  -- If denormalized
-- Or filter entire JSON field and parse in application
SELECT * FROM logs WHERE json_data IS NOT NULL
```

**Solution**:

* Denormalize frequently queried JSON fields into separate columns.
* Filter on the entire JSON field, and handle parsing in your application.

### Column Comparisons

**Error**: `right argument to a binary expression must be a literal`

**Problem**: Cannot compare one column to another in WHERE clause.

```sql
-- Invalid - Column comparisons not supported
SELECT * FROM events WHERE start_time < end_time
SELECT * FROM logs WHERE request_size > response_size


-- Valid - Use computed columns or application logic
-- Add a computed column 'duration' to your schema
SELECT * FROM events WHERE duration > 0
```

**Solution**: Handle comparisons in your application layer.

***

## LIMIT Clause Issues

### Invalid Limit Values

**Error**: `maximum LIMIT is 10000`

**Problem**: Cannot use invalid LIMIT values.

```sql
-- Invalid - Out of range limits
SELECT * FROM events LIMIT 50000  -- Maximum is 10,000


-- Valid
SELECT * FROM events LIMIT 1
SELECT * FROM events LIMIT 10000
```

**Solution**: Use LIMIT values between 1 and 10,000.

### Pagination Attempts

**Error**: `OFFSET not supported`

**Problem**: Cannot use pagination syntax.

```sql
-- Invalid - Pagination not supported
SELECT * FROM events LIMIT 100 OFFSET 200
SELECT * FROM events LIMIT 100, 100


-- Valid alternatives - Use ORDER BY with conditional filters
-- Page 1
SELECT * FROM events WHERE timestamp >= '2024-01-01' ORDER BY timestamp LIMIT 100


-- Page 2 - Use last timestamp from previous page
SELECT * FROM events WHERE timestamp > '2024-01-01T10:30:00Z' ORDER BY timestamp LIMIT 100
```

**Solution**: Implement cursor-based pagination using ORDER BY and WHERE conditions.

***

## Schema Issues

### Dynamic Schema Changes

**Error**: `invalid SQL: only top-level SELECT clause is supported`

**Problem**: Cannot modify table schema or reference non-existent columns.

```sql
-- Invalid - Schema changes not supported
ALTER TABLE events ADD COLUMN new_field STRING
UPDATE events SET status = 200 WHERE user_id = '123'
```

**Solution**:

* Plan your schema carefully before data ingestion.
* Ensure all column names exist in your current schema.

***

## Performance Optimization

### Query Performance Issues

If your queries are running slowly:

1. **Always include partition (timestamp) filters**: This is the most important optimization.

   ```sql
   -- Good
   WHERE timestamp BETWEEN '2024-01-01' AND '2024-01-02'
   ```

2. **Use selective filtering**: Include specific conditions to reduce result sets.

   ```sql
   -- Good
   WHERE status = 200 AND country = 'US' AND timestamp > '2024-01-01'
   ```

3. **Limit result size**: Use appropriate LIMIT values.

   ```sql
   -- Good for exploration
   SELECT * FROM events WHERE timestamp > '2024-01-01' LIMIT 100
   ```
