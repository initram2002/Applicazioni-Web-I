/**
 * Description: This file contains an example of how variables
 * declared with let and var work in JavaScript, showing the difference bewtween scoping
 * and hoisting in strict mode. 
 */

"use strict"; // Enable JavaScript's strict mode

function example(x) {
    // Variable declaration with let, valid in the function block
    let a = 1;

    console.log(a); // Print 1 -> 'a' is correctly defined
    console.log(b); // ReferenceError -> 'b' has not yet been declared in the current scope
    console.log(c); // undefined -> 'c' exists thanks to var hoisting, but is not yet initialized

    if (x > 1) {
        // Declaration of 'b' with let, valid only within this block
        let b = a + 1;
        // Declaration of 'c' with var, visible within the whole function
        var c = a * 2;
    }

    console.log(a); // Print 1 -> 'a' is still accessible
    console.log(b); // ReferenceError -> 'b' is not visible outside the if block
    console.log(c); // Print 2 -> 'c' is accessible because var has function scope
}

// Function invocation with argument 2
example(2);