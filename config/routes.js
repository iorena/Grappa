"use strict";

const express = require("express");
const router = new express.Router();

const dbMethods = require("../db/methods");

const auth = require("../middleware/authentication");

const thesisCtrl = require("../controllers/thesis");
const councilmeetingCtrl = require("../controllers/councilmeeting");
const graderCtrl = require("../controllers/grader");
const userCtrl = require("../controllers/user");
// const thesisprogressCtrl = require("./thesisprogress");
// const emailCtrl = require("./email");
// const emailstatusCtrl = require("./email_status");
const studyfieldCtrl = require("../controllers/studyfield");
const emaildraftCtrl = require("../controllers/emaildraft");

const index = (req, res) => {
  res.json({
    message: "This is the default page. Nothing to see here.",
  });
};

const authTest = (req, res) => {
  res.json({
    message: "You've successfully authenticated.",
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
router.get("/auth", auth.authenticate, authTest);

router.post("/login", userCtrl.loginUser);
router.post("/user", userCtrl.saveOne);

router.post("/thesis/ethesis", thesisCtrl.updateOneEthesis);

// router.get("/dbdump", dump);
// router.get("/asdf", thesisCtrl.sendPdf);

router.use("", auth.authenticate);

// Routes for all users

router.get("/thesis", thesisCtrl.findAllByUserRole);
router.put("/thesis/:id", thesisCtrl.updateOneAndConnections);
router.post("/thesis", thesisCtrl.saveOne);
// router.delete("/thesis/:id", thesisCtrl.deleteOne);
router.post("/thesis/pdf", thesisCtrl.generateThesesToPdf);

router.get("/grader", graderCtrl.findAll);
router.post("/grader", graderCtrl.saveOne);
router.put("/grader/:id", graderCtrl.updateOne);

router.get("/councilmeeting", councilmeetingCtrl.findAll);

router.get("/studyfield", studyfieldCtrl.findAll);

router.put("/user/:id", userCtrl.updateOne);

// Routes accessisable only for admin

router.use("", auth.onlyAdmin);

router.post("/councilmeeting", councilmeetingCtrl.saveOne);
router.put("/councilmeeting/:id", councilmeetingCtrl.updateOne);

router.post("/studyfield", studyfieldCtrl.saveOne);
router.put("/studyfield/:id", studyfieldCtrl.updateOne);

router.get("/user", userCtrl.findAll);
router.delete("/user/:id", userCtrl.deleteOne);

// router.get("/emailstatus", emailstatusCtrl.findAll);
// router.post("/emailstatus", emailstatusCtrl.saveOne);

// router.get("/email/send", emailCtrl.sendEmail);
// router.get("/email/check", emailCtrl.checkEmail);
// router.post("/email/remind", emailCtrl.sendReminder);

router.get("/emaildraft", emaildraftCtrl.findAll);
router.put("/emaildraft/:id", emaildraftCtrl.updateOne);

module.exports = router;
