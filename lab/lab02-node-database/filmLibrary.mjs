import dayjs from 'dayjs';
import sqlite from 'sqlite3';

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
        const numberOfFilms = this.films.length;

        this.films = this.films.filter(f => f.id !== id);

        if (this.films.length === numberOfFilms) 
            throw new Error("No films deleted: this id doesn't exist.");
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

    this.getFilms = () => {
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM films";
            db.all(sql, (err, rows) => {
                if (err)
                    reject(err)
                else {
                    const films = rows.map((film) => new Film(film.id, film.title, film.isFavorite, film.watchDate, film.rating, film.userId));
                    resolve(films);
                }
            });
        });
    }
}

const db = new sqlite.Database("films.db", (err) => {
    if (err)
        throw err;
});

async function main() {
    // Lab 01
    const film1 = new Film(1, "Pulp Fiction", true, "2024-03-10", 5);
    const film2 = new Film(2, "21 Grams", true, "2024-03-17", 4);
    const film3 = new Film(3, "Star Wars", false);
    const film4 = new Film(4, "Matrix", false)
    const film5 = new Film(5, "Shrek", false, "2024-03-21", 3)
    const filmLibrary = new FilmLibrary();

    filmLibrary.addNewFilm(film1);
    filmLibrary.addNewFilm(film2);
    filmLibrary.addNewFilm(film3);
    filmLibrary.addNewFilm(film4);
    filmLibrary.addNewFilm(film5);

    console.log("*** List of films ****");

    filmLibrary.films.forEach((film) => console.log(film.toString()));

    console.log("*** List of films (sorted by watch date) ***");

    filmLibrary.sortByDate().forEach((film) => console.log(film.toString()));

    console.log("*** List of films (after removing film with filmId = 1) ***");

    filmLibrary.deleteFilm(1);
    filmLibrary.films.forEach((film) => console.log(film.toString()));
    filmLibrary.addNewFilm(film1);

    console.log("*** List of films (after removing all watch dates) ***");

    filmLibrary.resetWatchedFilms();
    filmLibrary.films.forEach((film) => console.log(film.toString()));

    console.log("*** List of films (only rated ones) ***")
    filmLibrary.getRated().forEach((film) => console.log(film.toString()));

    // Lab 02
    console.log(await filmLibrary.getFilms());
}

main()