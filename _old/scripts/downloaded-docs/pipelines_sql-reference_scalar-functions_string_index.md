---
title: String functions · Cloudflare Pipelines Docs
description: Scalar functions for manipulating strings
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/string/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/string/index.md
---

*Cloudflare Pipelines scalar function implementations are based on [Apache DataFusion](https://arrow.apache.org/datafusion/) (via [Arroyo](https://www.arroyo.dev/)) and these docs are derived from the DataFusion function reference.*

## `ascii`

Returns the ASCII value of the first character in a string.

```plaintext
ascii(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [chr](#chr)

## `bit_length`

Returns the bit length of a string.

```plaintext
bit_length(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [length](#length), [octet\_length](#octet_length)

## `btrim`

Trims the specified trim string from the start and end of a string. If no trim string is provided, all whitespace is removed from the start and end of the input string.

```plaintext
btrim(str[, trim_str])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **trim\_str**: String expression to trim from the beginning and end of the input string. Can be a constant, column, or function, and any combination of arithmetic operators. *Default is whitespace characters.*

**Related functions**: [ltrim](#ltrim), [rtrim](#rtrim)

**Aliases**

* trim

## `char_length`

*Alias of [length](#length).*

## `character_length`

*Alias of [length](#length).*

## `concat`

Concatenates multiple strings together.

```plaintext
concat(str[, ..., str_n])
```

**Arguments**

* **str**: String expression to concatenate. Can be a constant, column, or function, and any combination of string operators.
* **str\_n**: Subsequent string column or literal string to concatenate.

**Related functions**: [concat\_ws](#concat_ws)

## `concat_ws`

Concatenates multiple strings together with a specified separator.

```plaintext
concat(separator, str[, ..., str_n])
```

**Arguments**

* **separator**: Separator to insert between concatenated strings.
* **str**: String expression to concatenate. Can be a constant, column, or function, and any combination of string operators.
* **str\_n**: Subsequent string column or literal string to concatenate.

**Related functions**: [concat](#concat)

## `chr`

Returns the character with the specified ASCII or Unicode code value.

```plaintext
chr(expression)
```

**Arguments**

* **expression**: Expression containing the ASCII or Unicode code value to operate on. Can be a constant, column, or function, and any combination of arithmetic or string operators.

**Related functions**: [ascii](#ascii)

## `ends_with`

Tests if a string ends with a substring.

```plaintext
ends_with(str, substr)
```

**Arguments**

* **str**: String expression to test. Can be a constant, column, or function, and any combination of string operators.
* **substr**: Substring to test for.

## `initcap`

Capitalizes the first character in each word in the input string. Words are delimited by non-alphanumeric characters.

```plaintext
initcap(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [lower](#lower), [upper](#upper)

## `instr`

*Alias of [strpos](#strpos).*

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **substr**: Substring expression to search for. Can be a constant, column, or function, and any combination of string operators.

## `left`

Returns a specified number of characters from the left side of a string.

```plaintext
left(str, n)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **n**: Number of characters to return.

**Related functions**: [right](#right)

## `length`

Returns the number of characters in a string.

```plaintext
length(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Aliases**

* char\_length
* character\_length

**Related functions**: [bit\_length](#bit_length), [octet\_length](#octet_length)

## `lower`

Converts a string to lower-case.

```plaintext
lower(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [initcap](#initcap), [upper](#upper)

## `lpad`

Pads the left side of a string with another string to a specified string length.

```plaintext
lpad(str, n[, padding_str])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **n**: String length to pad to.
* **padding\_str**: String expression to pad with. Can be a constant, column, or function, and any combination of string operators. *Default is a space.*

**Related functions**: [rpad](#rpad)

## `ltrim`

Trims the specified trim string from the beginning of a string. If no trim string is provided, all whitespace is removed from the start of the input string.

```plaintext
ltrim(str[, trim_str])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **trim\_str**: String expression to trim from the beginning of the input string. Can be a constant, column, or function, and any combination of arithmetic operators. *Default is whitespace characters.*

**Related functions**: [btrim](#btrim), [rtrim](#rtrim)

## `octet_length`

Returns the length of a string in bytes.

```plaintext
octet_length(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [bit\_length](#bit_length), [length](#length)

## `repeat`

Returns a string with an input string repeated a specified number.

```plaintext
repeat(str, n)
```

**Arguments**

* **str**: String expression to repeat. Can be a constant, column, or function, and any combination of string operators.
* **n**: Number of times to repeat the input string.

## `replace`

Replaces all occurrences of a specified substring in a string with a new substring.

```plaintext
replace(str, substr, replacement)
```

**Arguments**

* **str**: String expression to repeat. Can be a constant, column, or function, and any combination of string operators.
* **substr**: Substring expression to replace in the input string. Can be a constant, column, or function, and any combination of string operators.
* **replacement**: Replacement substring expression. Can be a constant, column, or function, and any combination of string operators.

## `reverse`

Reverses the character order of a string.

```plaintext
reverse(str)
```

**Arguments**

* **str**: String expression to repeat. Can be a constant, column, or function, and any combination of string operators.

## `right`

Returns a specified number of characters from the right side of a string.

```plaintext
right(str, n)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **n**: Number of characters to return.

**Related functions**: [left](#left)

## `rpad`

Pads the right side of a string with another string to a specified string length.

```plaintext
rpad(str, n[, padding_str])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **n**: String length to pad to.
* **padding\_str**: String expression to pad with. Can be a constant, column, or function, and any combination of string operators. *Default is a space.*

**Related functions**: [lpad](#lpad)

## `rtrim`

Trims the specified trim string from the end of a string. If no trim string is provided, all whitespace is removed from the end of the input string.

```plaintext
rtrim(str[, trim_str])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **trim\_str**: String expression to trim from the end of the input string. Can be a constant, column, or function, and any combination of arithmetic operators. *Default is whitespace characters.*

**Related functions**: [btrim](#btrim), [ltrim](#ltrim)

## `split_part`

Splits a string based on a specified delimiter and returns the substring in the specified position.

```plaintext
split_part(str, delimiter, pos)
```

**Arguments**

* **str**: String expression to spit. Can be a constant, column, or function, and any combination of string operators.
* **delimiter**: String or character to split on.
* **pos**: Position of the part to return.

## `starts_with`

Tests if a string starts with a substring.

```plaintext
starts_with(str, substr)
```

**Arguments**

* **str**: String expression to test. Can be a constant, column, or function, and any combination of string operators.
* **substr**: Substring to test for.

## `strpos`

Returns the starting position of a specified substring in a string. Positions begin at 1. If the substring does not exist in the string, the function returns 0.

```plaintext
strpos(str, substr)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **substr**: Substring expression to search for. Can be a constant, column, or function, and any combination of string operators.

**Aliases**

* instr

## `substr`

Extracts a substring of a specified number of characters from a specific starting position in a string.

```plaintext
substr(str, start_pos[, length])
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **start\_pos**: Character position to start the substring at. The first character in the string has a position of 1.
* **length**: Number of characters to extract. If not specified, returns the rest of the string after the start position.

## `translate`

Translates characters in a string to specified translation characters.

```plaintext
translate(str, chars, translation)
```

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.
* **chars**: Characters to translate.
* **translation**: Translation characters. Translation characters replace only characters at the same position in the **chars** string.

## `to_hex`

Converts an integer to a hexadecimal string.

```plaintext
to_hex(int)
```

**Arguments**

* **int**: Integer expression to convert. Can be a constant, column, or function, and any combination of arithmetic operators.

## `trim`

*Alias of [btrim](#btrim).*

## `upper`

Converts a string to upper-case.

```plaintext
upper(str)
```

**Arguments**

* **str**: String expression to operate on. Can be a constant, column, or function, and any combination of string operators.

**Related functions**: [initcap](#initcap), [lower](#lower)

## `uuid`

Returns UUID v4 string value which is unique per row.

```plaintext
uuid()
```

## `overlay`

Returns the string which is replaced by another string from the specified position and specified count length. For example, `overlay('Txxxxas' placing 'hom' from 2 for 4) → Thomas`

```plaintext
overlay(str PLACING substr FROM pos [FOR count])
```

**Arguments**

* **str**: String expression to operate on.
* **substr**: the string to replace part of str.
* **pos**: the start position to replace of str.
* **count**: the count of characters to be replaced from start position of str. If not specified, will use substr length instead.

## `levenshtein`

Returns the Levenshtein distance between the two given strings. For example, `levenshtein('kitten', 'sitting') = 3`

```plaintext
levenshtein(str1, str2)
```

**Arguments**

* **str1**: String expression to compute Levenshtein distance with str2.
* **str2**: String expression to compute Levenshtein distance with str1.

## `substr_index`

Returns the substring from str before count occurrences of the delimiter delim. If count is positive, everything to the left of the final delimiter (counting from the left) is returned. If count is negative, everything to the right of the final delimiter (counting from the right) is returned. For example, `substr_index('www.apache.org', '.', 1) = www`, `substr_index('www.apache.org', '.', -1) = org`

```plaintext
substr_index(str, delim, count)
```

**Arguments**

* **str**: String expression to operate on.
* **delim**: the string to find in str to split str.
* **count**: The number of times to search for the delimiter. Can be both a positive or negative number.

## `find_in_set`

Returns a value in the range of 1 to N if the string str is in the string list strlist consisting of N substrings. For example, `find_in_set('b', 'a,b,c,d') = 2`

```plaintext
find_in_set(str, strlist)
```

**Arguments**

* **str**: String expression to find in strlist.
* **strlist**: A string list is a string composed of substrings separated by , characters.
