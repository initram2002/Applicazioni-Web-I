import dayjs from 'dayjs';
import { db } from './database.mjs';

/** ---------- Answer model ---------- **/
export function Answer(id, text, email, userId, date, score = 0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.userId = userId;
    this.date = dayjs(date);
    this.score = score;
}

/** ---------- Questoin model ---------- **/
export function Question(id, text, email, userId, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.userId = userId;
    this.date = dayjs(date);

    /* (3) ottieni tutte le risposte */
    this.getAnswers = () => new Promise((res, rej) => {
        const sql = `SELECT a.id, a.text, u.email, a.authorId, a.date, a.score
                     FROM answer a JOIN user u ON a.authorId = u.id
                     WHERE a.questionId = ?`;
        db.all(sql, [this.id], (err, rows) => {
            if (err)
                return rej(err);
            res(rows.map(r => new Answer(r.id, r.text, r.email, r.authorId, r.date, r.score)));
        });
    });

    /* (4) aggiungi risposta */
    this.addAnswer = answer => new Promise((res, rej) => {
        const sql = `INSERT INTO answer (text, authorId, date, score, questionId)
                     VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [answer.text, answer.userId, answer.date.format(), answer.score, this.id], function(err) {
            if (err)
                return rej(err);
            res(this.lastID);   // nuovo id risposta
        });
    });

    /* (5) voto risposta */
    this.voteAnswer = (answerId, value) => new Promise((res, rej) => {
        const delta = (value === 'up') ? 1 : -1;
        const sql = `UPDATE answer SET score = score + ?
                     WHERE id = ?`;
        db.run(sql, [delta, answerId], function (err) {
            if (err)
                return rej(err);
        res(this.changes);  // 1 se ok, 0 se id inesistente
        });
    });
}

/** ---------- QuestionList ---------- **/
export function QuestionList() {

    /* (1) recupera domanda per id */
    this.getQuestion = id => new Promise((res, rej) => {
        const sql = `SELECT q.id, q.text, u.email, q.authorId, q.date
                     FROM question q JOIN user u ON q.authorId = u.id
                     WHERE q.id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) 
                return rej(err);
            if (!row)
                return res(undefined);
            res(new Question(row.id, row.text, row.email, row.authorId, row.date));
        });
    });

    /* (2) inserisci nuova domanda */
    this.addQuestion = question => new Promise((res, rej) => {
        const sql = `INSERT INTO question (text, authorId, date)
                     VALUES (?, ?, ?)`;
        db.run(sql, [question.text, question.userId, question.date.format()], function (err) {
            if (err)
                return rej(err);
            res(this.lastID);   // nuovo id domanda
        });
    });
}

/* ----------- Esempio di uso ----------- */
async function main() {
    const ql = new QuestionList();
    const newQ = new Question(undefined, 'Che cos\'è Node.js?', 'alice@example.com', 1, dayjs());
    const qId = await ql.addQuestion(newQ);

    const q = await ql.getQuestion(qId);
    await q.addAnswer(new Answer(undefined, 'Un runtime JS server-side', 'bob@example.com', 2, dayjs()));
    const answers = await q.getAnswers();
    console.log(answers);
}

main().catch(console.error);
