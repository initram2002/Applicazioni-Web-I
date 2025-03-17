import dayjs from 'dayjs';
import sqlite from 'sqlite3';

const db = new sqlite.Database("films.db", (err) => {
    if (err)
        console.log("Error opening database:", err.message);
    else
        console.log("Connected to the films.db database.");
});

const db_copy = new sqlite.Database("films copy.db", (err) => {
    if (err)
        console.log("Error opening the copy of the original database:", err.message);
    else
        console.log("Connected to the copy of films.db database.");
});

function Film(id, title, isFavorite = false, watchDate = null, rating = 0, userId = 1) {
    this.id = id;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate && dayjs(watchDate); // Save the value of the date only if this value is truthy (!== null, default value)
    this.rating = rating;
    this.userId = userId;

    this.toString = () => {
        if (this.watchDate === null || this.watchDate === undefined) 
            return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${this.watchDate}, Score: ${this.rating}, User: ${this.userId}`;
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${this.watchDate.format("MMMM DD, YYYY")}, Score: ${this.rating}, User: ${this.userId}`;
    }
}

function FilmLibrary() {
    this.films = [];

    this.addNewFilm = (film) => {
        if (!this.films.some(f => f.id === film.id))
            this.films.push(film);
        else 
            throw new Error("Duplicated Id.");
    };

    this.sortByDate = () => {
        const dateSortedFilms = [...this.films];

        dateSortedFilms.sort((film1, film2) => {
            if (!film1.watchDate)
                return 1;
            if (!film2.watchDate)
                return -1;
            return film1.watchDate.diff(film2.watchDate, 'day');
        });

        return dateSortedFilms;
    };

    this.deleteFilm = (id) => {
        const filmsFiltered = this.films.filter(function(film) {
            return film.id !== id;
        });

        this.films = filmsFiltered;
    };

    this.resetWatchedFilms = () => {
        this.films.forEach((film) => delete film.watchDate);
    };

    this.getRated = () => {
        let ratedFilms = [...this.films];

        ratedFilms.sort((film1, film2) => {
            if (!film1.rating)
                return 1;
            if (!film2.rating)
                return -1;
            return film2.rating - film1.rating;
        });

        ratedFilms = ratedFilms.filter(f => f.rating !== 0);

        return ratedFilms;
    }

    this.getAllStoredFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";

            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.getAllFavoriteFilms = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE isFavorite = 1";

            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.getFilmsWatchedToday = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate = ?";

            db.all(sql, [dayjs().format("YYYY-MM-DD")], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.getFilmsWatchedBeforeDate = (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate < ?";

            db.all(sql, [dayjs(date).format("YYYY-MM-DD")], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.getFilmsRatingGreaterEqualThan = (rating) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE rating >= ?";

            db.all(sql, [rating], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.getFilmsByString = (string) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE title LIKE ?";

            db.all(sql, [`%${string}%`], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId)));
            });
        });
    };

    this.storeNewMovie = (film) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO films (id, title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?, ?)";

            const params = [film.id, film.title, film.isFavorite, film.watchDate.format("YYYY-MM-DD"), film.rating, film.userId];

            db_copy.run(sql, params, function(err) {
                if (err)
                    reject(err);
                else   
                    resolve();
            });
        });
    };
    
    this.deleteMovie = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE id = ?";

            db_copy.run(sql, [id], function(err) {
                if (err)
                    reject(err);
                else
                    if (this.changes > 0)
                        resolve();
                    else
                        reject(new Error("No films found with the given id."));
            });
        });
    };

    this.deleteWatchDate = () => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET watchDate = ?";

            db_copy.run(sql, [null], function(err) {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        })
    };
}

async function main() {
    // Lab 01

    // Ex 1

    // Creating some film entries
    const film1 = new Film(1, "Pulp Fiction", true, "2024-03-10", 5);
    const film2 = new Film(2, "21 Grams", true, "2024-03-17", 4);
    const film3 = new Film(3, "Star Wars", false);
    const film4 = new Film(4, "Matrix", false)
    const film5 = new Film(5, "Shrek", false, "2024-03-21", 3)

    // Adding the films to the film library
    const filmLibrary = new FilmLibrary();

    filmLibrary.addNewFilm(film1);
    filmLibrary.addNewFilm(film2);
    filmLibrary.addNewFilm(film3);
    filmLibrary.addNewFilm(film4);
    filmLibrary.addNewFilm(film5);

    // Print films
    console.log("*** List of films ****");
    filmLibrary.films.forEach((film) => console.log(film.toString()));

    // Ex 2

    // Print sorted films
    console.log("*** List of films (sorted) ***");
    const sortedFilms = filmLibrary.sortByDate();
    sortedFilms.forEach((film) => console.log(film.toString()));

    // Deleting film #3
    filmLibrary.deleteFilm(3);

    // Reset dates
    filmLibrary.resetWatchedFilms();

    // Printing modified Library
    console.log("*** List of films ***");
    filmLibrary.films.forEach((film) => console.log(film.toString()));

    // Retrieve and print films with an assigned rating
    console.log("*** Films filtered, only the rated ones ***");
    const ratedFilms = filmLibrary.getRated();
    ratedFilms.forEach((film) => console.log(film.toString()));

    // Lab 02

    // Ex 1

    // a. Print all the stored films
    await filmLibrary.getAllStoredFilms()
        .then((films) => {
            console.log("*** All stored films ***");
            if (films.length === 0)
                console.log("No films yet, try later.");
            else
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error("Error retrieving all films:", err);
        });

    // b. Print all favorite films
    await filmLibrary.getAllFavoriteFilms()
        .then((films) => {
            console.log("*** All favorite films ***");
            if (films.length === 0)
                console.log("No favorite films yet, try later.");
            else
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error("Error retrieving all favorite films:", err);
        });

    // c. Print all films watched today
    await filmLibrary.getFilmsWatchedToday()
        .then((films) => {
            console.log("*** All films watched today ***");
            if (films.length === 0)
                console.log(" No films watched today, time to watch one?");
            else
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error("Error retrieving all films watched today:", err);
        });

    // d. Print films whose watch date is earlier than a given date
    const date = "2024-03-21";
    await filmLibrary.getFilmsWatchedBeforeDate(date)
        .then((films) => {
            console.log(`*** All films watched before ${date} ***`);
            if (films.length === 0)
                console.log(`No films watched before ${date}, sorry.`);
            else
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error(`Error retrieving all films watched before ${date}:`, err);
        });

    // e. Print all films whose rating is greater or equal to a given number
    const rating = 4;
    await filmLibrary.getFilmsRatingGreaterEqualThan(rating)
        .then((films) => {
            console.log(`*** All films with rating >= ${rating} ***`);
            if (films.length === 0)
                console.log("No films with this rating, yet.");
            else 
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error(`Error retrieving all films with rating >= ${rating}:`, err);
        });

    // f. Print all films whose title contains a given string
    const string = "ar";
    await filmLibrary.getFilmsByString(string)
        .then((films) => {
            console.log(`*** All films containing '${string}' ***`);
            if (films.length === 0)
                console.log(`No films with the word ${string} in the title.`);
            else
                films.forEach((film) => console.log(film.toString()));
        })
        .catch((err) => {
            console.error(`Error retrieving all films containing ${string}:`, err);
        });

    // Ex 2

    // a. Store a new movie into the database
    const newMovie = new Film(6, "The Dark Knight", true, "2024-03-25", 5, 1);
    await filmLibrary.storeNewMovie(newMovie)
        .then(() => {
            console.log("[SUCCESS] Film inserted successfully:", newMovie.id);
        })
        .catch((err) => {
            console.error("[FAILURE] Error inserting film:", err.message);
        });

    // b. Delete a movie from the database
    const movieToDelete = 4;
    await filmLibrary.deleteMovie(movieToDelete)
        .then(() => {
            console.log(`[SUCCESS] Film deleted successfully: ${movieToDelete}`);
        })
        .catch((err) => {
            console.log("[FAILURE] Error deleting film:", err.message);
        });

    // c. Delete the watch date of all films stored in the database
    await filmLibrary.deleteWatchDate()
        .then(() => {
            console.log("[SUCCESS] Watch dates deleted successfully.");
        })
        .catch((err) => {
            console.log("[FAILURE] Error deleting watch dates:", err.message);
        });

    db.close((err) => {
        if (err)
            console.log("Error closing the database:", err.message);
        else
            console.log("Database connection closed.");
    });

    debugger;
}

main()