// import
import express, {json} from 'express';
import morgan from 'morgan';
import { listQuestions } from './dao.mjs';

// init
const app = express();
const port = 3001;

//middleware
app.use(json());
app.use(morgan('dev')); // mostra tutte le informazioini necessarie allo sviluppo

/* ROUTE */

// GET /api/questions
app.get('/api/question', (request, response) => {
    listQuestions() // ritorna una promise
        .then(questions => response.json(questions))
        .catch(() => response.status(500).end()); // imposta lo status, end invia lo status e fa partire l'errore
})

// start server
app.listen(port, () => {console.log("API server started");});