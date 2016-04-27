"use strict";

const express = require("express");
const router = new express.Router();

const dbMethods = require("../db/methods");

const auth = require("../middleware/authentication");

const thesisCtrl = require("./thesis");
const councilmeetingCtrl = require("./councilmeeting");
const reviewCtrl = require("./review");
const graderCtrl = require("./grader");
const userCtrl = require("./user");
const thesisprogressCtrl = require("./thesisprogress");
const emailCtrl = require("./email");
const emailstatusCtrl = require("./email_status");
const studyfieldCtrl = require("./studyfield");

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

/* Thesis routes */
router.get("/thesis", auth.authenticate, thesisCtrl.findAll);
router.put("/thesis/:id", thesisCtrl.updateOne);
router.post("/thesis", thesisCtrl.saveOne);
router.get("/thesis/:id", thesisCtrl.findOne);
router.delete("/thesis/:id", thesisCtrl.deleteOne);
router.post("/thesis/ethesis", thesisCtrl.updateOneWithEthesis);

/* Councilmeeting routes */
router.get("/councilmeeting", councilmeetingCtrl.findAll);
router.post("/councilmeeting", councilmeetingCtrl.saveOne);
router.put("/councilmeeting/:id", councilmeetingCtrl.updateOne);
router.delete("/councilmeeting/:id", councilmeetingCtrl.deleteOne);

/* Review routes */
router.get("/review", auth.authenticate, reviewCtrl.findAll);
router.post("/review", auth.authenticate, reviewCtrl.saveOne);
router.put("/review/:id", reviewCtrl.updateOne);
router.delete("/review/:id", reviewCtrl.deleteOne);

/* Grader routes */
router.get("/grader", graderCtrl.findAll);
router.post("/grader", graderCtrl.saveOne);
router.put("/grader/:id", graderCtrl.updateOne);
router.delete("/grader/:id", graderCtrl.deleteOne);

/* Thesisprogress routes */
router.get("/thesisprogress", thesisprogressCtrl.findAll);
router.get("/thesisprogress/:id", thesisprogressCtrl.findOne);
router.post("/thesisprogress", thesisprogressCtrl.saveOne);

/* User routes */
router.get("/user", userCtrl.findAllNotActive);
router.post("/user", userCtrl.saveOne);
router.get("/user/:id", userCtrl.findOne);
router.put("/user/:id", userCtrl.updateOne);
router.post("/login", userCtrl.loginUser);
router.delete("/user/:id", userCtrl.deleteOne);

/* Emailstatus routes */
router.get("/emailstatus", emailstatusCtrl.findAll);
router.post("/emailstatus", emailstatusCtrl.saveOne);

/* Email routes */
router.get("/email/send", emailCtrl.sendEmail);
router.get("/email/check", emailCtrl.checkEmail);
router.get("/email/remind", emailCtrl.sendReminder);

/* Studyfield routes */
router.get("/studyfield", studyfieldCtrl.findAll);
router.post("/studyfield", studyfieldCtrl.saveOne);
router.put("/studyfield/:id", studyfieldCtrl.updateOne);
router.delete("/studyfield/:id", studyfieldCtrl.deleteOne);

/* /dbdump for getting all entries in database */
router.get("/dbdump", dump);

module.exports = router;
