"use strict";

const fs = require("fs");

const Reminder = require("../services/EmailReminder");
const TokenGen = require("../services/TokenGenerator");
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

module.exports.findAllByUserRole = (req, res, next) => {
  User
  .findOne(req.user.id)
  .then(user => Thesis.findAllByUserRole(user))
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  let savedThesis;
  let foundConnections;

  Thesis
  .checkIfExists(req.body.json)
  .then(exists => {
    if (exists) {
      throw new errors.BadRequestError("Duplicate Thesis found.");
    } else {
      return Thesis.findConnections(req.body.json);
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
    return Thesis.saveOneAndProgress(req.body.json, foundConnections[0]);
  })
  .then(thesis => {
    savedThesis = thesis;
    return Promise.all([
      ThesisReview.saveOne({
        pdf: req.body.file,
        ThesisId: thesis.id,
        UserId: req.user.id,
      }),
      CouncilMeeting.linkThesis(foundConnections[0], savedThesis),
      Grader.linkThesisToGraders(foundConnections[2], savedThesis.id),
      Thesis.linkStudyField(savedThesis, foundConnections[1].id),
      Thesis.linkUser(savedThesis, req.user.id),
    ]);
  })
  .then(() => {
    if (ThesisProgress.isGraderEvaluationNeeded(savedThesis.id, req.body.json.Graders)) {
      return Promise.all([
        Reminder.sendEthesisReminder(savedThesis),
        Reminder.sendProfessorReminder(savedThesis)
      ]);
    } else {
      return Promise.all([
        Reminder.sendEthesisReminder(savedThesis),
        ThesisProgress.setGraderEvalDone(savedThesis.id)
      ]);
    }
  })
  .then(() => Thesis.findOne({ id: savedThesis.id }))
  .then((thesisWithConnections) => {
    res.status(200).send(thesisWithConnections);
  })
  .catch(err => next(err));
};

module.exports.updateOneAndConnections = (req, res, next) => {
  let updatePromise = Promise.reject();

  if (req.user.role === "professor" && req.body.graderEval && req.body.graderEval.length > 0) {
    updatePromise = Thesis.update({ graderEval: req.body.graderEval }, { id: req.body.id })
      .then(() => ThesisProgress.setGraderEvalDone(req.body.id))
  } else if (req.user.role === "admin") {
    updatePromise = Thesis.update(req.body, { id: req.body.id })
  }

  updatePromise
  .then(rows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.updateOneEthesis = (req, res, next) => {
  let foundEtoken;

  Promise.resolve(TokenGenerator.decodeToken(req.body.token))
  .then((decoded) => {
    if (!decoded || decoded.name !== "ethesis") {
      throw new errors.BadRequestError("Invalid token.");
    // Rare case that could only happen if the thesis was late by a year ehhh....
    } else if (TokenGenerator.isTokenExpired(decoded)) {
      throw new errors.BadRequestError("Token has expired. Ask admin to manually input the ethesis link.");
    } else {
      decodedToken = decoded;
      // TODO should only find it by id since we've already decoded it :D silly essi
      return EthesisToken.findOne({ token: req.body.token });
    }
  })
  .then(etoken => {
    if (!etoken) {
      throw new errors.NotFoundError("No EthesisToken found with the provided token. Ask admin to manually input the ethesis link.");
    } else if (new Date() > etoken.expires) {
      throw new errors.BadRequestError("Token has expired. Ask admin to manually input the ethesis link.");
    } else {
      foundEtoken = etoken;
      return Promise.all([
        Thesis.update({ ethesis: req.body.link }, { id: etoken.ThesisId }),
        ThesisProgress.setEthesisDone(foundEtoken.ThesisId),
        EthesisToken.setToExpire(foundEtoken.ThesisId),
      ]);
    }
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.generateThesesToPdf = (req, res, next) => {
  let professors;
  let pathToFile;

  User
  .findAllProfessors()
  .then(dudes => {
    professors = dudes;
    return Thesis.findAllDocuments(req.body);
  })
  .then((theses) => PdfManipulator.generatePdfFromTheses(theses, professors))
  .then((path) => {
    pathToFile = path;
    if (req.user.role === "print-person") {
      return Promise.all(thesisIDs.map(thesis_id =>
        ThesisProgress.setPrintDone(thesis_id))
      );
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

module.exports.deleteOne = (req, res, next) => {
  Thesis
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.sendStatus(200);
    } else {
      throw new errors.NotFoundError("No thesis found.");
    }
  })
  .catch(err => next(err));
};
