---
title: "Bash Scripting Code and Automation"
date: 2023-09-16T15:12:01+03:00
draft: false
description: "Enhance your coding skills and automate tasks with Bash scripting. Learn Bash commands and boost productivity."
tags: ["linux","commands","terminal"]
keywords: ["linux","commands","terminal"]
author: "orioninsist"
slug: "bash-scripting-code-and-automation"
language: "English"
type: "blog"
cover:
    image: "/blog/bash-scripting-code-and-automation.png"
    alt: "bash-scripting-code-and-automation.png"
---


Bash scripting is a powerful tool for automating tasks, processing data, and making decisions based on conditions. In this blog post, we'll explore various Bash commands and scripting techniques, explaining their purposes and providing examples along the way.
## 1. Echo Command
The echo command is used to print text to the terminal. It can also display the values of variables.
```markdown
echo $0 $1 $2 $3 $4 $5 $6 $7 $8 $9
```
In this example, $0 represents the script's name, while $1 to $9 are command-line arguments passed to the script. When you run the script as ./myscript.sh or ./myscript.sh orion insist, you can see how these variables capture the script's name and arguments.
## 2. Variables and Input
Variables in Bash can hold various types of data, including strings and numbers. Here's an example of variable usage:
```shell
myvariable="hello world"
echo $myvariable
```
You can also read user input and store it in a variable:
```shell
read varname
echo "varname: " $varname
```
When you run the script and enter a value, it will be stored in the varname variable and displayed on the screen.
## 3. Arithmetic Expressions
Bash supports arithmetic operations. You can perform calculations using various methods:
### Using let:
```shell
let a=5+4
echo "1: " $a

let "a=5+4"
echo "2: " $a
```
### Using expr:
```shell
expr 2 + 3  # Outputs: 5
```
### Using $((expression)):
```shell
a=$((2+3))
echo $a
```
## 4. Conditional Statements
Conditional statements allow you to make decisions in your scripts. Here are some examples:
### If Statements:
```shell
if [ "$1" -eq 5 ]; then
    echo "Input is equal to 5"
else
    echo "Input is not equal to 5"
fi
```
### Case Statements:
```shell
case "$3" in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```
## 5. Loops
Loops are used to execute a block of code repeatedly. Here are some common loop types:
### While Loop:
```shell
counter=1
while [ $counter -lt 10 ]; do
    echo $counter
    ((counter++))
done
```
### For Loop (C-style):
```shell
for ((i = 0; i < 10; i++)); do
    echo $i
done
```
## For Loop (Iterating Over a List):
```shell
for l in $(ls); do
    echo $l
done
```
## For Loop (Using Ranges):
```shell
for value in {1..5}; do
    echo $value
done
```
### Until Loop:
```shell
counter=1
until [ $counter -gt 10 ]; do
    echo $counter
    ((counter++))
done
```
## 6. Functions
Functions allow you to organize your code into reusable blocks. Here's how you define and use functions in Bash:
```shell
function my_function {
    echo "This is a function"
}

my_function
```
## 7. Centering Text in Terminal
Lastly, here's a script that centers text in the terminal:
```shell
#!/bin/bash
cols=$(tput cols)
rows=$(tput lines)
message=$@
input_length=${#message}
half_input_length=$((input_length / 2))
middle_row=$((rows / 2))
middle_col=$((cols / 2 - half_input_length))
tput clear
tput cup $middle_row $middle_col
tput bold
echo $@
tput sgr0
tput cup $(tput lines) 0
```
Run this script with your desired message to see how it centers the text in the terminal.

By mastering these Bash scripting concepts, you can automate tasks and create efficient, robust scripts for various purposes. Whether you're managing files, processing data, or making decisions based on conditions, Bash scripting is a valuable skill to have in your toolkit.



