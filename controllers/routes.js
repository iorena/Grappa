const express = require("express");
const router = express.Router();

// const db_connection = require("../db/db_connection");
const models = require("../models/shared");

const thesis = require("./thesis");
const councilmeeting = require("./councilmeeting");

const index = (req, res) => {
  res.json({
    message: "This is the default page. Nothing to see here"
  });
}

const dump = (req, res) => {
  models.dump(tables => {
    res.json({
      message: "This is where I list everything in the db",
      result: tables,
    });
  });
}

router.get("/", index);

router.get("/thesis", thesis.findAll);
router.post("/thesis", thesis.saveOne);

router.get("/councilmeeting", councilmeeting.findAll);
router.post("/councilmeeting", councilmeeting.saveOne);

router.get("/dbdump", dump);

module.exports = router;
