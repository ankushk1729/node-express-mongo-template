
# Node + Express + MongoDB + JWT 

A template to get started with creating REST APIs using NodeJs, ExpressJS, MongoDB with JWT for authentication.

## Folder Structure 

```
.
└── src
    ├── controllers
    ├── db
    ├── errors
    ├── middlewares
    ├── models
    ├── routes
    ├── services
    ├── utils
    └── app.js
├── package.json

```

## Installation ⚙️

Git clone the repository and run npm install

```bash
  git clone https://github.com/ankushk1729/node-express-mongo-template
  cd node-express-mongo-template
  npm install
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`MONGO_URI`

`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_EXPIRY`



## Run Locally 🚀


Start the server in development mode

```bash
  npm run dev
```

Start the server in production mode

```bash
  npm start
```
