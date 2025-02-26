"use strict" // da mettere sempre all'inizio di ogni file

const scores = [-20, -5, -1, 100, -3, 30, 50, 10] // array che contiene gli score
const betterScores = []; // creiamo un array vuoto
let NN = 0;

// Per togliere i voti negativi, facciamo un ciclo e i voti positivi li mettiamo nell'array vuoto

// of -> elementi array, in -> oggetti
for (let s of scores)
    if (s >= 0)
        betterScores.push(s); // push aggiunge in coda all'array, così da preservare l'ordine

NN = scores.length - betterScores.length; // modo semplice per capire quanti numeri ho tolto: faccio la differenza tra le lunghezze dei vettori (piuttosto che calcolarlo nel ciclo)

// VERSIONE CON SORT
betterScores.sort((a, b) => a - b);
betterScores.shift();
betterScores.shift();

// aggiungi NN + 2 nuovi score pari alla media degli score presenti in betterScores

// la calcolo a mano
let avg = 0;

for (let s of betterScores)
    avg += s;

avg /= betterScores.length;
avg = Math.round(avg); // arrotondo la media all'intero più vicino

// aggiungo in coda due volte questo valore

// uso la versione "classica" del for
for(let i = 0; i < NN + 2; i++)
    betterScores.push(avg); // in questo esempio, viene aggiunto 6 volte, perché ho tolto 4 numeri

// infine, stampo entrambi gli array
console.log(scores);
console.log(betterScores);

/* 
Stampa grezza dell'array:
[
  -20, -5, -1, 100,
   -3, 30, 50,  10
] 
*/
