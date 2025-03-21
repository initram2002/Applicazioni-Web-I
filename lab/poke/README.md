## API
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __Retrieve the list of all items of the main collection__

URL: `/api/bowls`

HTTP Method: GET

Description: Returns an array of all Bowl objects.

Response: `200 ok` (success) or `500 Internal Server Error` (generic error). In case of success, returns an array of bowls in JSON format (see below). Else, returns an error message.

Response body:
```
[
    {
        "id": "b1",
        "orderId": "o1",
        "size": "R",
        "base": "rice",
        "quantity": 1,
        "price": 9.0
    },
    {
        "id": "b4",
        "orderId": "o2",
        "size": "R",
        "base": "salad",
        "quantity": 3,
        "price": 27.0
    }
]
```

### __Retrieve a list of items with specific characteristics__

URL: `/api/bowls?size=R`

HTTP Method: GET

Description: Returns an array of bowl objects matching a condition (e.g. size = R).

Response: `200 OK` (success), `400 Bad Request` (param is invalid) or `500 Internal Server Error` (generic error). In case of success, returns an array of bowls in JSON format (see below). Else returns an error message.

Response body:

[
    {
        "id": "b1",
        "orderId": "o1",
        "size": "R",
        "base": "rice",
        "quantity": 1,
        "price": 9.0
    },
    {
        "id": "b4",
        "orderId": "o2",
        "size": "R",
        "base": "salad",
        "quantity": 3,
        "price": 27.0
    }
]

### __Retrieve a specific item by ID__

URL: `/api/bowls/<id>`

HTTP Method: GET

Description: Returns a single Bowl object, given its unique `<id>`.

Response: `200 OK` (success), `404 Not found` (wrong id) or `500 Internal Server Error` (generic error). In case of success, returns an array of bowls in JSON format (see below). Else returns an error message.

Response body:

{
    "id": "b1",
    "orderId": "o1",
    "size": "R",
    "base": "rice",
    "quantity": 1,
    "price": 9
}

### __Create a new item (auto-assign <id>)__

URL: `/api/bowls/`

HTTP Method: POST

Description: Create a new Bowl. The backend generates the `<id>` automatically.

Request body:
```
{
    "orderId: "o1",
    "size": "M",
    "base": "rice",
    "quantity": 2,
    "price": 22.0
}
```

Response: `200 OK` (success) or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__

### __Update an existing item by providing full information__

URL: `/api/bowls/<id>`

HTTP Method: PUT

Description: Overwrites the entire Bowl resource except for the `<id>`, which is taken from the path.

Request body: A JSON object representing the answer.
```
{
    "orderId: "o2",
    "size": "R",
    "base": "black rice",
    "quantity": 3,
    "price": 27.0
}
```

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: __None__