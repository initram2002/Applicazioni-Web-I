# `film-library-server`

The `film-library-server` is the server-side app companion for HeapOverrun. It presents some APIs to performe some CRUD operations on film library and its films.

### APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List of all the available films__

URL: `/api/films`

HTTP Method: GET.

- Description: Retrieve all available films.
- Request body: _None_
- Request query parameter: _filter_ name of the filter to apply (favorite, best, seen in the last month, unseen)
- Response: `200 OK` (success)
- Response body: Array of Film objects:
    ``` json
    [
        {
            "id": 1,
            "title": "Pulp Fiction",
            "isFavorite": true,
            "rating": 5,
            "watchDate": "2024-03-10",
            "userId": 1
        },
        ...
    ]
    ```
- Error responses: `500 Internal Server Error` (generic error).

### __A specific film, given its "id"__

URL: `/api/films/:id`

HTTP Method: GET.

- Description: Retrieve a specific film, represented by `<id>`.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: a film object describing the film with that given "id":
    ``` json
    {
        "id": 1,
        "title": "Pulp Fiction",
        "isFavorite": true,
        "rating": 5,
        "watchDate": "2024-03-10",
        "userId": 1
    }
    ```
- Error responses: `404 Not Found` (id not present or unavailable), or `500 Internal Server Error` (generic error).

### __Create a new film__

URL: `/api/films`

HTTP Method: POST.

- Description: Create a new film, by providing all its information except the "id" that will be automatically assigned by the back end.
- Request body: a film object describing the new film to be added.
    ``` json
    {
        "title": "Interstellar",
        "isFavorite": true,
        "rating": 5,
        "watchDate": "2024-03-28",
        "userId": 1
    }
    ```
- Response: `201 Created` (success)
- Response body: the entire representation of the newly-added film.
- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), or `500 Internal Server Error` (generic error).

### __Update an existing film__

URL: `/api/films/:id`

HTTP Method: PUT.

- Description: Update an existing film, by providing its information, i.e., all the properties except the "id".
- Request body: a film object describing the new properties for that film:
    ``` json
    {
        "title": "Star Wars",
        "isFavorite": true,
        "rating": 4,
        "watchDate": "2024-03-22",
        "userId": 1
    }
    ```
- Response: `200 OK` (success)
- Response body: the entire representation of the updated film.
- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), or `500 Internal Server Error` (generic error).

### __Update the rating of a specific film__

URL: `/api/films/:id/rating`

HTTP Method: PUT.

- Description: Update the rating of a specific film.
- Request body: a JSON object representing the action:
    ``` json
    {
        "rating": 4,
    }
    ```
- Response: `200 OK` (success)
- Response body: the object represented in the database.
- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), or `500 Internal Server Error` (generic error).

### __Mark an existing film as favorite/unfavorite__

URL: `/api/films/:id/isFavorite`

HTTP Method: PUT.

- Description: Mark an existing film as favorite/unfavorite.
- Request body: a JSON object representing the action:
    ``` json
    {
        "isFavorite": false,
    }
    ```
- Response: `200 OK` (success)
- Response body: the object represented in the database.
- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), or `500 Internal Server Error` (generic error).

### __Delete an existing film__

URL: `/api/films/:id`

HTTP Method: DELETE.

- Description: Delete an existing film.
- Request body: __None__
- Response: `200 OK` (success)
- Response body: __None__
- Error responses: `404 Not Found` (not present or unavailable), or `500 Internal Server Error` (generic error).