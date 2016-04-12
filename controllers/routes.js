"use strict";

const express = require("express");
const router = new express.Router();

const dbMethods = require("../db/methods");

const thesisCtrl = require("./thesis");
const councilmeetingCtrl = require("./councilmeeting");
const reviewCtrl = require("./review");
const graderCtrl = require("./grader");
const userCtrl = require("./user");
const thesisprogressCtrl = require("./thesisprogress");

const index = (req, res) => {
  res.json({
    message: "This is the default page. Nothing to see here.",
  });
};

const dump = (req, res) => {
  dbMethods
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

router.get("/thesis", thesisCtrl.findAll);
router.post("/thesis", thesisCtrl.saveOne);

router.get("/councilmeeting", councilmeetingCtrl.findAll);
router.post("/councilmeeting", councilmeetingCtrl.saveOne);

router.get("/review", reviewCtrl.findAll);
router.post("/review", reviewCtrl.saveOne);

router.get("/grader", graderCtrl.findAll);
// router.post("/grader", graderCtrl.saveOne);
router.post("/grader", graderCtrl.saveIfDoesntExist);


router.get("/thesisprogress", thesisprogressCtrl.findAll);
router.post("/thesisprogress", thesisprogressCtrl.saveOne);

router.get("/user", userCtrl.findAll);
router.post("/user", userCtrl.saveOne);

router.get("/dbdump", dump);

module.exports = router;
