"use strict";

if (!process.env.NODE_ENV) {
  require("dotenv").config();
}

const express = require("express");
const busboy = require("connect-busboy");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  const logger = require("morgan");
  app.use(logger("dev"));
}

const FileManipulator = require("./services/FileManipulator");
FileManipulator.cleanTmp();

app.use(busboy());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors());

app.use("", require("./config/routes"));

if (!module.parent) {
  app.listen(port, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`App is listening on port ${port}`);
    }
  });
}

module.exports = app;
