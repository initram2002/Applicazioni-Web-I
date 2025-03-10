import sqlite from 'sqlite3';

// Creo un oggetto sqlite che contiene il db
const db = new sqlite.Database('questions.sqlite', (err) => {
    if (err) throw err;
}); // nome db + callback per gestire errore (database non esistente)

let sql = 'SELECT * FROM answer'; // query
let results = []; // variabile risultate (array)

db.all(sql, (err, rows) => { // stampa tutte le righe della tabella
    if (err) throw err; // se errore, lancialo

    for (let row of rows){
        console.log(row) // per ogni riga stampo la riga trovata dalla query
        results.push(row)
    }
    
}); // no parametri -> [] (oppure non metto proprio []), poi callback con due parametri -> (errore, risultato che contiene i dati su più righe)
console.log('***+*')

for (let r of results) // stessa logica di console.log(row), ma prima inserisco le righe in un oggetto e finita la all stampo tutto
    console.log(r)
// Non stampa nulla, la query è asincrona, il programma apre il db, crea la stringa della query, crea results vuoto, chiama db.all e mentre la callback asincrona di db.all viene eseguita, vengono chiamate le righe relative alla stampa di results
// Queste operazioni sono veloci, stampano ma results è ancora vuoto, perché la query è ancora in corso, una volta finita però results è già stato stampato e il programma termina
// Qualsiasi operazione che manipola il db va fatta nella callback

// Se ci fosse un'altra query devo farla nella callback, perché deve succedere tutto in maniera sequenziale