import dayjs from "dayjs"; // VSCode segna gli import non utilizzati come fosse "spento"

function Answer(text, username, date, score = 0) { // se non viene passato uno score, di default è assegnato 0 (utile per risposte appena inserite che non hanno ancora un punteggio)
    this.text = text;
    this.username = username
    this.score = score;
    this.date = dayjs(date); // oggetto data rappresentato da dayjs

    this.toString = () => { // decidiamo noi come formattare il toString
        return `${this.username} replied '${this.text}' on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}`; // aggiunto format della data
    }
}

function Question(text, username, date) { // non passo la lista di risposte, quando creo la domanda non ci sono ancora risposte
    this.text = text;
    this.username = username;
    this.date = dayjs(date);

    // creo la lista di risposte (array vuoto) all'interno del costruttore (inizializzo)
    this.answers = [];

    // creo il metodo add all'interno di Question
    this.add = (answer) => { // arrow function, faccio una push della risposta passata nell'array di risposte, con le parentesi {} viene solo eseguita l'operazione all'interno e non vengono restituiti valori
        this.answers.push(answer)
    } 

    this.find = (username) => { // restituisce tutte le risposte associate a un certo username
        const foundAnswers = [];

        // con i metodi funzionali, tutto in una riga
        for (const answer of this.answers)
            if (answer.username === username)
                foundAnswers.push(answer);

        return foundAnswers;

        // versione con functional methods
        this.answers.filter(answer => answer.username === username); // restituisce un array dove tutti gli elementi soddisfano la condizione

        return foundAnswers;

    }

    this.afterDate = (date) => {
        return this.answers.filter(answer => answer.date.isAfter(date)); // date associato ad answer è già oggetto dayjs, quello passato no, se dovessi fare dayjs(date) e date fosse già dayjs non da errore, conversione aggiuntiva che non causa errore
    }

    this.listByDate = () => {
        // return this.answers.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1); // se la data di a è dopo della data di b, restituisce 1, altrimenti -1 (date crescenti)
        // se sono uguali ritorna -1 (ma rimangono nello stesso posto)
        // problema: this.answers viene riordinato in place, perdo l'ordine originale, devo creare una copia
        return [...this.answers].sort((a, b) => a.date.isAfter(b.date) ? 1 : -1);
    } 

    this.listByScore = () => {
        return [...this.answers].sort((a, b) => b.score - a.score); // ordinamento risposte decrescente
    }
}

// per non passare score:
const ans = new Answer('testo', 'Michela','2025-03-12');
// per questo motivo, i dati con un valore di default dovrebbero essere in fondo

// creo la domanda
const question = new Question('Is JavaScript better than Python?', 'Michela Martini', '2025-02-03');

// creo quattro risposte
const firstAnswer = new Answer('Yes', 'Lorenzo Marra', '2025-02-04', -10);
const secondAnswer = new Answer('Not in a million year', 'Ines', '2025-03-01', 5);
const thirdAnswer = new Answer('No', 'Bianca Ferraioli', '2025-03-02');
const fourthAnswer = new Answer('I don\'t know', 'Lorenzo Marra', '2025-03-01');

// aggiungo le risposte alla relativa domanda
question.add(firstAnswer);
question.add(secondAnswer);
question.add(thirdAnswer);
question.add(fourthAnswer);

// cerco le risposte date da Lorenzo
const answersByLorenzo = question.find('Lorenzo Marra');

// stampo la domanda
console.log(question);

// stampo le risposte date da Lorenzo
console.log('\n Answers by Lorenzo: ' + answersByLorenzo);

// stampo listByDate, listByScore, listAfterDate
console.log('\n By date: ' + question.listByDate());
console.log('\n By score: ' + question.listByScore());
console.log('\n After 2025-02-28: ' + question.afterDate('2025-02-28'));
// forniscono rappresentazioni grezze, non ci sono refactor del metodo toString 

/**Output: (la data delle risposte non la fa vedere perché siamo a un livello troppo annidato)
 * Question {
  text: 'Is JavaScript better than Python?',
  username: 'Michela Martini',
  date: M {
    '$L': 'en',
    '$d': 2025-02-02T23:00:00.000Z,
    '$y': 2025,
    '$M': 1,
    '$D': 3,
    '$W': 1,
    '$H': 0,
    '$m': 0,
    '$s': 0,
    '$ms': 0,
    '$x': {},
    '$isDayjsObject': true
  },
  answers: [
    Answer {
      text: 'Yes',
      username: 'Lorenzo Marra',
      score: -10,
      data: [M]
    },
    Answer {
      text: 'Not in a million year',
      username: 'Ines',
      score: 5,
      data: [M]
    },
    Answer {
      text: 'No',
      username: 'Bianca Ferraioli',
      score: 0,
      data: [M]
      score: 5,
      data: [M]
    },
    Answer {
      text: 'No',
      username: 'Bianca Ferraioli',
      score: 0,
      data: [M]
      text: 'No',
      username: 'Bianca Ferraioli',
      score: 0,
      data: [M]
      data: [M]
    },
    Answer {
      text: "I don't know",
      username: 'Lorenzo Marra',
      score: 0,
      data: [M]
    }
  ],
  add: [Function (anonymous)],
  find: [Function (anonymous)],
  afterDate: [Function (anonymous)],
  listByDate: [Function (anonymous)],
  listByScore: [Function (anonymous)]
}

Answers by Lorenzo: [object Object],[object Object]
Non vediamo il contenuto delle risposte perché abbiamo scritto la stringa "Answers by Lorenzo: " e la conversione a stringa degli oggetti è questa

Se tolgo la stringa "Answers by Lorenzo: ":
[
  Answer {
    text: 'Yes',
    username: 'Lorenzo Marra',
    score: -10,
    data: M {
      '$L': 'en',
      '$d': 2025-02-03T23:00:00.000Z,
      '$y': 2025,
      '$M': 1,
      '$D': 4,
      '$W': 2,
      '$H': 0,
      '$m': 0,
      '$s': 0,
      '$ms': 0,
      '$x': {},
      '$isDayjsObject': true
    }
  },
  Answer {
    text: "I don't know",
    username: 'Lorenzo Marra',
    score: 0,
    data: M {
      '$L': 'en',
      '$d': 2025-02-28T23:00:00.000Z,
      '$y': 2025,
      '$M': 2,
      '$D': 1,
      '$W': 6,
      '$H': 0,
      '$m': 0,
      '$s': 0,
      '$ms': 0,
      '$x': {},
      '$isDayjsObject': true
    }
  }
]

Non è molto carino, creo un refactor del metodo ToString per formattare l'output della risposta
Output:
Lorenzo Marra replied 'Yes' on Mon, 03 Feb 2025 23:00:00 GMT and got a score of -10,Lorenzo Marra replied 'I don't know' on Fri, 28 Feb 2025 23:00:00 GMT and got a score of 0

Dopo format data:
Lorenzo Marra replied 'Yes' on 2025-02-04 and got a score of -10,Lorenzo Marra replied 'I don't know' on 2025-03-01 and got a score of 0
 */