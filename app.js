"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 9876;

if (process.env.NODE_ENV = "development") {
  let logger = require("morgan");
  app.use(logger("dev"));
} else {
  // ei tarvi asettaa koska on herokuun asetettu muuttuja?
  process.env.DATABASE_URL = "postgres://keuoblxbkbspkf:7DOjZx2eHir2SYgemNZo_3EbxI@ec2-54-225-151-64.compute-1.amazonaws.com:5432/d2ts0v8erk5vak";
}

const test = require("./db/add_test_data");
// test.dropAndCreateTables();
// test.dropTables();
// test.createTestData();

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
