"use strict";

const express = require("express");
const router = express.Router();

const Models = require("../models/shared");

const thesis = require("./thesis");
const councilmeeting = require("./councilmeeting");

const index = (req, res) => {
  res.json({
    message: "This is the default page. Nothing to see here.",
  });
};

const dump = (req, res) => {
  Models
  .dump()
  .then(tables => {
    res.status(200).send(tables);
  })
  .catch(err => {
    res.status(500).send({
      message: "Routes dump produced an error",
      error: err,
    });
  });
};

router.get("/", index);

router.get("/thesis", thesis.findAll);
router.post("/thesis", thesis.saveOne);

router.get("/councilmeeting", councilmeeting.findAll);
router.post("/councilmeeting", councilmeeting.saveOne);

router.get("/dbdump", dump);

module.exports = router;
