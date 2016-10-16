"use strict";

const express = require("express");
const router = new express.Router();

const auth = require("../middleware/authentication");
const parseForm = require("../middleware/parseForm");
const validate = require("../middleware/validateBody");
const errorHandler = require("../middleware/errorHandler");

const thesisCtrl = require("../controllers/thesis");
const councilmeetingCtrl = require("../controllers/councilmeeting");
const graderCtrl = require("../controllers/grader");
const userCtrl = require("../controllers/user");
const thesisprogressCtrl = require("../controllers/thesisprogress");
const emailCtrl = require("../controllers/email");
// const emailstatusCtrl = require("./email_status");
const studyfieldCtrl = require("../controllers/studyfield");
const emaildraftCtrl = require("../controllers/emaildraft");

const index = (req, res, next) => {
  res.json({
    message: "This is the default page. Nothing to see here.",
  });
};

const authTest = (req, res, next) => {
  res.json({
    message: "You've successfully authenticated.",
  });
};

router.get("/", index);
router.get("/auth", auth.authenticate, authTest);

router.post("/login",
  validate.validateBody("user", "login"),
  userCtrl.loginUser);
router.post("/user",
  validate.validateBody("user", "save"),
  userCtrl.saveOne);

router.post("/thesis/ethesis",
  validate.validateBody("thesis", "ethesis"),
  thesisCtrl.updateOneEthesis);

router.use("", auth.authenticate);

// Routes for all users

router.get("/thesis", thesisCtrl.findAllByUserRole);
router.put("/thesis/:id", thesisCtrl.updateOneAndConnections);
router.post("/thesis",
  parseForm.parseUpload,
  validate.validateBody("thesis", "save"),
  thesisCtrl.saveOne);

// if (thesisIDs && thesisIDs.length > 0) {
router.post("/thesis/pdf",
  validate.validateBody("thesis", "pdf"),
  thesisCtrl.generateThesesToPdf);

router.get("/grader", graderCtrl.findAll);
router.post("/grader",
  validate.validateBody("grader", "save"),
  graderCtrl.saveOne);
router.put("/grader/:id", graderCtrl.updateOne);

router.get("/councilmeeting", councilmeetingCtrl.findAll);

router.get("/studyfield", studyfieldCtrl.findAll);

router.put("/user/:id", userCtrl.updateOne);

// Routes accessisable only for admin

router.use("", auth.onlyAdmin);

router.delete("/thesis/:id", thesisCtrl.deleteOne);

router.post("/councilmeeting",
  validate.validateBody("councilmeeting", "save"),
  councilmeetingCtrl.saveOne);
router.put("/councilmeeting/:id",
  validate.validateBody("councilmeeting", "update"),
  councilmeetingCtrl.updateOne);

router.post("/studyfield",
  validate.validateBody("studyfield", "save"),
  studyfieldCtrl.saveOne);
router.put("/studyfield/:id", studyfieldCtrl.updateOne);

router.get("/user", userCtrl.findAll);
router.delete("/user/:id", userCtrl.deleteOne);

router.put("/thesisprogress/:id", thesisprogressCtrl.updateOne);

// router.get("/emailstatus", emailstatusCtrl.findAll);
// router.post("/emailstatus", emailstatusCtrl.saveOne);
// router.put("/emailstatus/:id", emailstatusCtrl.updateOne);

// router.get("/email/send", emailCtrl.sendEmail);
// router.get("/email/check", emailCtrl.checkEmail);
router.post("/email/remind",
  validate.validateBody("email", "remind"),
  emailCtrl.sendReminder);

router.get("/emaildraft", emaildraftCtrl.findAll);
router.put("/emaildraft/:id", emaildraftCtrl.updateOne);

router.use("", errorHandler.handleErrors);

module.exports = router;
