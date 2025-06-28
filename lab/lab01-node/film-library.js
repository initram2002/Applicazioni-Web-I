"use strict";

const dayjs = require("dayjs");

/* ===== Model ===== */
function Film(id, title, favourite = false, watchDate = null, rating = null, user = 1) {
    this.id = id;
    this.title = title;
    this.favourite = favourite;
    this.watchDate = watchDate ? dayjs(watchDate) : null;   // oggetti immutabili
    this.rating = rating;
    this.user = user;                                       // intero 1-5 o null
    
    this.toString = () => {
        const dateStr = this.watchDate ? this.watchDate.format("MMMM D, YYYY") : "-";
        const scoreStr = this.rating ?? "-";
        return `Id: ${this.id}, Title: ${this.title}, Favourite: ${this.favourite}, Watch date: ${dateStr}, Score: ${scoreStr}, User: ${this.user}`; 
    };
}

/* ===== Collection ===== */
function FilmLibrary() {
    this.list = [];

    this.addNewFilm = (film) => {
        this.list.push(film);
    };

    /* Utility: stampa completa della libreria */
    this.print = () => {
        this.list.forEach(f => console.log(f.toString()));
    };
}

/* ===== Demo ===== */
const library = new FilmLibrary();

library.addNewFilm(new Film(1, "Pulp Fiction", true, "2024-03-10", 5));
library.addNewFilm(new Film(2, "21 Grams", true, "2024-03-17", 4));
library.addNewFilm(new Film(3, "Star Wars", false, null, null));
library.addNewFilm(new Film(4, "Matrix", false, null, null));
library.addNewFilm(new Film(5, "Shrek", false, "2024-03-21", 3));

library.print();
