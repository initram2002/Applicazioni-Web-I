"use strict";

/**
 * A number of variables are declared in this file and we observe
 * the behaviour of a variable of the same name within a new scope.
 */

// Declaration of variables a, b, c in the global scope
let a = 1; // 'a' is initialized with value 1
const b = 2; // 'b' is constant initialized to 2
let c = true; // 'c' is initialized with Boolean value true

{ 
    // Create a new scope block
    // here we re-declare 'a' with the same name,
    // but only valid within these curly brackets
    let a = 5;
    console.log(a); // Print the value of 'a' inside the block (5)
}

// Once out of the block, 'a' returns to reference
// to the variable declared in the global scope
console.log(a); // Prints the value of 'a' outside the block (1)