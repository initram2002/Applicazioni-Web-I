'use strict';

// 1. Array originale di punteggi (esempio)
const originalScores = [5, -2, 10, 0, -7, 3, 9, -1, 4];
console.log('Array originale:', originalScores);

// Funzione di utilità per la media arrotondata
function average(arr) {
    return Math.round(
        arr.reduce((acc, v) => acc + v, 0) / arr.length // somma e divisione
    );
}

// 3.a - copia senza valori negativi
let improved = originalScores.filter(score => score >= 0);
const NN = originalScores.length - improved.length; // numero di negativi eliminati

// 3.b - rimozione dei due punteggi più bassi tra quelli rimasti
improved.sort((a, b) => a - b); // ordine crescente
improved = improved.slice(2);   // scarto dei primi due

// 3.c - aggiunta di (NN + 2) punteggi pari alla media attuale
const avg = average(improved);
for (let i = 0; i < NN; i++) {
    improved.push(avg);
}

// 4. Stampa dei risultati
console.log('Array migliorato:', improved);
console.log('Media originale:', average(originalScores));
console.log('Media migliorata:', average(improved));
