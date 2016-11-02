require("dotenv").config();
/* Used to determine the database for db_connection which in this case is the test-db */
process.env["NODE_ENV"] = "testing";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = require("../app");

const fs = require("fs");

const generateTestDB = () => {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream("./db/test-db-bak.sqlite");
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
