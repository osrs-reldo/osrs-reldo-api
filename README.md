# O S R S - R E L D O - A P I

![reldo](/docs/reldo.png)

Backend API for use with [os-league-tools](https://github.com/osrs-reldo/os-league-tools).

## Development

1. Install packages:

   - `npm install`

2. Set up `.env` file:

   - Make a copy of `/.env.example` and rename it to `/.env`
   - Any fields with the value `"example"` will need to be replaced with valid values in order to function correctly. Not all routes need env vars.
     - `/hiscores` routes do not require any env vars
     - `/feedback` routes require all `HEIGHT_*` vars to be correctly filled out. See [Height API documentation](https://www.notion.so/API-documentation-643aea5bf01742de9232e5971cb4afda) for more info on the keys and IDs used in task creation.
     - You will also need to provide details of your postgres database too. 

3. Start app:

   - `npm run start`

4. API will be running at http://localhost:8080/ 
  - This is expected to change down the track to a less frequented port once "bundling" is completed.


5. User Registration and Authentication relies upon a PostGres database server. The query to create this table is below;

PostGres:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Usage

### `/hiscores`

#### **GET** `/hiscores/:rsn`

Returns leagues hiscores for the given RSN, formatted as JSON using [osrs-json-hiscores](https://github.com/maxswa/osrs-json-hiscores#what-youll-get).

Use query param `mode` to get hiscores for a different gamemode. Valid options:

- seasonal (default)
- main
- ironman
- hardcore
- ultimate

### `/feedback`

#### **POST** `/feedback`

Sends general feedback to Height _#feedback_ list.

Request body:

```
{
  "description": string,
}
```

#### **POST** `/feedback/suggestion`

Sends a suggestion to Height _#suggestions_ list.

Request body:

```
{
  "description": string,
}
```

#### **POST** `/feedback/bug`

Sends a bug report to Height _#bugs_ list.

Request body:

```
{
  // Required
  "description": string,

  // Optional
  "reproSteps": string,
  "device": string,
  "client": string,
  "debugInfo": string,
}
```
