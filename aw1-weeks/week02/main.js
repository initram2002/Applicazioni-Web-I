'use strict';

/* --- Costruttore di Answer --- */
function Answer(text, username, score, date) {
    this.text = text;
    this.username = username;
    this.score = score;
    this.date = date; // istanza di Date
}

/* --- Costruttore di Question --- */
function Question(question, questioner, date) {
    this.question = question;
    this.questioner = questioner;
    this.date = date;
    this.answers = []; // array vuoto in partenza
}

/* Aggiunge una risposta */
Question.prototype.add = function(answer) {
    this.answers.push(answer);
};

/* Trova tutte le risposte di un utente */
Question.prototype.find = function(username) {
    return this.answers.filter(a => a.username === username);
};

/* Risposte dopo una certa data */
Question.prototype.afterDate = function(date) {
    return this.answers.filter(a => a.date >= date);
};

/* Elenco per data crescente */
Question.prototype.listByDate = function() {
    return this.answers
               .slice()                             // copia
               .sort((a, b) => a.date - b.date);    // .sort()
};

/* Elenco per punteggio decrescente */
Question.prototype.listByScore = function() {
    return this.answers
               .slice()
               .sort((a, b) => b.score - a.score);
};

/* ---------- Esempio d'uso ---------- */
const q1 = new Question(
    'Qual è il miglior metodo per studiare JavaScript',
    'alice',
    new Date('2025-06-01')
);

q1.add(new Answer('Fare molta pratica', 'bob', 5, new Date('2025-06-02')));
q1.add(new Answer('Leggere la documentazione MDN', 'carol', 7, new Date('2025-06-03')));
q1.add(new Answer('Seguire i video-tutorial', 'dave', 1, new Date('2025-06-04')));
q1.add(new Answer('Partecipare a progetti open source', 'bob', 3, new Date('2025-06-05')));

console.log('- Risposte di bob -');
console.table(q1.find('bob'));

console.log('- Dopo il 3 giugno -');
console.table(q1.afterDate(new Date('2025-06-03')));

console.log('- Ordinamento per data -');
console.table(q1.listByDate());

console.log('- Ordinamento per score -');
console.table(q1.listByScore());
