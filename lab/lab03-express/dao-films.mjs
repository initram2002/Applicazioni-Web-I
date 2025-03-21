/* Data Access Object (DAO) module for accessing films data */

/**
 * In this file we find all the functions to interface to the films table in the database:
 * 
 * - getFilms(filter): fetches all movies; if a recognized filter is provided among the filters defined in filters, it applies a client-side filter (so after reading all the data from the DB) and returns only the matching movies.
 * - getFilm(id): returns a single movie with matching ID, or {error: "Movie not found."} if it does not exist.
 * - addFilm(film): inserts a new record in films; then updates film.id with this.lastID from SQLite (i.e., the auto-generated ID from the DB).
 * - updateFilm(id, film): updates the record with the given ID, if it exists. Otherwise it returns {error: "Film not found."}.
 * - deleteFilm(id): deletes the movie with indicated ID (if it does not exist, the operation "does nothing").
 */

import db from "./db.mjs";
import Film from "./Film.mjs";
import dayjs from 'dayjs';

function mapRowsToFilms(rows) {
    // Note: the parameters must follow the same order specified in the constructor
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.rating, row.watchDate, row.userId));
}

const filters = {
    'filter-favorite': {label: 'Favorites', filterFunction: film => film.isFavorite},
    'filter-best': {label: 'Best Rated', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': {label: 'Seen Last Month', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen': {label: 'Unseen', filterFunction: film => !film.watchDate}
};

const isSeenLastMonth = (film) => {
    if ('watchDate' in film && film.watchDate) { // Accessing watchDate only if defined
        const diff = film.watchDate.diff(dayjs(), 'month');
        const isLastMonth = diff <= 0 && diff > -1; // Last month
        return isLastMonth;
    }
};

// Note: all functions return error messages as json objects { error: <string> }
export default function FilmDao() {
    // Function to retrieve the whole list of films from the database
    this.getFilms = (filter) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";
            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const films = mapRowsToFilms(rows);

                    if (filters.hasOwnProperty(filter))
                        resolve(films.filter(filters[filter].filterFunction));
                    else // If an invalid filter is specified, all the films are returned
                        resolve(films);
                }
            });
        });
    };

    // This function retrieves a film given its id and the associated user id
    this.getFilm = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE id = ?";
            db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err);
                if (row === undefined)
                    resolve({error: "Film not found."});
                else
                    resolve(mapRowsToFilms([row])[0]);
            });
        });
    };

    /**
     * This function adds a new film in the database.
     * The film id is added automatically by the DB, and it is returned as this.lastID.
     */
    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO films (title, isFavorite, rating, watchDate, userId) VALUES (?, ?, ?, ?, ?)";
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating;
            if (!film.rating || film.rating < 1 || film.rating > 5) 
                rating = null;
            else
                rating = film.rating;

            db.run(sql, [film.title, film.isFavorite, rating, watchDate, film.userId], function (err) {
                if (err)
                    reject(err);
                film.id = this.lastID;
                resolve(film);
            });
        });
    };

    // This function updates an existing film given its id and the new properties
    this.updateFilm = (id, film) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET title = ?, isFavorite = ?, rating = ?, watchDate = ? WHERE id = ?";
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating;
            if (!film.rating || film.rating < 1 || film.rating > 5)
                rating = null;
            else
                rating = film.rating;

            db.run(sql, [film.title, film.isFavorite, rating, watchDate, id], function (err) {
                if (err)
                    reject(err);
                if (this.changes !==1) 
                    resolve({error: "Film not found."});
                else
                    resolve(film);
            });
        });
    };

    // This function deletes an existing film given its id
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE id = ?";
            db.run(sql, [id], function (err){
                if (err)
                    reject(err);
                else
                    resolve(this.changes);
            });
        });
    };
}
