---
title: JSON functions · Cloudflare Pipelines Docs
description: Scalar functions for manipulating JSON
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/json/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/json/index.md
---

Cloudflare Pipelines provides two set of JSON functions, the first based on PostgreSQL's SQL functions and syntax, and the second based on the [JSONPath](https://jsonpath.com/) standard.

## SQL functions

The SQL functions provide basic JSON parsing functions similar to those found in PostgreSQL.

### json\_contains

Returns `true` if the JSON string contains the specified key(s).

```sql
SELECT json_contains('{"a": 1, "b": 2, "c": 3}', 'a') FROM source;
true
```

Also available via the `?` operator:

```sql
SELECT '{"a": 1, "b": 2, "c": 3}' ? 'a' FROM source;
true
```

### json\_get

Retrieves the value from a JSON string by the specified path (keys). Returns the value as its native type (string, int, etc.).

```sql
SELECT json_get('{"a": {"b": 2}}', 'a', 'b') FROM source;
2
```

Also available via the `->` operator:

```sql
SELECT '{"a": {"b": 2}}'->'a'->'b' FROM source;
2
```

Various permutations of `json_get` functions are available for retrieving values as a specific type, or you can use SQL type annotations:

```sql
SELECT json_get('{"a": {"b": 2}}', 'a', 'b')::int FROM source;
2
```

### json\_get\_str

Retrieves a string value from a JSON string by the specified path. Returns an empty string if the value does not exist or is not a string.

```sql
SELECT json_get_str('{"a": {"b": "hello"}}', 'a', 'b') FROM source;
"hello"
```

### json\_get\_int

Retrieves an integer value from a JSON string by the specified path. Returns `0` if the value does not exist or is not an integer.

```sql
SELECT json_get_int('{"a": {"b": 42}}', 'a', 'b') FROM source;
42
```

### json\_get\_float

Retrieves a float value from a JSON string by the specified path. Returns `0.0` if the value does not exist or is not a float.

```sql
SELECT json_get_float('{"a": {"b": 3.14}}', 'a', 'b') FROM source;
3.14
```

### json\_get\_bool

Retrieves a boolean value from a JSON string by the specified path. Returns `false` if the value does not exist or is not a boolean.

```sql
SELECT json_get_bool('{"a": {"b": true}}', 'a', 'b') FROM source;
true
```

### json\_get\_json

Retrieves a nested JSON string from a JSON string by the specified path. The value is returned as raw JSON.

```sql
SELECT json_get_json('{"a": {"b": {"c": 1}}}', 'a', 'b') FROM source;
'{"c": 1}'
```

### json\_as\_text

Retrieves any value from a JSON string by the specified path and returns it as a string, regardless of the original type.

```sql
SELECT json_as_text('{"a": {"b": 42}}', 'a', 'b') FROM source;
"42"
```

Also available via the `->>` operator:

```sql
SELECT '{"a": {"b": 42}}'->>'a'->>'b' FROM source;
"42"
```

### json\_length

Returns the length of a JSON object or array at the specified path. Returns `0` if the path does not exist or is not an object/array.

```sql
SELECT json_length('{"a": [1, 2, 3]}', 'a') FROM source;
3
```

## Json path functions

JSON functions provide basic json parsing functions using [JsonPath](https://goessner.net/articles/JsonPath/), an evolving standard for querying JSON objects.

### extract\_json

Returns the JSON elements in the first argument that match the JsonPath in the second argument. The returned value is an array of json strings.

```sql
SELECT extract_json('{"a": 1, "b": 2, "c": 3}', '$.a') FROM source;
['1']
```

### extract\_json\_string

Returns an unescaped String for the first item matching the JsonPath, if it is a string.

```sql
SELECT extract_json_string('{"a": "a", "b": 2, "c": 3}', '$.a') FROM source;
'a'
```
