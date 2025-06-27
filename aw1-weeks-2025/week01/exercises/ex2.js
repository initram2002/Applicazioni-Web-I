"use strict";

/* 1. Definizione dell'elenco utenti */
const usersCSV = "Luigi De Russis, Luca Scibetta, Fulvio Corno, Francesca Russo";

/* 2. Parsing in array di nomi, eliminando gli spazi extra */
const users = usersCSV
    .split(",")                 // ["Luigi De Russis", " Luca Scibetta", ...]
    .map(name => name.trim());  // ["Luigi De Russis", "Luca Scibetta", ...]

/* 3. Costruzione degli acronimi */
const records = users.map(fullname => {
    const acronym = fullname
        .split(" ")                         // ["Luigi", "De", "Russis"]
        .map(word => word[0].toUpperCase())
        .join("");                          // "LDR"
    return { acronym, fullname };           // oggetto con entrambi i dati
});

/* 4. Extra: ordinamento alfabetico per acronimo */
records.sort((a, b) => a.acronym.localeCompare(b.acronym));

/* 5. Stampa del risultato */
console.log("Acronimo -> Nome completo");
records.forEach(r => console.log(`${r.acronym} -> ${r.fullname}`));
