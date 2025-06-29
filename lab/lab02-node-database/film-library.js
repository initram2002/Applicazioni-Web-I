"use strict";
const dayjs = require("dayjs");
const sqlite = require ("sqlite3");

// Connessione condivisa
const db = new sqlite.Database('films.db', (err) => {
    if (err)
        throw err;
});

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

    /* Utility: stampa completa della libreria */
    this.print = () => {
        this.list.forEach(f => console.log(f.toString()));
    }; 
    
    // 1. Tutti i film
    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";
            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map(r => new Film(r.id, r.title, !!r.favorite, r.watchDate, r.rating, r.user)));
            });
        });
    };

    // 2. Preferiti
    this.getFavorites = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE isFavorite = 1"; 
            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map(r => new Film(r.id, r.title, true, r.watchDate, r.rating, r.user)));
            });
        });
    };

    // 3. Visti oggi
    this.getWatchedToday = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE DATE(watchDate) = DATE('now')";
            db.all(sql, [], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map(r => new Film(r.id, r.title, !!r.favorite, r.watchDate, r.rating, r.user)));
            });
        });
    };

    // 4. Visti prima di una data
    this.getWatchedBefore = (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate < ?";
            db.all(sql, [date], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map(r => new Film(r.id, r.title, !!r.favorite, r.watchDate, r.rating, r.user)));
            });
        });
    };

    // 5. Valutazione minima
    this.getRatedAtLeast = (rating) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE rating >= ?";
            db.all(sql, [rating], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows.map(r => new Film(r.id, r.title, !!r.favorite, r.watchDate, r.rating, r.user)));
            });
        });
    };

    // 6. Titolo contenente stringa
    this.getFilmsByTitle = (substr) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE title LIKE '%' || ? || '%'";
            db.all(sql, [substr], (err, rows) => {
                if (err)
                    reject(err);
                else 
                    resolve(rows.map(r => new Film(r.id, r.title, !!r.favorite, r.watchDate, r.rating, r.user)));
            });
        });
    };

    /** 1. Inserimento di un nuovo film */
    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO films(title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?)";
            db.run(sql, [film.title, film.favorite ? 1 : 0, film.watchDate ? film.watchDate.format('YYYY-MM-DD') : null, film.rating, film.user], function(err) { // callback *non* arrow
                if (err) {
                    console.error('❌ Inserimento fallito:', err.message);
                    reject(err);
                }
                else {
                    resolve(console.log(`✅ Film inserito con id ${this.lastID}`));
                    resolve(this.lastID);
                }
            });
        });
    };

    /** 2. Cancellazione di un film tramite id */
    this.deleteFilmDb = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE id = ?";
            db.run(sql, [id], function(err) {
                if (err) {
                    console.error('❌ Cancellazione fallita:', err.message);
                    reject(err);
                }
                else {
                    const msg = this.changes
                        ? `✅ Film #${id} cancellato (righe affette: ${this.changes})`
                        : `⚠️ Nessun film con id ${id}`;
                    console.log(msg);
                    resolve(this.changes);
                }
            });
        });
    };

    /** 3. Azzera la data di visione per tutti i film */
    this.resetWatchDates = () => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET watchDate = NULL";
            db.run(sql, [], function(err) {
                if (err) {
                    console.error('❌ Reset fallito:', err.message);
                    reject(err);
                }
                else {
                    console.log(`✅ Date di visione rimosse da ${this.changes} film`);
                    resolve(this.changes);
                }
            });
        });
    };
}

/* ===== Demo ===== */
async function demo() {
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

    console.log(">> Tutti");
    (await libary.getAll()).forEach(f => console.log(f.toString()));
    
    console.log("\n>> Preferiti");
    (await libary.getFavorites()).forEach(f => console.log(f.toString()));

    console.log("\n>> Visti oggi");
    (await libary.getWatchedToday()).forEach(f => console.log(f.toString()));

    console.log("\n>> Visti prima del 2024");
    (await libary.getWatchedBefore("2024-01-01")).forEach(f => console.log(f.toString()));

    console.log("\n>> Rating >= 4");
    (await libary.getRatedAtLeast(4)).forEach(f => console.log(f.toString()));

    console.log("\n>> Titolo contenente 'war'");
    (await libary.getFilmsByTitle('war')).forEach(f => console.log(f.toString()));

    db.close(); // chiusura esplicita della connessione
}

demo().catch(console.error);

async function demoWriteOps() {
    const lib = new FilmLibrary();
    await lib.addFilm(new Film(null, 'Interstellar', true, dayjs(), 5, 1));
    await lib.deleteFilmDb(3);
    await lib.resetWatchDates();
    db.close();
}

demoWriteOps().catch(console.error);
