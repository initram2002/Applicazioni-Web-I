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

/* VERSIONE CON MIN

betterScores.pop(Math.min(betterScores)); // min: dato un insieme di valori lungo a piacere separati da virgole (value1, value2, ..., valueN) restituisce il valore più piccolo
betterScores.pop(Math.min(betterScores)); // metodo statico, bisogna specificare Math.min(), perché non si appoggia a nessun oggetto
// SBAGLIATO: pop non toglie un valore specifico, toglie in coda l'ultimo elemento, per cui devo PRIMA calcolare i minimi e POI toglierli a mano
*/

// PROF
let minScore = Math.min(...betterScores); // trovo il minimo, prima devo espandere l'array
let index = betterScores.indexOf(minScore); // trovo l'indice dell'elemento minimo
betterScores.splice(index, 1); // rimuove l'elemento all'indice indicato (il ,1 è opzionale, serve a ricordarci che stiamo togliendo un solo elemento)

// copio e incollo, visto che lo devo fare due volte, senza let per non ridichiarare le variabili
minScore = Math.min(...betterScores); 
index = betterScores.indexOf(minScore);
betterScores.splice(index, 1);


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
