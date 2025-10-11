---
title: Time and date functions · Cloudflare Pipelines Docs
description: Scalar functions for handling times and dates
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/time-and-date/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/time-and-date/index.md
---

*Cloudflare Pipelines scalar function implementations are based on [Apache DataFusion](https://arrow.apache.org/datafusion/) (via [Arroyo](https://www.arroyo.dev/)) and these docs are derived from the DataFusion function reference.*

## `date_bin`

Calculates time intervals and returns the start of the interval nearest to the specified timestamp. Use `date_bin` to downsample time series data by grouping rows into time-based "bins" or "windows" and applying an aggregate or selector function to each window.

For example, if you "bin" or "window" data into 15 minute intervals, an input timestamp of `2023-01-01T18:18:18Z` will be updated to the start time of the 15 minute bin it is in: `2023-01-01T18:15:00Z`.

```plaintext
date_bin(interval, expression, origin-timestamp)
```

**Arguments**

* **interval**: Bin interval.
* **expression**: Time expression to operate on. Can be a constant, column, or function.
* **origin-timestamp**: Optional. Starting point used to determine bin boundaries. If not specified defaults `1970-01-01T00:00:00Z` (the UNIX epoch in UTC).

The following intervals are supported:

* nanoseconds
* microseconds
* milliseconds
* seconds
* minutes
* hours
* days
* weeks
* months
* years
* century

## `date_trunc`

Truncates a timestamp value to a specified precision.

```plaintext
date_trunc(precision, expression)
```

**Arguments**

* **precision**: Time precision to truncate to. The following precisions are supported:

  * year / YEAR
  * quarter / QUARTER
  * month / MONTH
  * week / WEEK
  * day / DAY
  * hour / HOUR
  * minute / MINUTE
  * second / SECOND

* **expression**: Time expression to operate on. Can be a constant, column, or function.

**Aliases**

* datetrunc

## `datetrunc`

*Alias of [date\_trunc](#date_trunc).*

## `date_part`

Returns the specified part of the date as an integer.

```plaintext
date_part(part, expression)
```

**Arguments**

* **part**: Part of the date to return. The following date parts are supported:

  * year
  * quarter *(emits value in inclusive range \[1, 4] based on which quartile of the year the date is in)*
  * month
  * week *(week of the year)*
  * day *(day of the month)*
  * hour
  * minute
  * second
  * millisecond
  * microsecond
  * nanosecond
  * dow *(day of the week)*
  * doy *(day of the year)*
  * epoch *(seconds since Unix epoch)*

* **expression**: Time expression to operate on. Can be a constant, column, or function.

**Aliases**

* datepart

## `datepart`

*Alias of [date\_part](#date_part).*

## `extract`

Returns a sub-field from a time value as an integer.

```plaintext
extract(field FROM source)
```

Equivalent to calling `date_part('field', source)`. For example, these are equivalent:

```sql
extract(day FROM '2024-04-13'::date)
date_part('day', '2024-04-13'::date)
```

See [date\_part](#date_part).

## `make_date`

Make a date from year/month/day component parts.

```plaintext
make_date(year, month, day)
```

**Arguments**

* **year**: Year to use when making the date. Can be a constant, column or function, and any combination of arithmetic operators.
* **month**: Month to use when making the date. Can be a constant, column or function, and any combination of arithmetic operators.
* **day**: Day to use when making the date. Can be a constant, column or function, and any combination of arithmetic operators.

**Example**

```plaintext
> select make_date(2023, 1, 31);
+-------------------------------------------+
| make_date(Int64(2023),Int64(1),Int64(31)) |
+-------------------------------------------+
| 2023-01-31                                |
+-------------------------------------------+
> select make_date('2023', '01', '31');
+-----------------------------------------------+
| make_date(Utf8("2023"),Utf8("01"),Utf8("31")) |
+-----------------------------------------------+
| 2023-01-31                                    |
+-----------------------------------------------+
```

## `to_char`

Returns a string representation of a date, time, timestamp or duration based on a [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html). Unlike the PostgreSQL equivalent of this function numerical formatting is not supported.

```plaintext
to_char(expression, format)
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function that results in a date, time, timestamp or duration.
* **format**: A [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) string to use to convert the expression.

**Example**

```plaintext
> > select to_char('2023-03-01'::date, '%d-%m-%Y');
+----------------------------------------------+
| to_char(Utf8("2023-03-01"),Utf8("%d-%m-%Y")) |
+----------------------------------------------+
| 01-03-2023                                   |
+----------------------------------------------+
```

**Aliases**

* date\_format

## `to_timestamp`

Converts a value to a timestamp (`YYYY-MM-DDT00:00:00Z`). Supports strings, integer, unsigned integer, and double types as input. Strings are parsed as RFC3339 (e.g. '2023-07-20T05:44:00') if no \[Chrono formats] are provided. Integers, unsigned integers, and doubles are interpreted as seconds since the unix epoch (`1970-01-01T00:00:00Z`). Returns the corresponding timestamp.

Note: `to_timestamp` returns `Timestamp(Nanosecond)`. The supported range for integer input is between `-9223372037` and `9223372036`. Supported range for string input is between `1677-09-21T00:12:44.0` and `2262-04-11T23:47:16.0`. Please use `to_timestamp_seconds` for the input outside of supported bounds.

```plaintext
to_timestamp(expression[, ..., format_n])
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **format\_n**: Optional [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) strings to use to parse the expression. Formats will be tried in the order they appear with the first successful one being returned. If none of the formats successfully parse the expression an error will be returned.

**Example**

```plaintext
> select to_timestamp('2023-01-31T09:26:56.123456789-05:00');
+-----------------------------------------------------------+
| to_timestamp(Utf8("2023-01-31T09:26:56.123456789-05:00")) |
+-----------------------------------------------------------+
| 2023-01-31T14:26:56.123456789                             |
+-----------------------------------------------------------+
> select to_timestamp('03:59:00.123456789 05-17-2023', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y');
+--------------------------------------------------------------------------------------------------------+
| to_timestamp(Utf8("03:59:00.123456789 05-17-2023"),Utf8("%c"),Utf8("%+"),Utf8("%H:%M:%S%.f %m-%d-%Y")) |
+--------------------------------------------------------------------------------------------------------+
| 2023-05-17T03:59:00.123456789                                                                          |
+--------------------------------------------------------------------------------------------------------+
```

## `to_timestamp_millis`

Converts a value to a timestamp (`YYYY-MM-DDT00:00:00.000Z`). Supports strings, integer, and unsigned integer types as input. Strings are parsed as RFC3339 (e.g. '2023-07-20T05:44:00') if no [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)s are provided. Integers and unsigned integers are interpreted as milliseconds since the unix epoch (`1970-01-01T00:00:00Z`). Returns the corresponding timestamp.

```plaintext
to_timestamp_millis(expression[, ..., format_n])
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **format\_n**: Optional [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) strings to use to parse the expression. Formats will be tried in the order they appear with the first successful one being returned. If none of the formats successfully parse the expression an error will be returned.

**Example**

```plaintext
> select to_timestamp_millis('2023-01-31T09:26:56.123456789-05:00');
+------------------------------------------------------------------+
| to_timestamp_millis(Utf8("2023-01-31T09:26:56.123456789-05:00")) |
+------------------------------------------------------------------+
| 2023-01-31T14:26:56.123                                          |
+------------------------------------------------------------------+
> select to_timestamp_millis('03:59:00.123456789 05-17-2023', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y');
+---------------------------------------------------------------------------------------------------------------+
| to_timestamp_millis(Utf8("03:59:00.123456789 05-17-2023"),Utf8("%c"),Utf8("%+"),Utf8("%H:%M:%S%.f %m-%d-%Y")) |
+---------------------------------------------------------------------------------------------------------------+
| 2023-05-17T03:59:00.123                                                                                       |
+---------------------------------------------------------------------------------------------------------------+
```

## `to_timestamp_micros`

Converts a value to a timestamp (`YYYY-MM-DDT00:00:00.000000Z`). Supports strings, integer, and unsigned integer types as input. Strings are parsed as RFC3339 (e.g. '2023-07-20T05:44:00') if no [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)s are provided. Integers and unsigned integers are interpreted as microseconds since the unix epoch (`1970-01-01T00:00:00Z`) Returns the corresponding timestamp.

```plaintext
to_timestamp_micros(expression[, ..., format_n])
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **format\_n**: Optional [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) strings to use to parse the expression. Formats will be tried in the order they appear with the first successful one being returned. If none of the formats successfully parse the expression an error will be returned.

**Example**

```plaintext
> select to_timestamp_micros('2023-01-31T09:26:56.123456789-05:00');
+------------------------------------------------------------------+
| to_timestamp_micros(Utf8("2023-01-31T09:26:56.123456789-05:00")) |
+------------------------------------------------------------------+
| 2023-01-31T14:26:56.123456                                       |
+------------------------------------------------------------------+
> select to_timestamp_micros('03:59:00.123456789 05-17-2023', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y');
+---------------------------------------------------------------------------------------------------------------+
| to_timestamp_micros(Utf8("03:59:00.123456789 05-17-2023"),Utf8("%c"),Utf8("%+"),Utf8("%H:%M:%S%.f %m-%d-%Y")) |
+---------------------------------------------------------------------------------------------------------------+
| 2023-05-17T03:59:00.123456                                                                                    |
+---------------------------------------------------------------------------------------------------------------+
```

## `to_timestamp_nanos`

Converts a value to a timestamp (`YYYY-MM-DDT00:00:00.000000000Z`). Supports strings, integer, and unsigned integer types as input. Strings are parsed as RFC3339 (e.g. '2023-07-20T05:44:00') if no \[Chrono formats] are provided. Integers and unsigned integers are interpreted as nanoseconds since the unix epoch (`1970-01-01T00:00:00Z`). Returns the corresponding timestamp.

```plaintext
to_timestamp_nanos(expression[, ..., format_n])
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **format\_n**: Optional [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) strings to use to parse the expression. Formats will be tried in the order they appear with the first successful one being returned. If none of the formats successfully parse the expression an error will be returned.

**Example**

```plaintext
> select to_timestamp_nanos('2023-01-31T09:26:56.123456789-05:00');
+-----------------------------------------------------------------+
| to_timestamp_nanos(Utf8("2023-01-31T09:26:56.123456789-05:00")) |
+-----------------------------------------------------------------+
| 2023-01-31T14:26:56.123456789                                   |
+-----------------------------------------------------------------+
> select to_timestamp_nanos('03:59:00.123456789 05-17-2023', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y');
+--------------------------------------------------------------------------------------------------------------+
| to_timestamp_nanos(Utf8("03:59:00.123456789 05-17-2023"),Utf8("%c"),Utf8("%+"),Utf8("%H:%M:%S%.f %m-%d-%Y")) |
+--------------------------------------------------------------------------------------------------------------+
| 2023-05-17T03:59:00.123456789                                                                                |
+---------------------------------------------------------------------------------------------------------------+
```

## `to_timestamp_seconds`

Converts a value to a timestamp (`YYYY-MM-DDT00:00:00.000Z`). Supports strings, integer, and unsigned integer types as input. Strings are parsed as RFC3339 (e.g. '2023-07-20T05:44:00') if no [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)s are provided. Integers and unsigned integers are interpreted as seconds since the unix epoch (`1970-01-01T00:00:00Z`). Returns the corresponding timestamp.

```plaintext
to_timestamp_seconds(expression[, ..., format_n])
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **format\_n**: Optional [Chrono format](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) strings to use to parse the expression. Formats will be tried in the order they appear with the first successful one being returned. If none of the formats successfully parse the expression an error will be returned.

**Example**

```plaintext
> select to_timestamp_seconds('2023-01-31T09:26:56.123456789-05:00');
+-------------------------------------------------------------------+
| to_timestamp_seconds(Utf8("2023-01-31T09:26:56.123456789-05:00")) |
+-------------------------------------------------------------------+
| 2023-01-31T14:26:56                                               |
+-------------------------------------------------------------------+
> select to_timestamp_seconds('03:59:00.123456789 05-17-2023', '%c', '%+', '%H:%M:%S%.f %m-%d-%Y');
+----------------------------------------------------------------------------------------------------------------+
| to_timestamp_seconds(Utf8("03:59:00.123456789 05-17-2023"),Utf8("%c"),Utf8("%+"),Utf8("%H:%M:%S%.f %m-%d-%Y")) |
+----------------------------------------------------------------------------------------------------------------+
| 2023-05-17T03:59:00                                                                                            |
+----------------------------------------------------------------------------------------------------------------+
```

## `from_unixtime`

Converts an integer to RFC3339 timestamp format (`YYYY-MM-DDT00:00:00.000000000Z`). Integers and unsigned integers are interpreted as nanoseconds since the unix epoch (`1970-01-01T00:00:00Z`) return the corresponding timestamp.

```plaintext
from_unixtime(expression)
```

**Arguments**

* **expression**: Expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `now`

Returns the UTC timestamp at pipeline start.

The now() return value is determined at query compilation time, and will be constant across the execution of the pipeline.
