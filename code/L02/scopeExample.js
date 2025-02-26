"use strict";
// Enables JavaScript's 'strict mode', making the language stricter.
// In this mode, it's not possible to declare the same variable twice
// with the same keyword (let, const or var).

let a = 1;
// Declaration of a variable 'a' and assignment of value 1.

const b = 2;
// Declaration of a constant 'b' and assignment of the value 2.
// Constants cannot be reassigned, but can be read anywhere in the code.

let c = true;
// Declaration of a variable 'c' and assignment of the Boolean value true.

let a = 5;
// Attempt to redeclare variable 'a'. In strict mode, this generates
// an error of type 'SyntaxError: Identifier "a" has already been declared.