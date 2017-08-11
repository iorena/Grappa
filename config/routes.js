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
const notificationCtrl = require("../controllers/notification");

const index = (req, res, next) => {
  res.json({
    message: "This is the default page. Nothing to see here.",
  });
};

const authTest = (req, res, next) => {
  res.sendStatus(200);
};

// Routes that do not require authentication

router.get("/", index);
router.get("/auth", auth.authenticate, authTest);

router.post("/login",
  validate.validateBody("user", "login"),
  userCtrl.loginUser);
router.post("/user",
  validate.validateBody("user", "save"),
  userCtrl.saveOne);
router.get("/thesis/grades", thesisCtrl.findAllGrades);


router.post("/user/reset-password",
  validate.validateBody("user", "resetPassword"),
  userCtrl.requestPasswordResetion);
router.post("/user/send-new-password",
  validate.validateBody("user", "sendNewPassword"),
  userCtrl.sendNewPassword);

/**
 * Setting maximum MB limit here is redundant as nginx is what takes care of it. :D
 * This 40MB limit works here although maximum request limit configured by ngninx is 51MB.
 */
router.post("/thesis/ethesis/:token",
  parseForm.parseUpload(40),
  validate.validateBody("thesis", "ethesis"),
  thesisCtrl.uploadEthesisPDF);

/**
 * Routes for all logged in users
 *
 * If route uses "auth.restrictSpectators" that means users that have 'isSpectator'-field
 * set true are not allowed to access the route.
 * Spectators were made to help Kjell showcase Grappa to other university departments' employees.
 */

router.use("", auth.authenticate);

router.get("/thesis", thesisCtrl.findAllByUserRole);
router.put("/thesis/:id",
  auth.restrictSpectators,
  parseForm.parseUpload(41),
  validate.validateBody("thesis", "update"),
  thesisCtrl.updateOneAndConnections
);
router.post("/thesis",
  auth.restrictSpectators,
  parseForm.parseUpload(1),
  validate.validateBody("thesis", "save"),
  thesisCtrl.saveOne);

// if (thesisIDs && thesisIDs.length > 0) {
router.post("/thesis/pdf",
  auth.restrictSpectators,
  validate.validateBody("thesis", "pdf"),
  thesisCtrl.generateThesesToPdf);

router.post("/thesis/doc",
  auth.restrictSpectators,
  validate.validateBody("thesis", "doc"),
  thesisCtrl.serveThesisDocument);

router.get("/grader", graderCtrl.findAll);
router.post("/grader",
  auth.restrictSpectators,
  validate.validateBody("grader", "save"),
  graderCtrl.saveOne);
router.put("/grader/:id", 
  auth.restrictSpectators,
  graderCtrl.updateOne);
router.delete("/grader/:id",
  auth.restrictSpectators,
  graderCtrl.deleteOne);

router.get("/councilmeeting", councilmeetingCtrl.findAll);

router.get("/studyfield", studyfieldCtrl.findAll);

router.put("/user/:id", userCtrl.updateOne);

// Routes accessible only by admins

router.use("", auth.onlyAdmin);

router.post("/thesis/move",
  auth.restrictSpectators,
  validate.validateBody("thesis", "move"),
  thesisCtrl.moveThesesToMeeting);

router.delete("/thesis/:id",
  auth.restrictSpectators,
  thesisCtrl.deleteOne);

router.post("/councilmeeting",
  auth.restrictSpectators,
  validate.validateBody("councilmeeting", "save"),
  councilmeetingCtrl.saveOne);
router.put("/councilmeeting/:id",
  auth.restrictSpectators,
  validate.validateBody("councilmeeting", "update"),
  councilmeetingCtrl.updateOne);
router.delete("/councilmeeting/:id",
  auth.restrictSpectators,
  councilmeetingCtrl.deleteOne);

router.post("/studyfield",
  auth.restrictSpectators,
  validate.validateBody("studyfield", "save"),
  studyfieldCtrl.saveOne);
router.put("/studyfield/:id",
  auth.restrictSpectators,
  studyfieldCtrl.updateOne);

router.get("/user", userCtrl.findAll);
router.delete("/user/:id",
  auth.restrictSpectators,
  userCtrl.deleteOne);

router.put("/thesisprogress/:id",
  auth.restrictSpectators,
  thesisprogressCtrl.updateOne);

// router.get("/emailstatus", emailstatusCtrl.findAll);
// router.post("/emailstatus", emailstatusCtrl.saveOne);
// router.put("/emailstatus/:id", emailstatusCtrl.updateOne);

// router.get("/email/send", emailCtrl.sendEmail);
// router.get("/email/check", emailCtrl.checkEmail);
router.post("/email/remind",
  auth.restrictSpectators,
  validate.validateBody("email", "remind"),
  emailCtrl.sendReminder);

router.get("/emaildraft", emaildraftCtrl.findAll);
router.put("/emaildraft/:id",
  auth.restrictSpectators,
  emaildraftCtrl.updateOne);
router.post("/emaildraft/:id",
  auth.restrictSpectators,
  emaildraftCtrl.saveOne);
router.delete("/emaildraft/:id",
  auth.restrictSpectators,
  emaildraftCtrl.deleteOne);

router.get("/notification", notificationCtrl.findAll);
router.post("/notification/read",
  auth.restrictSpectators,
  notificationCtrl.setRead);

router.use("", errorHandler.handleErrors);

module.exports = router;
