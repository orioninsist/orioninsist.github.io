---
title: "Mastering Variables and Syntax in Programming"
date: 2024-10-26T15:32:58+03:00
draft: false
author: "murat"
keywords: ["programming"]
type: "blog"
description: ""
slug: "mastering-variables-syntax-in-programming"
cover:
     image: ""
     alt: ""
---

Syntax: In programming languages, syntax refers to the set of rules that defines the combinations of symbols that are considered to be correctly structured programs. It essentially dictates how code must be written.
High-Level Languages: These are programming languages that are closer to human languages, making them easier to read and write. An example is Python.
Low-Level Languages: These languages are closer to machine language, making them less readable for humans. Examples include C and C++.

## What is a Variable? 
IDLE: Stands for Integrated Development and Learning Environment. It's an environment for developing and learning programming.
Variable Concept in Programming: In computer science, a variable represents a storage location with an associated symbolic name. This symbolic name holds a value and allows for the manipulation of that value.

## Assigning Values to Variables
* Example:
```python
Copy code
A = 571
```
* In this line, A is the variable name, = is the assignment operator, and 571 is the value being assigned to the variable.

```python
A = 8
print(A)
B = 2
print(B)
print(A + B)  # Outputs the sum of A and B
TOTAL = A + B
print(TOTAL)
A = B  # Assigns the value of B to A
print(A)  # Now A is 2, because it takes the value from B
A = B = 0  # Assigns 0 to both A and B
print(A)
print(B)
```
## Variable Naming 
There are 5 Fundamental Rules for naming variables:

Rule 1
The first character of a variable name must be a letter or an underscore (_).
```python
_ali = 3
a_li = 4

```
* Rule 2
A variable name cannot contain spaces or special characters, except for underscores (_).
Special characters that are not allowed include: period, semicolon, and question mark.
```python
ali# = "BTK"  # This will cause a syntax error
```
* Rule 3
A variable name cannot be a keyword in Python.
To view the current list of keywords, you can run the following code:
```python
import keyword
print(keyword.kwlist)

```
* Example output of keywords:

```python
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', ...]

```
```python
### BUILT-IN FUNCTIONS LIST
# This code displays a list of all built-in functions and exception types 
# available in Python. These functions, errors, and constants are 
# stored in Python's `__builtins__` module and can be accessed 
# directly in any Python program without importing additional modules.

print(dir(__builtins__))  # Lists all items in the __builtins__ module.


```
* Explanation: The code above uses the dir() function to display all built-in functions, constants, and error types available in Python. The __builtins__ module includes all these default functions, which can be used without needing to import external libraries. Calling dir(__builtins__) provides a complete list of functions, such as print() and abs(), as well as exceptions like ValueError and TypeError.
* Sample Output of Built-in Functions List:

```python
['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException', 
 'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning', 
 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError', 
 'ConnectionRefusedError', 'ConnectionResetError', 'DeprecationWarning', 
 'EOFError', 'Ellipsis', 'EnvironmentError', 'Exception', 'False', 
 'FileExistsError', 'FileNotFoundError', 'FloatingPointError', 
 'FutureWarning', 'GeneratorExit', 'IOError', 'ImportError', 
 'ImportWarning', 'IndentationError', 'IndexError', 'InterruptedError', 
 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt', 'LookupError', 
 'MemoryError', 'ModuleNotFoundError', 'NameError', 'None', 'NotADirectoryError', 
 'NotImplemented', 'NotImplementedError', 'OSError', 'OverflowError', 
 'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError', 
 'RecursionError', 'ReferenceError', 'ResourceWarning', 'RuntimeError', 
 'RuntimeWarning', 'StopAsyncIteration', 'StopIteration', 'SyntaxError', 
 'SyntaxWarning', 'SystemError', 'SystemExit', 'TabError', 'TimeoutError', 
 'True', 'TypeError', 'UnboundLocalError', 'UnicodeDecodeError', 
 'UnicodeEncodeError', 'UnicodeError', 'UnicodeTranslateError', 
 'UnicodeWarning', 'UserWarning', 'ValueError', 'Warning', 
 'ZeroDivisionError', '__build_class__', '__debug__', '__doc__', 
 '__import__', '__loader__', '__name__', '__package__', '__spec__', 
 'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 
 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 
 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 
 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 
 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 
 'isinstance', 'issubclass', 'iter', 'len', 'license', 'list', 'locals', 
 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 
 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed', 
 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 
 'sum', 'super', 'tuple', 'type', 'vars', 'zip']

```

* Rule 4
Variable names should not contain Turkish characters. However, string values can include characters like "BTK".
* Rule 5
If a variable is named with a lowercase letter, it can be shadowed by another variable with the same name but in uppercase. Care should be taken in such cases.

```python
A = 3
print(A)
a = 4
print(a)
print(A, a)

```

## Transferring Variable Values 
```python
A = 3
B = 4
C = A  # C now holds the value of A
A = B  # A is now assigned the value of B
B = C  # B is assigned the original value of A
print(A, B, C)  # Outputs: 4, 3, 3

# Swapping values
A, B = B, A
print(A)
print(B)

# Example with strings
K = "BTK"
Y = "AKADEMI"
K, Y = Y, K  # Swap the values of K and Y
print(K, Y)

```

## Initial Value of Variables 
```python
Cep = 0
Cep = Cep + 10
Cep = Cep + 20
Cep = Cep + 25
Cep = Cep + 40
print(Cep)  # This will print the final value of Cep

Toplam = 0
A = 45
B = 35
Toplam = A + B
print(Toplam)  # It indicates the total is calculated from A and B.

```

## Operators 
+ --> Addition
- --> Subtraction
* --> Multiplication
/ --> Division
% --> Modulus (remainder)
** --> Exponentiation (raising to a power)
// --> Floor division (returns the largest whole number)
## Calculator Application 
```python
A = 9
B = 15
print(A, '+', B, '=', A + B)
print(A, '-', B, '=', A - B)
print(A, '*', B, '=', A * B)
print(A, '/', B, '=', A / B)
print(A, '//', B, '=', A // B)
print(A, 'mod', B, '=', A % B)
print(A, 'raised to', B, '=', A ** B)

```
## Order of Operations 
* Order of precedence:
- Parentheses ()
- Exponentiation **
- Multiplication *
- Division /
- Modulus %
- Addition +
- Subtraction -

```python
3 + 5 * 2  # 3 + (5 * 2) = 13
2 + 3 * 2 ** 2  # 2 + (3 * 4) = 14
(5 - 3) * 5 + 2  # (2 * 5) + 2 = 12

```
## Example Application of Order of Operations 
```python
X = (2 ** 2 + 3 / 5) / (3 ** 2 - 2 * 5)
print(X)

```
This version provides a structured approach to the topics, making it easier for readers to grasp the concepts of syntax and variables in programming. Let me know if you'd like any further adjustments or additions!








