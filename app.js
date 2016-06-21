"use strict";

require("dotenv").config();
const express = require("express");
const busboy = require("connect-busboy");
const bodyParser = require("body-parser");
const cors = require("cors");
const scheduler = require("./services/Scheduler");

const app = express();

const port = process.env.PORT || 9876;

// use npm run db if you want to reset the local database!
// use npm run db:prod if you want to reset the Heroku database!

if (process.env.NODE_ENV !== "production") {
  const logger = require("morgan");
  app.use(logger("dev"));
}

app.use(busboy()); 
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cors());

// scheduler.startAndRunOnceInHour();
// scheduler.checkThesisProgresses();
const asdf = require("./services/PdfManipulator");
asdf.generateGraderEval();
// asdf.prepareAbstractsForMeeting();

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
