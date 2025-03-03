// 'use strict'; Tutti i moduli ES (file .mjs) usano la strict mode di default

// import della libreria dayjs
// CommonJS (modo standard di Node, non di JS)

// const dayjs = require('dayjs'); // VSCode fa automaticamente la conversione al formato qui sotto 'import ...' (non tutte le librerie node sono pronte per la formattazione ES, che potrebbe generare qualcosa che non funziona, si possono convertire in maniera biunivoca ma non in maniera automatica)

// ES module (Ecma Script (Java Script))

import dayjs from 'dayjs'; // importa l'oggetto dayjs dalla libreria 'dayjs' (per il resto del programma per usare le funzioni uso l'oggetto dayjs)

// equivalente a 'import dayjs' in altri linguaggi

// creo un oggetto che contiene data, ora, sec, ecc. e lo stampo a schermo
let oggi = dayjs();
console.log(oggi);

/** Output di console.log(oggi); (rappresentazione grezza):
 * M {
  '$L': 'en', // lingua
  '$d': 2025-03-03T09:44:36.454Z, // intera data (Z = UTC, ora attuale - 1)
  '$y': 2025, // Anno
  '$M': 2, // Mese (si parte da 0, gennaio = 0, vale solo per il mese)
  '$D': 3, // Giorno
  '$W': 1, // Giorno della settimana
  '$H': 10, // Ore
  '$m': 44, // Minuti
  '$s': 36, // Secondi
  '$ms': 454, // Millisecondi
  '$x': {},
  '$isDayjsObject': true
} */

console.log(oggi.format('YYYY-MM-DD'));

/**Output:
 * 2025-03-03
 */