"use strict";

// Silly ubuntu-server won't sometimes load up the envinroment variables if this is conditional
// if (!process.env.NODE_ENV) {
  require("dotenv").config();
// }

const express = require("express");
const compression = require("compression");
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

app.use(compression());
app.use(busboy({
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
}));
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

// should prevent the server from staying running when the process suddenly crashes
// which still happens when nodemon has that stupid EPERM error where the files it has been
// using are deleted BUT at least this one reduces required reboots to 2 (first to kill the old process,
// second to the start new)
  process.on("exit", () => {
    console.log("PROCESS EXIT !")
    app.close();
    process.exit();
  });
}

module.exports = app;
