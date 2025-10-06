---
title: Workers Analytics Engine SQL Reference · Cloudflare Analytics docs
description: SHOW TABLES can be used to list the tables on your account. The
  table name is the name you specified as dataset when configuring the workers
  binding (refer to Get started with Workers Analytics Engine, for more
  information). The table is automatically created when you write event data in
  your worker.
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/statements/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/statements/index.md
---

## SHOW TABLES statement

`SHOW TABLES` can be used to list the tables on your account. The table name is the name you specified as `dataset` when configuring the workers binding (refer to [Get started with Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/get-started/), for more information). The table is automatically created when you write event data in your worker.

```sql
SHOW TABLES
[FORMAT <format>]
```

Refer to [FORMAT clause](#format-clause) for the available `FORMAT` options.

## SHOW TIMEZONES statement

`SHOW TIMEZONES` can be used to list all of the timezones supported by the SQL API. Most common timezones are supported.

```sql
SHOW TIMEZONES
[FORMAT <format>]
```

## SHOW TIMEZONE statement

`SHOW TIMEZONE` responds with the current default timezone in use by SQL API. This should always be `Etc/UTC`.

```sql
SHOW TIMEZONE
[FORMAT <format>]
```

## SELECT statement

`SELECT` is used to query tables.

Usage:

```sql
SELECT <expression_list>
[FROM <table>|(<subquery>)]
[WHERE <expression>]
[GROUP BY <expression>, ...]
[ORDER BY <expression_list>]
[LIMIT <n>|ALL]
[FORMAT <format>]
```

Below you can find the syntax of each clause. Refer to the [SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/) documentation for some example queries.

### SELECT clause

The `SELECT` clause specifies the list of columns to be included in the result. Columns can be aliased using the `AS` keyword.

Usage:

```sql
SELECT <expression> [AS <alias>], ...
```

Examples:

```sql
-- return the named columns
SELECT blob2, double3


-- return all columns
SELECT *


-- alias columns to more descriptive names
SELECT
    blob2 AS probe_name,
    double3 AS temperature
```

Additionally, expressions using supported functions and [operators](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/) can be used in place of column names:

```sql
SELECT
    blob2 AS probe_name,
    double3 AS temp_c,
    double3*1.8+32 AS temp_f -- compute a value


SELECT
    blob2 AS probe_name,
    if(double3 <= 0, 'FREEZING', 'NOT FREEZING') AS description -- use of functions


SELECT
    blob2 AS probe_name,
    avg(double3) AS avg_temp -- aggregation function
```

### FROM clause

`FROM` is used to specify the source of the data for the query.

Usage:

```sql
FROM <table_name>|(subquery)
```

Examples:

```sql
-- query data written to a workers dataset called "temperatures"
FROM temperatures


-- use a subquery to manipulate the table
FROM (
    SELECT
        blob1 AS probe_name,
        count() as num_readings
    FROM
        temperatures
    GROUP BY
        probe_name
)
```

Note that queries can only operate on a single table. `UNION`, `JOIN` etc. are not currently supported.

### WHERE clause

`WHERE` is used to filter the rows returned by a query.

Usage:

```sql
WHERE <condition>
```

`<condition>` can be any expression that evaluates to a boolean.

[Comparison operators](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/#comparison-operators) can be used to compare values and [boolean operators](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/#boolean-operators) can be used to combine conditions.

Expressions containing functions and [operators](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/operators/#supported-operators) are supported.

Examples:

```sql
-- simple comparisons
WHERE blob1 = 'test'
WHERE double1 = 4


-- inequalities
WHERE double1 > 4


-- use of operators (see below for supported operator list)
WHERE double1 + double2 > 4
WHERE blob1 = 'test1' OR blob2 = 'test2'


-- expression using inequalities, functions and operators
WHERE if(unit = 'f', (temp-32)/1.8, temp) <= 0
```

### GROUP BY clause

When using aggregate functions, `GROUP BY` specifies the groups over which the aggregation is run.

Usage:

```sql
GROUP BY <expression>, ...
```

For example, if you had a table of temperature readings:

```sql
-- return the average temperature for each probe
SELECT
    blob1 AS probe_name,
    avg(double1) AS average_temp
FROM temperature_readings
GROUP BY probe_name
```

In the usual case the `<expression>` can just be a column name but it is also possible to supply a complex expression here. Multiple expressions or column names can be supplied separated by commas.

### ORDER BY clause

`ORDER BY` can be used to control the order in which rows are returned.

Usage:

```sql
ORDER BY <expression> [ASC|DESC], ...
```

`<expression>` can just be a column name.

`ASC` or `DESC` determines if the ordering is ascending or descending. `ASC` is the default, and can be omitted.

Examples:

```sql
-- order by double2 then double3, both in ascending order
ORDER BY double2, double3


-- order by double2 in ascending order then double3 is descending order
ORDER BY double2, double3 DESC
```

### LIMIT clause

`LIMIT` specifies a maximum number of rows to return.

Usage:

```sql
LIMIT <n>|ALL
```

Supply the maximum number of rows to return or `ALL` for no restriction.

For example:

```sql
LIMIT 10 -- return at most 10 rows
```

### OFFSET clause

`OFFSET` specifies a number of rows to skip in the query result.

Usage:

```sql
OFFSET <n>
```

For example:

```sql
OFFSET 10 -- skip the first 10 result rows
```

### FORMAT clause

`FORMAT` controls how to the returned data is encoded.

Usage:

```sql
FORMAT [JSON|JSONEachRow|TabSeparated]
```

If no format clause is included then the default format of `JSON` will be used.

Override the default by setting a format. For example:

```sql
FORMAT JSONEachRow
```

The following formats are supported:

#### JSON

Data is returned as a single JSON object with schema data included:

```json
{
    "meta": [
        {
            "name": "<column 1 name>",
            "type": "<column 1 type>"
        },
        {
            "name": "<column 2 name>",
            "type": "<column 2 type>"
        },
        ...
    ],
    "data": [
        {
            "<column 1 name>": "<column 1 value>",
            "<column 2 name>": "<column 2 value>",
            ...
        },
        {
            "<column 1 name>": "<column 1 value>",
            "<column 2 name>": "<column 2 value>",
            ...
        },
        ...
    ],
    "rows": 10
}
```

#### JSONEachRow

Data is returned with a separate JSON object per row. Rows are newline separated and there is no header line or schema data:

```json
{"<column 1 name>": "<column 1 value>", "<column 2 name>": "<column 2 value>"}
{"<column 1 name>": "<column 1 value>", "<column 2 name>": "<column 2 value>"}
...
```

#### TabSeparated

Data is returned with newline separated rows. Columns are separated with tabs. There is no header.

```txt
column 1 value  column 2 value
column 1 value  column 2 value
...
```
