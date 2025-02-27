"use strict";

// oggetto: ne definisco le proprietà
const movie = {
    title: 'Forrest Gump',
    genre: 'Drama',
    duration: 142
};

console.log(movie);

/**
 * Rappresentazione grezza:
 * { title: 'Forrest Gump', genre: 'Drama', duration: 142 }
 */

console.log(movie.title);

/**
 * Output:
 * Forrest Gump
 */

// Costruzione oggetto movie e istanziazione con construction function
function Movie(title, genre, duration){
    this.title = title;
    this.genre = genre;
    this.duration = duration;
    this.isLong = () => this.duration > 120; // metodo, se duration > 120, isLong = true, altrimenti isLong = false (fa la return di duration > 120)
    // equivalente a: 
    // this.isLong = () => {return this.duration > 120};
}; // object function come classe

// Creo un'istanza dell'oggetto
let forrest = new Movie("Forrest Gump", "Drama", 142);

console.log(forrest.isLong()); // () perché eseguo la funzione, ovvero una nested function dentro Movie
// is long non può essere chiamata al di fuori del Movie

/**
 * Output:
 * true
 */