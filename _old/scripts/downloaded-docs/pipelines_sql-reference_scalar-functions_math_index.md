---
title: Math functions · Cloudflare Pipelines Docs
description: Scalar functions for mathematical operations
lastUpdated: 2025-09-25T04:07:16.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/math/
  md: https://developers.cloudflare.com/pipelines/sql-reference/scalar-functions/math/index.md
---

*Cloudflare Pipelines scalar function implementations are based on [Apache DataFusion](https://arrow.apache.org/datafusion/) (via [Arroyo](https://www.arroyo.dev/)) and these docs are derived from the DataFusion function reference.*

## `abs`

Returns the absolute value of a number.

```plaintext
abs(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `acos`

Returns the arc cosine or inverse cosine of a number.

```plaintext
acos(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `acosh`

Returns the area hyperbolic cosine or inverse hyperbolic cosine of a number.

```plaintext
acosh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `asin`

Returns the arc sine or inverse sine of a number.

```plaintext
asin(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `asinh`

Returns the area hyperbolic sine or inverse hyperbolic sine of a number.

```plaintext
asinh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `atan`

Returns the arc tangent or inverse tangent of a number.

```plaintext
atan(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `atanh`

Returns the area hyperbolic tangent or inverse hyperbolic tangent of a number.

```plaintext
atanh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `atan2`

Returns the arc tangent or inverse tangent of `expression_y / expression_x`.

```plaintext
atan2(expression_y, expression_x)
```

**Arguments**

* **expression\_y**: First numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **expression\_x**: Second numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `cbrt`

Returns the cube root of a number.

```plaintext
cbrt(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `ceil`

Returns the nearest integer greater than or equal to a number.

```plaintext
ceil(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `cos`

Returns the cosine of a number.

```plaintext
cos(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `cosh`

Returns the hyperbolic cosine of a number.

```plaintext
cosh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `degrees`

Converts radians to degrees.

```plaintext
degrees(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `exp`

Returns the base-e exponential of a number.

```plaintext
exp(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to use as the exponent. Can be a constant, column, or function, and any combination of arithmetic operators.

## `factorial`

Factorial. Returns 1 if value is less than 2.

```plaintext
factorial(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `floor`

Returns the nearest integer less than or equal to a number.

```plaintext
floor(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `gcd`

Returns the greatest common divisor of `expression_x` and `expression_y`. Returns 0 if both inputs are zero.

```plaintext
gcd(expression_x, expression_y)
```

**Arguments**

* **expression\_x**: First numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **expression\_y**: Second numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `isnan`

Returns true if a given number is +NaN or -NaN otherwise returns false.

```plaintext
isnan(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `iszero`

Returns true if a given number is +0.0 or -0.0 otherwise returns false.

```plaintext
iszero(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `lcm`

Returns the least common multiple of `expression_x` and `expression_y`. Returns 0 if either input is zero.

```plaintext
lcm(expression_x, expression_y)
```

**Arguments**

* **expression\_x**: First numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **expression\_y**: Second numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `ln`

Returns the natural logarithm of a number.

```plaintext
ln(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `log`

Returns the base-x logarithm of a number. Can either provide a specified base, or if omitted then takes the base-10 of a number.

```plaintext
log(base, numeric_expression)
log(numeric_expression)
```

**Arguments**

* **base**: Base numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `log10`

Returns the base-10 logarithm of a number.

```plaintext
log10(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `log2`

Returns the base-2 logarithm of a number.

```plaintext
log2(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `nanvl`

Returns the first argument if it's not *NaN*. Returns the second argument otherwise.

```plaintext
nanvl(expression_x, expression_y)
```

**Arguments**

* **expression\_x**: Numeric expression to return if it's not *NaN*. Can be a constant, column, or function, and any combination of arithmetic operators.
* **expression\_y**: Numeric expression to return if the first expression is *NaN*. Can be a constant, column, or function, and any combination of arithmetic operators.

## `pi`

Returns an approximate value of π.

```plaintext
pi()
```

## `power`

Returns a base expression raised to the power of an exponent.

```plaintext
power(base, exponent)
```

**Arguments**

* **base**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **exponent**: Exponent numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

**Aliases**

* pow

## `pow`

*Alias of [power](#power).*

## `radians`

Converts degrees to radians.

```plaintext
radians(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `random`

Returns a random float value in the range \[0, 1). The random seed is unique to each row.

```plaintext
random()
```

## `round`

Rounds a number to the nearest integer.

```plaintext
round(numeric_expression[, decimal_places])
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.
* **decimal\_places**: Optional. The number of decimal places to round to. Defaults to 0.

## `signum`

Returns the sign of a number. Negative numbers return `-1`. Zero and positive numbers return `1`.

```plaintext
signum(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `sin`

Returns the sine of a number.

```plaintext
sin(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `sinh`

Returns the hyperbolic sine of a number.

```plaintext
sinh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `sqrt`

Returns the square root of a number.

```plaintext
sqrt(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `tan`

Returns the tangent of a number.

```plaintext
tan(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `tanh`

Returns the hyperbolic tangent of a number.

```plaintext
tanh(numeric_expression)
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

## `trunc`

Truncates a number to a whole number or truncated to the specified decimal places.

```plaintext
trunc(numeric_expression[, decimal_places])
```

**Arguments**

* **numeric\_expression**: Numeric expression to operate on. Can be a constant, column, or function, and any combination of arithmetic operators.

* **decimal\_places**: Optional. The number of decimal places to truncate to. Defaults to 0 (truncate to a whole number). If `decimal_places` is a positive integer, truncates digits to the right of the decimal point. If `decimal_places` is a negative integer, replaces digits to the left of the decimal point with `0`.
