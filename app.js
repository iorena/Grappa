"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 9876;

// use npm run db if you want to reset the local database!
// use npm run db:prod if you want to reset the Heroku database!

if (process.env.NODE_ENV === "development") {
  let logger = require("morgan");
  app.use(logger("dev"));
}

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors());

const routes = require("./controllers/routes");

app.use("/", routes);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`App is listening on port ${port}`);
  }
});
