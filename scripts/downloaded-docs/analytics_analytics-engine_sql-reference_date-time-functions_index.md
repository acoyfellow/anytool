---
title: SQL Reference · Cloudflare Analytics docs
description: "Usage:"
lastUpdated: 2025-10-01T10:02:32.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/date-time-functions/
  md: https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/date-time-functions/index.md
---

## toDateTime

Usage:

```sql
toDateTime(<expression>[, 'timezone string'])
```

`toDateTime` converts an expression to a datetime. This function does not support ISO 8601-style timezones; if your time is not in UTC then you must provide the timezone using the second optional argument.

Examples:

```sql
-- double1 contains a unix timestamp in seconds
toDateTime(double1)


-- blob1 contains an datetime in the format 'YYYY-MM-DD hh:mm:ss'
toDateTime(blob1)


-- literal values:
toDateTime(355924804) -- unix timestamp
toDateTime('355924804') -- string containing unix timestamp
toDateTime('1981-04-12 12:00:04') -- string with datetime in 'YYYY-MM-DD hh:mm:ss' format


-- interpret a date relative to New York time
toDateTime('2022-12-01 16:17:00', 'America/New_York')
```

## now

Usage:

```sql
now()
```

Returns the current time as a DateTime.

## toUnixTimestamp

Usage:

```sql
toUnixTimestamp(<datetime>)
```

`toUnixTimestamp` converts a datetime into an integer unix timestamp.

Examples:

```sql
-- get the current unix timestamp
toUnixTimestamp(now())
```

## formatDateTime

Usage:

```sql
formatDateTime(<datetime expression>, <format string>[, <timezone string>])
```

`formatDateTime` prints a datetime as a string according to a provided format string. Refer to [ClickHouse's documentation](https://clickhouse.com/docs/en/sql-reference/functions/date-time-functions/#formatdatetime) for a list of supported formatting options.

Examples:

```sql
-- prints the current YYYY-MM-DD in UTC
formatDateTime(now(), '%Y-%m-%d')


-- prints YYYY-MM-DD in the datetime's timezone
formatDateTime(<a datetime with a timezone>, '%Y-%m-%d')
formatDateTime(toDateTime('2022-12-01 16:17:00', 'America/New_York'), '%Y-%m-%d')


-- prints YYYY-MM-DD in UTC
formatDateTime(<a datetime with a timezone>, '%Y-%m-%d', 'Etc/UTC')
formatDateTime(toDateTime('2022-12-01 16:17:00', 'America/New_York'), '%Y-%m-%d', 'Etc/UTC')
```

## toStartOfInterval

Usage:

```sql
toStartOfInterval(<datetime>, INTERVAL '<n>' <unit>[, <timezone string>])
```

`toStartOfInterval` rounds down a datetime to the nearest offset of a provided interval. This can be useful for grouping data into equal-sized time ranges.

Examples:

```sql
-- round the current time down to the nearest 15 minutes
toStartOfInterval(now(), INTERVAL '15' MINUTE)


-- round a timestamp down to the day
toStartOfInterval(timestamp, INTERVAL '1' DAY)


-- count the number of datapoints filed in each hourly window
SELECT
  toStartOfInterval(timestamp, INTERVAL '1' HOUR) AS hour,
  sum(_sample_interval) AS count
FROM your_dataset
GROUP BY hour
ORDER BY hour ASC
```
