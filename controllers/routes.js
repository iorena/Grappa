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
router.put("/thesis/:id", (req, res) => {
  userCtrl.updateOne(req, res);
});router.post("/thesis", thesisCtrl.saveOne);
router.get("/thesis/:id", (req,res) => {
  thesisCtrl.findOne(req, res);
});
router.delete("/thesis/:id", (req, res) => {
  thesisCtrl.deleteOne(req, res);
});

/* Councilmeeting routes */
router.get("/councilmeeting", councilmeetingCtrl.findAll);
router.post("/councilmeeting", councilmeetingCtrl.saveOne);
router.put("/councilmeeting/:id", (req, res) => {
  councilmeeting.updateOne(req, res);
});
router.delete("/councilmeeting/:id", (req, res) => {
  councilmeetingCtrl.deleteOne(req, res);
});

/* Review routes */
router.get("/review", auth.authenticate, reviewCtrl.findAll);
router.post("/review", auth.authenticate, reviewCtrl.saveOne);
router.put("/review/:id", (req, res) => {
  reviewCtrl.updateOne(req, res);
});
router.delete("/review/:id", (req, res) => {
  reviewCtrl.deleteOne(req, res);
});

/* Grader routes */
router.get("/grader", graderCtrl.findAll);
router.post("/grader", graderCtrl.saveOne);
router.put("/grader/:id", (req, res) => {
  graderCtrl.updateOne(req, res);
});
router.delete("/grader/:id", (req, res) => {
  graderCtrl.deleteOne(req, res);
});


/* Thesisprogress routes */
router.get("/thesisprogress", thesisprogressCtrl.findAll);
router.get("/thesisprogress/:id", (req,res) => {
  thesisprogressCtrl.findOne(req, res);
});
router.post("/thesisprogress", thesisprogressCtrl.saveOne);

/* User routes */
router.get("/user", userCtrl.findAll);
router.post("/user", userCtrl.saveOne);
router.get("/user/:id", (req,res) => {
  userCtrl.findOne(req, res);
});
router.put("/user/:id", (req, res) => {
  userCtrl.updateOne(req, res);
});
router.post("/login", userCtrl.loginUser);
router.delete("/user/:id", (req, res) => {
  userCtrl.deleteOne(req, res);
});

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
router.put("/studyfield/:id", (req, res) => {
  studyfieldCtrl.updateOne(req, res);
});
router.delete("/studyfield/:id", (req, res) => {
  studyfieldCtrl.deleteOne(req, res);
});


/* /dbdump for getting all entries in database */
router.get("/dbdump", dump);

module.exports = router;
