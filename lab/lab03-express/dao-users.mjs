/* Data Access Object (DAO) module for accessing users data */

/**
 * It is a DAO (Data Access Object) tyoe module for the "users" table. The only function present is:
 * 
 * - getUser(id): runs a query on the DB to look for the user with primary key id.
 *  - If it finds no rows, it returns an object {error: "User not found"}.
 *  - Otherwise, it resolves Promise with the row found (i.e., the user).
 */

import db from "./db.mjs";

// Note: all functions return error messages as json object { error: <string> }
export default function UserDao() {
    // This function retrieves one user by id
    this.getUser = (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE id = ?";
            db.get(sql, [id], (err, row) => {
                if (err)
                    reject(err);
                if(row === undefined)
                    resolve({error: "User not found."});
                else
                    resolve(row);
            });
        });
    };
}