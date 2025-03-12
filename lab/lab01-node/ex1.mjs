import dayjs from 'dayjs'

function Film(filmId, title, favorite = false, date = null, rating = 0, personId = 1) {
    this.filmId = filmId;
    this.title = title;
    this.favorite = favorite;
    this.date = date && dayjs(date); // Save the value of the date only if this value is truthy (!== null, default value)
    this.rating = rating;
    this.personId = personId;

    this.toString = () => {
        if (date === null) 
            return `Id: ${this.filmId}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${this.date}, Score: ${this.rating}, User: ${this.personId}`;
        return `Id: ${this.filmId}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${this.date.format("MMMM DD, YYYY")}, Score: ${this.rating}, User: ${this.personId}`;
    }
}

function FilmLibrary() {
    this.films = [];

    this.addNewFilm = (film) => {
        if (!this.films.some(f => f.filmId === film.filmId))
            this.films.push(film);
        else 
            throw new Error("Duplicated Id.");
    };
}

function main() {
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
}

main()