---
title: Prepared statement methods · Cloudflare D1 docs
description: This chapter documents the various ways you can run and retrieve
  the results of a query after you have prepared your statement.
lastUpdated: 2025-08-06T13:29:13.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/worker-api/prepared-statements/
  md: https://developers.cloudflare.com/d1/worker-api/prepared-statements/index.md
---

This chapter documents the various ways you can run and retrieve the results of a query after you have [prepared your statement](https://developers.cloudflare.com/d1/worker-api/d1-database/#prepare).

## Methods

### `bind()`

Binds a parameter to the prepared statement.

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
```

#### Parameter

* `Variable`: string
  * The variable to be appended into the prepared statement. See [guidance](#guidance) below.

#### Return values

* `D1PreparedStatement`: Object
  * A `D1PreparedStatement` where the input parameter has been included in the statement.

#### Guidance

* D1 follows the [SQLite convention](https://www.sqlite.org/lang_expr.html#varparam) for prepared statements parameter binding. Currently, D1 only supports Ordered (`?NNNN`) and Anonymous (`?`) parameters. In the future, D1 will support named parameters as well.

  | Syntax | Type | Description |
  | - | - | - |
  | `?NNN` | Ordered | A question mark followed by a number `NNN` holds a spot for the `NNN`-th parameter. `NNN` must be between `1` and `SQLITE_MAX_VARIABLE_NUMBER` |
  | `?` | Anonymous | A question mark that is not followed by a number creates a parameter with a number one greater than the largest parameter number already assigned. If this means the parameter number is greater than `SQLITE_MAX_VARIABLE_NUMBER`, it is an error. This parameter format is provided for compatibility with other database engines. But because it is easy to miscount the question marks, the use of this parameter format is discouraged. Programmers are encouraged to use one of the symbolic formats below or the `?NNN` format above instead. |

  To bind a parameter, use the `.bind` method.

  Order and anonymous examples:

  ```js
  const stmt = db.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind("");
  ```

  ```js
  const stmt = db
    .prepare("SELECT * FROM Customers WHERE CompanyName = ? AND CustomerId = ?")
    .bind("Alfreds Futterkiste", 1);
  ```

  ```js
  const stmt = db
    .prepare("SELECT * FROM Customers WHERE CompanyName = ?2 AND CustomerId = ?1")
    .bind(1, "Alfreds Futterkiste");
  ```

#### Static statements

D1 API supports static statements. Static statements are SQL statements where the variables have been hard coded. When writing a static statement, you manually type the variable within the statement string.

Advantages of prepared statements

The recommended approach is to use [prepared statements](https://developers.cloudflare.com/d1/worker-api/d1-database/#prepare) to run the SQL and bind parameters to them. Binding parameters using [`bind()`](https://developers.cloudflare.com/d1/worker-api/prepared-statements/#bind) to prepared statements allows you to reuse the prepared statements in your code, and prevents SQL injection attacks.

Example of a prepared statement with dynamically bound value:

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
// A variable (someVariable) will replace the placeholder '?' in the query.
// `stmt` is a prepared statement.
```

Example of a static statement:

```js
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = Bs Beverages");
// "Bs Beverages" is hard-coded into the query.
// `stmt` is a static statement.
```

### `run()`

Runs the prepared query (or queries) and returns results. The returned results includes metadata.

```js
const returnValue = await stmt.run();
```

#### Parameter

* None.

#### Return values

* `D1Result`: Object

  * An object containing the success status, a meta object, and an array of objects containing the query results.
  * For more information on the object, refer to [`D1Result`](https://developers.cloudflare.com/d1/worker-api/return-object/#d1result).

Example of return values

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
const returnValue = await stmt.run();
```

```js
return Response.json(returnValue);
```

```js
{
  "success": true,
  "meta": {
    "served_by": "miniflare.db",
    "duration": 1,
    "changes": 0,
    "last_row_id": 0,
    "changed_db": false,
    "size_after": 8192,
    "rows_read": 4,
    "rows_written": 0
  },
  "results": [
    {
      "CustomerId": 11,
      "CompanyName": "Bs Beverages",
      "ContactName": "Victoria Ashworth"
    },
    {
      "CustomerId": 13,
      "CompanyName": "Bs Beverages",
      "ContactName": "Random Name"
    }
  ]
}
```

#### Guidance

* `results` is empty for write operations such as `UPDATE`, `DELETE`, or `INSERT`.
* When using TypeScript, you can pass a [type parameter](https://developers.cloudflare.com/d1/worker-api/#typescript-support) to [`D1PreparedStatement::run`](#run) to return a typed result object.
* [`D1PreparedStatement::run`](#run) is functionally equivalent to `D1PreparedStatement::all`, and can be treated as an alias.
* You can choose to extract only the results you expect from the statement by simply returning the `results` property of the return object.

Example of returning only the `results`

```js
return Response.json(returnValue.results);
```

```js
[
  {
    "CustomerId": 11,
    "CompanyName": "Bs Beverages",
    "ContactName": "Victoria Ashworth"
  },
  {
    "CustomerId": 13,
    "CompanyName": "Bs Beverages",
    "ContactName": "Random Name"
  }
]
```

### `raw()`

Runs the prepared query (or queries), and returns the results as an array of arrays. The returned results do not include metadata.

Column names are not included in the result set by default. To include column names as the first row of the result array, set `.raw({columnNames: true})`.

```js
const returnValue = await stmt.raw();
```

#### Parameters

* `columnNames`: Object Optional
  * A boolean object which includes column names as the first row of the result array.

#### Return values

* `Array`: Array
  * An array of arrays. Each sub-array represents a row.

Example of return values

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
const returnValue = await stmt.raw();
return Response.json(returnValue);
```

```js
[
  [11, "Bs Beverages",
    "Victoria Ashworth"
  ],
  [13, "Bs Beverages",
    "Random Name"
  ]
]
```

With parameter `columnNames: true`:

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
const returnValue = await stmt.raw({columnNames:true});
return Response.json(returnValue)
```

```js
[
  [
    "CustomerId",
    "CompanyName",
    "ContactName"
  ],
  [11, "Bs Beverages",
    "Victoria Ashworth"
  ],
  [13, "Bs Beverages",
    "Random Name"
  ]
]
```

#### Guidance

* When using TypeScript, you can pass a [type parameter](https://developers.cloudflare.com/d1/worker-api/#typescript-support) to [`D1PreparedStatement::raw`](#raw) to return a typed result array.

### `first()`

Runs the prepared query (or queries), and returns the first row of the query result as an object. This does not return any metadata. Instead, it directly returns the object.

```js
const values = await stmt.first();
```

#### Parameters

* `columnName`: String Optional
  * Specify a `columnName` to return a value from a specific column in the first row of the query result.
* None.
  * Do not pass a parameter to obtain all columns from the first row.

#### Return values

* `firstRow`: Object Optional

  * An object containing the first row of the query result.
  * The return value will be further filtered to a specific attribute if `columnName` was specified.

* `null`: null

  * If the query returns no rows.

Example of return values

Get all the columns from the first row:

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
const returnValue = await stmt.first();
return Response.json(returnValue)
```

```js
{
  "CustomerId": 11,
  "CompanyName": "Bs Beverages",
  "ContactName": "Victoria Ashworth"
}
```

Get a specific column from the first row:

```js
const someVariable = `Bs Beverages`;
const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
const returnValue = await stmt.first(CustomerId);
return Response.json(returnValue)
```

```js
11
```

#### Guidance

* If the query returns rows but `column` does not exist, then [`D1PreparedStatement::first`](#first) throws the `D1_ERROR` exception.
* [`D1PreparedStatement::first`](#first) does not alter the SQL query. To improve performance, consider appending `LIMIT 1` to your statement.
* When using TypeScript, you can pass a [type parameter](https://developers.cloudflare.com/d1/worker-api/#typescript-support) to [`D1PreparedStatement::first`](#first) to return a typed result object.
