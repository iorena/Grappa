require("dotenv").config();
process.env["NODE_ENV"] = "testing";

const app = require("../app");

const fs = require("fs");

const generateTestDB = () => {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream("./db/test-db(backup).sqlite");
    rd.on("error", reject);
    const wr = fs.createWriteStream("./db/test-db.sqlite");
    wr.on("error", reject);
    wr.on("finish", resolve);
    rd.pipe(wr);
  })
}

module.exports = {
  app,
  generateTestDB,
};

describe("TestHelper", function() {
  it("should generate test DB", (done) => {
    generateTestDB()
    .then(() => {
      done();
    })
  });
});