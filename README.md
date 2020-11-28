# fut-db

This is a lil' project I have wiritten to:

- Brush up on my TypeScript
- Work with the basics of MongoDB for the first time
- Practice writing up some API documentation

This service is an express API for listing FIFA ultimate team players.

## Setup
fut-db requires a MongoDB instance with a database named `fut`. Within this DB are the following collections:
- `users` - a collection containing API user documents including access tokens and permissions
- `players` - a collection containing the FUT player cards including all of their main stats

To run this application, you will need settings file `settings.json` in the root of the project - you can use the `settings-sample.json` to find the format. In the settings file, you can specify which port to serve to and where your MongoDB configuration.

```json
{
    "server": {
        "port": 8080
    },
    "mongodb": {
        "user": "ben",
        "password": "password",
        "host": "cluster.code.mongodb.net/"
    }
}
```

## API Users

To acccess the API, the requester needs to have a user document in the MongoDB database named `fut` under a collection named `users`.

The user document is structured as follows:

```json
{
  "_id": "mongodb-generated-id",
  "type": "user",
  "name": "Bob",
  "email": "bob@gmail.com",
  "tokens": ["this-is-the-access-token-needed-in-the-bearer-authentication"],
  "permissions": ["players.admin"]
}
```

## Authentication

To access the API, Bearer authentication must be given within the request. The supplied token must match a token in a api user document.

```
Authorization: Bearer this-token-must-exist-in-your-user-document
```

A valid token pointing to a user document will get you past the authentication middleware, however different endpoints have different permission requirements as highlighted in the API docs below.

## Players API

Below are the supported endpoints for the FUT players API.

### **Get Player by ID**

Return the JSON stats for a FUT card player by the MongoDB ID.

- **URL**

  _`/fut/players/:id`_

- **METHOD**

  _`GET`_

- **URL PARAMS**

  _`id=[string]`_ - where id is the mongo id of the player document

- **QUERY PARAMS: NONE**

- **AUTH REQUIRED: YES**

- **PERMISSIONS**

  API user needs one of the following permissions in their document:

  - `players.get`
  - `players.admin`

- **SUCCESS RESPONSE**

  - Code: 200
  - Content:
    ```json
    {
      "_id": "5fbd633766a5f383208d05e3",
      "name": "Lionel Messi",
      "club": "FC Barcelona",
      "position": "RW",
      "revision": "TOTY",
      "league": "LaLiga Santander",
      "rating": 99,
      "pace": 96,
      "shooting": 98,
      "passing": 99,
      "dribbling": 99,
      "defending": 50,
      "physicality": 85
    }
    ```

- **ERROR RESPONSE - BAD REQUEST**

  - Code: 400
  - Content:
    ```json
    {
      "error": "Bad Request",
      "reason": "Invalid ID supplied: ID must be a single String of 12 bytes or a string of 24 hex characters"
    }
    ```

- **ERROR RESPONSE - NOT FOUND**
  - Code: 404
  - Content:
    ```json
    {
      "error": "Not Found",
      "reason": "Player does not exist for supplied id"
    }
    ```

### **List Players**

Return JSON containing an array of stats of FUT cards which satisfy the given query parameters.

- **URL**

  _`/fut/players`_

- **METHOD**

  _`GET`_

- **URL PARAMS: NONE**

- **QUERY PARAMS**

  - _`limit=[number]`_ - number of documents to return
  - _`skip=[number]`_ - number of documents to skip over
  - _`sort=[string]`_ - numeric property name to sort by: `rating`, `pace`, `shooting`, `passing`, `dribbling`, `defending`, `physicality`
  - _`order=[string]`_ - order the sort ascending or descending: `asc`, `desc`
  - _`rating=[number]`_ - find only players with the supplied rating
  - _`pace=[number]`_ - find only players with the supplied pace
  - _`shooting=[number]`_ - find only players with the supplied shooting
  - _`passing=[number]`_ - find only players with the supplied passing
  - _`dribbling=[number]`_ - find only players with the supplied dribbling
  - _`defending=[number]`_ - find only players with the supplied defending
  - _`physicality=[number]`_ - find only players with the supplied physicality
  - _`numeric_property[string]=[number]`_ - comparison query operators are supported on the following numeric properties: `rating`, `pace`, `shooting`, `passing`, `dribbling`, `defending`, `physicality`. The string key is the comparative operator: `lt`, `lte`, `gt`, `gte`, `eq`. This feature allows us to do powerful queries such as `/fut/players?pace[gte]=90&pace[lte]=95&rating[eq]=85` - list players with a pace value between 90 and 95 (inclusive) who have a rating of 85.

- **AUTH REQUIRED: YES**

- **PERMISSIONS**

  API user needs one of the following permissions in their document:

  - `players.list`
  - `players.admin`

- **SUCCESS RESPONSE**

  - Example: `/fut/players?limit=2&shooting=77&defending[lte]=85&sort=pace`
  - Code: 200
  - Content:
    ```json
    [
      {
        "_id": "5fbd633766a5f383208d08e4",
        "name": "Michael Laudrup",
        "club": "Icons",
        "position": "LW",
        "revision": "Icon",
        "league": "Icons",
        "rating": 89,
        "pace": 82,
        "shooting": 77,
        "passing": 89,
        "dribbling": 92,
        "defending": 36,
        "physicality": 62
      },
      {
        "_id": "5fbd633766a5f383208d07ee",
        "name": "Luka Modric",
        "club": "Real Madrid",
        "position": "CM",
        "revision": "TOTY Nominee",
        "league": "LaLiga Santander",
        "rating": 91,
        "pace": 75,
        "shooting": 77,
        "passing": 90,
        "dribbling": 87,
        "defending": 73,
        "physicality": 67
      }
    ]
    ```
