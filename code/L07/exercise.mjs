// import utili per gestione database e date
import sqlite from 'sqlite3';
import dayjs from 'dayjs';

// creazione db
const db = new sqlite.Database('questions.sqlite', (err) => {
    if (err) throw err;
}); // nome db + callback per gestire errore (database non esistente)

// Costruttore oggetto Question
function Question(id, text, email, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);

    // getAnswers(): voglio tutte le risposte a una data domanda (parametri non necessari)
    this.getAnswers = () => {
        // Ritorno una Promise con resolve e reject
        return new Promise((resolve, reject) => {
            // query: esplicito i campi da avere nel risultato
            const sql = 'SELECT answer.id, answer.text, user.email, date, score FROM answer, user WHERE answer.questionId = ? AND answer.authorId = user.Id'; // ? (placeholder): viene sostituito dai parametri passati all'interrogazione del db
            db.all(sql, [this.id], (err, rows) => {
                // se errore, chiamo reject
                if(err)
                    reject(err);
                // altrimenti stampo 
                else{
                    // Per ogni oggetto della risposta, creo un nuovo oggetto Answer
                    const answers = rows.map((ans) => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));
                    resolve(answers); // con questo resolve, esegue il metodo che c'è nella then
                }
            }) 
        })
    }
}

// Costruttore oggetto Answer, con score iniziale pari a 0
function Answer(id, text, email, date, score = 0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.score = score
}

// metodo fatto apposta, bisognerebbe avere un metodo che recuepera le domande
let fake = new Question(1, '', '', '');

console.log(fake.getAnswers().then(results => console.log(results))); // then riceve ciò che viene passato da resolve, messo in results e tramite arrow function stampato in forma grezza

// con async/await

async function main() {
    let fake = new Question(1, '', '', '');
    //fake.getAnswers().then(results => console.log(results));
    const results = await fake.getAnswers();
}
