"use strict";

const express = require("express");
const router = new express.Router();

const dbMethods = require("../db/methods");

const auth = require("../middleware/authentication");

const thesisCtrl = require("../controllers/thesis");
const councilmeetingCtrl = require("../controllers/councilmeeting");
// const reviewCtrl = require("./review");
const graderCtrl = require("../controllers/grader");
const userCtrl = require("../controllers/user");
// const thesisprogressCtrl = require("./thesisprogress");
// const emailCtrl = require("./email");
// const emailstatusCtrl = require("./email_status");
const studyfieldCtrl = require("../controllers/studyfield");

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

router.get("/asdf", thesisCtrl.asdf);

router.use("", auth.authenticate);

router.get("/thesis", auth.authenticate, thesisCtrl.findAllByUserRole);
// router.put("/thesis/:id", auth.onlyAdmin, thesisCtrl.updateOneAndConnections);
router.put("/thesis/:id", thesisCtrl.updateOneAndConnections);
router.post("/thesis", auth.authenticate, thesisCtrl.saveOne);
// router.get("/thesis/:id", thesisCtrl.findOne);
// router.delete("/thesis/:id", thesisCtrl.deleteOne);
router.post("/thesis/ethesis", thesisCtrl.updateOneEthesis);
// router.get("/thesis/:id/pdf", thesisCtrl.createPdf);
// router.post("/thesis/pdf", thesisCtrl.createAllPdfs);

router.get("/councilmeeting", councilmeetingCtrl.findAll);
router.post("/councilmeeting", councilmeetingCtrl.saveOne);
// router.put("/councilmeeting/:id", councilmeetingCtrl.updateOne);
// router.delete("/councilmeeting/:id", councilmeetingCtrl.deleteOne);

// router.get("/review", auth.authenticate, reviewCtrl.findAll);
// router.post("/review", auth.authenticate, reviewCtrl.saveOne);
// router.put("/review/:id", reviewCtrl.updateOne);
// router.delete("/review/:id", reviewCtrl.deleteOne);

router.post("/grader/many", graderCtrl.updateMany);
// router.get("/grader", graderCtrl.findAll);
// router.post("/grader", graderCtrl.saveOne);
// router.put("/grader/:id", graderCtrl.updateOne);
// router.delete("/grader/:id", graderCtrl.deleteOne);

// router.get("/thesisprogress", thesisprogressCtrl.findAll);
// router.get("/thesisprogress/:id", thesisprogressCtrl.findOne);
// router.post("/thesisprogress", thesisprogressCtrl.saveOne);

router.get("/user", userCtrl.findAll);
router.get("/user/inactive", userCtrl.findAllNotActive);
router.post("/user", userCtrl.saveOne);
router.put("/user/:id", userCtrl.updateOne);
router.delete("/user/:id", userCtrl.deleteOne);

// router.get("/emailstatus", emailstatusCtrl.findAll);
// router.post("/emailstatus", emailstatusCtrl.saveOne);

// router.get("/email/send", emailCtrl.sendEmail);
// router.get("/email/check", emailCtrl.checkEmail);
// router.post("/email/remind", emailCtrl.sendReminder);

router.get("/studyfield", studyfieldCtrl.findAll);
// router.post("/studyfield", studyfieldCtrl.saveOne);
// router.put("/studyfield/:id", studyfieldCtrl.updateOne);
// router.delete("/studyfield/:id", studyfieldCtrl.deleteOne);

router.get("/dbdump", dump);

module.exports = router;
