require("dotenv").config();
process.env["NODE_ENV"] = "testing";

const fs = require("fs");

const generateTestDB = () => {
  fs.createReadStream("./db/test-db(backup).sqlite")
  .pipe(fs.createWriteStream("./db/test-db.sqlite"));
}

generateTestDB();

const app = require("../app");

module.exports = {
  app,
};

