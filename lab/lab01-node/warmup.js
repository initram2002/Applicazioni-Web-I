"use strict";

/**
 * Restituisce la trasformazione richiesta per una singola parola.
 * @param {string} word
 * @returns {string}
 */
const transform = function(word) {
    const len = word.length;

    if (len < 2)            // caso 1
        return "";

    if (len === 2)          // caso 2
        return word + word;

    // caso generale >= 3
    return word.slice(0, 2) + word.slice(-2);
};

/**
 * Elabora e stampa i risultati per tutte le parole dell'array.
 * @param {string[]} words
 */
const processWords = function(words) {
    words.forEach(w => console.log(`${w} -> ${transform(w)}`));
};

// --- test ---
processWords([
    "spring",   // spng
    "it",       // itit
    "cat",      // caat
    "a",        // '' (stringa vuota)
    "JavaScript" 
]);
