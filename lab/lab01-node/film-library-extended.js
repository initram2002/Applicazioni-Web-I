"use strict";
const dayjs = require("dayjs");

/* ===== Model ===== */
function Film(id, title, favorite = false, watchDate = null, rating = null, user = 1) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watchDate = watchDate ? dayjs(watchDate) : null;
    this.rating = rating;
    this.user = user;

    this.toString = () => {
        const dateStr = this.watchDate ? this.watchDate.format("MMMM D, YYYY") : "-";
        const scoreStr = this.rating ?? "-";
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${dateStr}, Score: ${scoreStr}, User: ${this.user}`;
    };
}

/* ===== Collection ===== */
function FilmLibrary() {
    this.list = [];

    /* Inserimento */
    this.addNewFilm = film => {
        this.list.push(film);
    }

    /* 1. Ordinamento per data */
    this.sortByDate = () => {
        return [...this.list].sort((a, b) => {
            if (a.watchDate === null && b.watchDate === null)
                return 0;
            if (a.watchDate === null)
                return 1;   // a non visto -> dopo
            if (b.watchDate === null)
                return -1;  // b non visto -> dopo
            return a.watchDate.isAfter(b.watchDate) ? 1 : -1;
        });
    };

    /* 2. Cancellazione per id */
    this.deleteFilm = id => {
        this.list = this.list.filter(f => f.id !== id);
    };

    /* 3. Reset di tutte le date di visione */
    this.resetWatchedFilms = () => {
        this.list.forEach(f => {
            f.watchDate = null
        });
    };

    /* 4. Selezione dei film valutati */
    this.getRated = () => {
        return this.list
            .filter(f => f.rating != null && f.rating > 0)
            .sort((a, b) => b.rating - a.rating); 
    };

    /* Utilità per stampa */
    this.print = films => films.forEach(f => console.log(f.toString()));
}

/* ===== Demo ===== */
const libary = new FilmLibrary();
libary.addNewFilm(new Film(1, "Pulp Fiction", true, "2024-03-10", 5));
libary.addNewFilm(new Film(2, "21 Grams", true, "2024-03-17", 4));
libary.addNewFilm(new Film(3, "Star Wars", false, null, null));
libary.addNewFilm(new Film(4, "Matrix", false, null, null));
libary.addNewFilm(new Film(5, "Shrek", false, "2024-03-21", 3));

console.log("***** List sorted by date *****");
libary.print(libary.sortByDate());

console.log("\n>>> Delete film id=3");
libary.deleteFilm(3);
libary.print(libary.list);

console.log("\n>>> Reset watch dates");
libary.resetWatchedFilms();
libary.print(libary.list);

console.log("\n***** Films filtered - rated only *****");
libary.print(libary.getRated());
