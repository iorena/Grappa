"use strict";

const fs = require("fs");

const Reminder = require("../services/EmailReminder");
const TokenGen = require("../services/TokenGenerator");
const FormParser = require("../services/FormParser");
const PdfManipulator = require("../services/PdfManipulator");

const Thesis = require("../models/Thesis");
const EthesisToken = require("../models/EthesisToken");
const ThesisReview = require("../models/ThesisReview");
const ThesisProgress = require("../models/ThesisProgress");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");
const User = require("../models/User");

const errors = require("../config/errors");

module.exports.findAllByUserRole = (req, res) => {
  Thesis
  .findAllByUserRole(req.user)
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res) => {
  let parsedForm;
  let savedThesis;
  let foundConnections;

  FormParser
  .parseFormData(req)
  .then(data => {
    parsedForm = data;
    parsedForm.json = JSON.parse(parsedForm.json);
    if (!parsedForm.json) {
      throw new errors.BadRequestError("No json field inside form.");
    } else if (!parsedForm.file) {
      throw new errors.BadRequestError("No file sent.");
    } else if (parsedForm.fileExt !== "pdf") {
      throw new errors.BadRequestError("File wasn't a PDF.");
    } else {
      return Thesis.checkIfExists(parsedForm.json);
    }
  })
  .then(exists => {
    if (exists) {
      throw new errors.BadRequestError("Duplicate Thesis found.");
    } else {
      return Thesis.findConnections(parsedForm.json);
    }
  })
  .then(connections => {
    if (!connections[0]) {
      throw new errors.NotFoundError("No such CouncilMeeting found.");
    } else if (!connections[1]) {
      throw new errors.NotFoundError("No such StudyField found.");
    } else if (connections[2] < 2) {
      throw new errors.BadRequestError("Less than 2 valid Graders found.");
    } else if (!connections[3]) {
      throw new errors.BadRequestError("StudyField has no professor.");
    }
    foundConnections = connections;
    return Thesis.saveOneAndProgress(parsedForm.json, foundConnections[0]);
  })
  .then(thesis => {
    savedThesis = thesis;
    return Promise.all([
      ThesisReview.saveOne({
        pdf: parsedForm.file,
        ThesisId: thesis.id,
        UserId: req.user.id,
      }),
      Reminder.sendEthesisReminder(savedThesis),
      CouncilMeeting.linkThesis(foundConnections[0], savedThesis),
      Grader.linkThesisToGraders(foundConnections[2], savedThesis.id),
      Thesis.linkStudyField(savedThesis, foundConnections[1].id),
      Thesis.linkUser(savedThesis, req.user.id),
    ]);
  })
  .then(() => {
    if (ThesisProgress.isGraderEvaluationNeeded(savedThesis.id, parsedForm.json.Graders)) {
      return Reminder.sendProfessorReminder(savedThesis);
    } else {
      return ThesisProgress.setGraderEvalDone(savedThesis.id);
    }
  })
  .then(() => Thesis.findOne({ id: savedThesis.id }))
  .then((thesisWithConnections) => {
    res.status(200).send(thesisWithConnections);
  })
  .catch(err => next(err));
};

module.exports.updateOneAndConnections = (req, res) => {
  let update = Promise.reject();

  if (req.user.role === "professor" && req.body.graderEval && req.body.graderEval.length > 0) {
    update = Thesis
    .update({ graderEval: req.body.graderEval }, { id: req.body.id })
    .then(() => {
      return ThesisProgress.setGraderEvalDone(req.body.id);
    })
  } else if (req.user.role === "admin") {
    update = Thesis
    .update(req.body, { id: req.body.id })
  }

  update
  .then(rows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.updateOneEthesis = (req, res) => {
  let foundEtoken;

  EthesisToken
  .findOne({ token: req.body.token })
  .then(etoken => {
    if (!etoken) {
      throw new errors.NotFoundError("No EthesisToken found with the provided token. Ask admin to manually input the ethesis link.");
    } else if (etoken.expires && etoken.expires < new Date()) {
      throw new errors.BadRequestError("Token has expired. Ask admin to manually input the ethesis link.");
    } else {
      foundEtoken = etoken;
      return Thesis.update({ ethesis: req.body.link }, { id: etoken.ThesisId });
    }
  })
  .then(thesis => ThesisProgress.setEthesisDone(foundEtoken.ThesisId))
  .then(() => EthesisToken.setToExpire(foundEtoken.ThesisId))
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.generateThesesToPdf = (req, res) => {
  const thesisIDs = req.body;
  let professors;
  let pathToFile;

  User
  .findAllProfessors()
  .then(dudes => {
    professors = dudes;
    return Thesis.findAllDocuments(thesisIDs);
  })
  .then((theses) => PdfManipulator.generatePdfFromTheses(theses, professors))
  .then((path) => {
    pathToFile = path;
    if (req.user.role === "print-person") {
      return Promise.all(thesisIDs.map(thesis_id => ThesisProgress.setPrintDone(thesis_id)));
    } else {
      return Promise.resolve();
    }
  })
  .then(() => {
    const file = fs.createReadStream(pathToFile);
    const stat = fs.statSync(pathToFile);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=theses.pdf");
    file.pipe(res);
  })
  .catch(err => next(err));
};

module.exports.deleteOne = (req, res) => {
  Thesis
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.sendStatus(200);
    } else {
      throw new errors.ForbiddenError("No thesis found.");
    }
  })
  .catch(err => next(err));
};
