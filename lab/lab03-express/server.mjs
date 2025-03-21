/**
 * What it does:
 * 
 * - Imports FilmDao and UserDao DAOs, and other dependencies (express, morgan, express-validator, etc.).
 * - Configures express to log requests (with morgan("dev")) and to process JSON in the body of requests (express.json()).
 * - Defines the main HTTP routes (GET, POST, PUT, DELETE methods) to handle movies.
 * - Checks the validity of some fields (e.g., title, isFavorite, watchDate, rating and userId).
 * - Handles errors with appropriate JSON messages and status codes.
 */

/**Importing needed modules */
import FilmDao from "./dao-films.mjs"; // module for accessing the films table in the DB
import UserDao from "./dao-users.mjs";
import express from "express";
import morgan from "morgan";
import {check, validationResult} from "express-validator"; // validation middleware
import Film from "./Film.mjs";

/*** Init express and set up the middlewares ***/
const app = express();
app.use(morgan("dev"));
app.use(express.json());

const filmDao = new FilmDao();
const userDao = new UserDao();

/*** Utility Functions ***/

const filmValidation = [
    check("title").isString().notEmpty(),
    check("isFavorite").isBoolean().optional(),
    check("watchDate").optional({nullable: true}).isISO8601({strict: true}).toDate(), // valid ISO date, without time
    check("rating").optional({nullable: true}).isInt({min: 1, max: 5}),
    validateUserId
];

async function validateUserId(req, res, next) {
    const {userId} = req.body;

    try {
        const result = await userDao.getUser(userId);
        if (result.error) 
            res.status(404).json(result).end();
        else
            next();
    } catch (err) {
        res.status(500).json({error: err.message}).end();
    }
}

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};

/*** Films APIs ***/
// 1. Retrieve the list of all the available films
// GET /api/films
// This route returns the FilmLibrary. It handles also "filter = ?" query parameter
app.get("/api/films",
    (req, res) => {
        // Get films that match optional filter in the query
        filmDao.getFilms(req.query.filter)
            // Note: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
            .then(films => res.json(films))
            .catch((err) => res.status(500).json(err)); // always return a json and an error message
    }
);

// 2. Retrieve a film, given its "id"
// GET /api/films/<id>
// Given a film id, this route returns the associated film from the library
app.get("/api/films/:id",
    async (req, res) => {
        try{
            const result = await filmDao.getFilm(req.params.id);
            if (result.error)
                res.status(404).json(result);
            else
                // Note: "invalid dates" (i.e. missing dates) are set to null during JSON serialization
                res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    }
);

// 3. Create a new film, by providing all relevant information
// POST /api/films
// This route adds a new film to film library. The film can be created even specifying only its "title"
app.post("/api/films",
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty())
            return onValidationErrors(invalidFields, res);

        const isFavorite = req.body.isFavorite ? req.body.isFavorite : false;
        const watchDate = req.body.watchDate ? req.body.watchDate : null;
        const rating = req.body.rating ? req.body.rating : null;
        const film = new Film(undefined, req.body.title, isFavorite, rating, watchDate, req.body.userId);

        try {
            const result = await filmDao.addFilm(film); // Note: addFilm returns the new created object 
            res.json(result);
        } catch (err) {
            res.status(500).json({error: `Database error during creation of new film: ${err}`});
        }
    }
);

// 4. Update an existing film, by providing all the relevant information
// PUT /api/films/<id>
// This route allows to modify a film, specifying its id and the necessary data
app.put("/api/films/:id",
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty())
            return onValidationErrors(invalidFields, res);

        const film = new Film(Number(req.params.id), req.body.title, req.body.isFavorite, req.body.rating, req.body.watchDate, req.body.userId);

        try {
            const result = await filmDao.updateFilm(film.id, film);
            if (result.error)
                res.status(404).json(result);
            else
                res.json(result);
        } catch (err) {
            res.status(500).json({error: `Database error during the update of film ${req.params.id}: ${err}`});
        }
    }
);

// 5. Mark an existing film as favorite/unfavorite
// PUT /api/films/:id/favorite
// This route changes only the favorite value. It could also be a PATCH
app.put("/api/films/:id/isFavorite",
    [
        check("isFavorite").isBoolean(),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty())
            return onValidationErrors(invalidFields, res);

        try {
            const film = await filmDao.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            film.isFavorite = req.body.isFavorite; // update isFavorite property
            const result = await filmDao.updateFilm(film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(500).json({error: `Database error during the isFavorite update of film ${req.params.id}`});
        }
    }
);

// 6. Update the rating of a specific film
// PUT /api/films/:id/rating
// This route changes only the rating value. It could also be a PATCH
app.put("/api/films/:id/rating",
    [
        check("rating").optional({nullable: true}).isInt({min: 1, max: 5})
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty())
            return onValidationErrors(invalidFields, res);

        try {
            const film = await filmDao.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            // Update rating property
            film.rating = req.body.rating || null; // if req.body is falsy, null is assigned
            const result = await filmDao.updateFilm(film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the rating update of film ${req.params.id}`});
        }
    }
);

// 7. Delete an existing film, given its "id"
// DELETE /api/films/:id
// Given a film id, this route deletes the associated film from the library
app.delete("/api/films/:id",
    async (req, res) => {
        try{
            // Note: if there is no film with the specified id, the delete operation is considered successful
            await filmDao.deleteFilm(req.params.id);
            res.status(200).end();
        } catch (err) {
            res.status(500).json({error: `Database error during the deletion of film ${req.params.id}: ${err}`});
        }
    }
);

// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));