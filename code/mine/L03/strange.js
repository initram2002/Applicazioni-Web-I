/* Strange JS behaviors and where to find (some of) them */
'use strict';

const type = typeof NaN;
console.log('NaN is a ' + type); // number (vedi teoria)
console.log(`NaN === NaN? ${NaN === NaN}\n`); // false: ogni confronto con NaN restituisce false sempre

console.log(`NaN == NaN? ${NaN == NaN}`); // false: confronto non stretto, ogni uguaglianza con NaN restituisce sempre false
console.log(`null == undefined? ${null == undefined}\n`); // true: entrambi sono valori 'falsy' e l'uguaglianza non è stretta

console.log(`null == false? ${null == false}`); // false: non è un uguaglianza stretta e non essendo lo stesso oggetto l'uguaglianza è falsa
console.log(`'' == false? ${'' == false}`); // true: '' è un valore 'falsy'
console.log(`3 == true? ${3 == true}`); // false: viene effettuata una conversione tra tipi e i due oggetti non corrispondono tra loro
console.log(`0 == -0? ${0 == -0}\n`); // true: non è un uguaglianza stretta e sono entrambi valori 'falsy'

console.log(`true + true = ${true + true}`); // 2: 
console.log(`true !== 1? ${true !== 1}\n`);

console.log(`5 + '10' = ${5 + '10'}`);
console.log(`'5' - 1 = ${'5' - 1}\n`);

console.log(`1 < 2 < 3? ${1 < 2 < 3}`);
console.log(`3 > 2 > 1? ${3 > 2 > 1}\n`);

console.log(`0.2 + 0.1 === 0.3? ${0.2 + 0.1 === 0.3}\n`);

console.log('b' + 'a' + (+ 'a') + 'a');