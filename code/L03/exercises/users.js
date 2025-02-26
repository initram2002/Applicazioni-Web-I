"use strict"

const names = "Michela Martini, Angelica Coluccia, Bianca Ferraioli, Lorenzo Marra, Alessandro Massari"

// creazione dell'array dai nomi, divido sulla virgola
const nameArray = names.split(",");

// rimozione spazi extra

for (let i = 0; i < nameArray.length; i++)
    nameArray[i] = nameArray[i].trim(); // prendo il singolo elemento dell'array, faccio trim che restituisce una stringa e lo rimetto nella stessa posizione
    // visto che non aggiungo elementi nell'array, posso usare lo stesso array senza averne uno d'appoggio

// creazione acronimi
const acronyms = [];

// in name c'è il singolo nome
for (let name of nameArray){
    const Words = name.split(" "); // divido sullo spazio
    let initials = ""; // iniziali, inizializzo a stringa vuota

    // ciclo su ogni parola, prendo il primo elemento e lo metto in initials
    for (let word of Words)
        initials += word[0];

    // infine, aggiungo agli acronimi
    acronyms.push(initials); // per sicurezza dovremmo metterlo in maiuscolo !!!
}

// stampa del risultato: lista di nomi e acronimi, ciclo
// se tutto è corretto nameArray e acronyms hanno la stessa lunghezza (ogni nome ha un acronimo)
for (let i = 0; i < nameArray.length; i++)
    console.log(`${acronyms[i]} - ${nameArray[i]}`);

/* STAMPA 

MM - Michela Martini
AC - Angelica Coluccia
BF - Bianca Ferraioli
LM - Lorenzo Marra
AM - Alessandro Massari

*/