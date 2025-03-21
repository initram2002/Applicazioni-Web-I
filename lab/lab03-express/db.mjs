/** DB access module **/

/**
 * This module:
 * 1. Imports the sqlite3 package.
 * 2. Opens (or creates, if missing) the films.db database and instantiates a db object (of type sqlite3.Database).
 * 3. Exports the db object so that other files can execute SQL queries on this database.
 */

import sqlite3 from 'sqlite3';

// Opening the database
const db = new sqlite3.Database("films.db", (err) => {
    if (err)
        throw err;
});

export default db;