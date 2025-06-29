# Lab 2: Database Integration

In this lab, you'll integrate your JavaScript application with a local database. In this first part, you'll implement functions to retrieve data from the database, and in the second part, you'll make modifications to the data stored in the database.

## 1. Retrieve data from the database

The database includes a collection of films with fields detailed in the first lab. Use the `films.db` database.

Modify the program from the previous lab (`film-library.js`) by adding the following features as asynchronous methods to the **FilmLibrary** for retrieving data from the database:

1. Retrieve all the stored films and return a Promise that resolves to an array of Film objects.
2. Retrieve all favourite films and return a Promise that resolves to an array of Film objects.
3. Retrieve all films watched today and return a Promise that resolves to an array of Film objects.
4. Retrieve films whose watch date is earlier than a given date (received as a parameter). Return a Promise that resolves to an array of Film objects.
5. Retrieve films whose rating is greater than or equal to a given number (received as a paramter). Return a Promise that resolves to an array of Films objects.
6. Retrieve films whose title contains a given string (received as a parameter). Return a Promise that resolves to an array of Film objects.

Finally, confirm the proper functioning of the implemented methods by calling them and printing the results.

## 2. Modify the data stored in the database

Before proceding with this exercise, make a copy of the local database file, as the following methods will permanently modify its content.

Add the following features as methods to the **FilmLibrary** object:

1. **Store** a new movie into the database. After completion, print a confirmation/failure message.
2. **Delete a movie** from the database (using its ID as a reference). After completion, print a confirmation/failure message.
3. **Delete the watch date** of all films stored in the database. After completion, print a confirmation/failure message.

### Notes

1. As covered in the lectures, you can connect to an SQLite database using the following module: **sqlite3** (https://www.npmjs.com/package/sqlite3).
2. To browse the content of the database, you can use one of the two following tools:
   1. Download the Visual Studio Code *SQLite extension* (you can search for it in VSCode extension hub or through the following link):

    https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite
   2. Download the application *DB Browser for SQLite*:

    https://sqlitebrowser.org/dl/
