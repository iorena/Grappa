const express = require("express"),
  bodyParser = require("body-parser"),
  setImmediate = require("setimmediate"),
  cors = require("cors");

const app = express();

const port = process.env.PORT || 9876;

// const test = require("./db/add_test_data");
// test.createTestData();
// test.dropTables();

if (process.env.NODE_ENV = "development") {
  const logger = require("morgan");
  app.use(logger("dev"));
} else {
  // ei tarvi asettaa koska on herokuun asetettu muuttuja?
  process.env.DATABASE_URL = "postgres://keuoblxbkbspkf:7DOjZx2eHir2SYgemNZo_3EbxI@ec2-54-225-151-64.compute-1.amazonaws.com:5432/d2ts0v8erk5vak";
}

app.use(bodyParser.urlencoded({
  extended: true
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
