"use strict";

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

const fs = require("fs");
const ValidationError = require("../config/errors").ValidationError;

module.exports.findAllByUserRole = (req, res) => {
  Thesis
  .findAllByUserRole(req.user)
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => {
    res.status(500).send({
      location: "Thesis findAll .catch other",
      message: "Getting all Theses caused an internal server error.",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  let parsedForm;
  let savedThesis;
  let foundConnections;

  // console.log(req.headers);
  // console.log(req.body)
  FormParser
  .parseFormData(req)
  .then(data => {
    // console.log("data")
    // console.log(data)
    parsedForm = data;
    parsedForm.json = JSON.parse(parsedForm.json);
    if (!parsedForm.json) {
      throw new ValidationError("Invalid form");
    } else if (!parsedForm.file) {
      throw new ValidationError("No file sent");
    } else if (parsedForm.fileExt !== "pdf") {
      throw new ValidationError("File wasn't a PDF");
    // } else if (validate.isDataValidSchema(parsedForm.json, "thesis")) {
    } else {
      return Thesis.checkIfExists(parsedForm.json);
    }
  })
  .then(exists => {
    if (exists) {
      throw new ValidationError("Duplicate Thesis found");
    } else {
      return Thesis.findConnections(parsedForm.json);
    }
  })
  .then(connections => {
    if (!connections[0]) {
      throw new ValidationError("No such CouncilMeeting found");
    } else if (!connections[1]) {
      throw new ValidationError("No such StudyField found");
    } else if (connections[2] < 2) {
      throw new ValidationError("Less than 2 valid Graders found");
    } else if (!connections[3]) {
      throw new ValidationError("StudyField has no professor");
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
  .then(() => {
    return Thesis.findOne({ id: savedThesis.id });
  })
  .then((thesisWithConnections) => {
    res.status(200).send(thesisWithConnections);
  })
  .catch(err => {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(400).send({
        location: "Thesis saveOne .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else if (err.name === "PremiseError") {
      res.status(400).send({
        location: "Thesis saveOne .catch PremiseError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "Thesis saveOne .catch other",
        message: "Saving a Thesis caused an internal server error.",
        error: err,
      });
    }
  });
};

module.exports.updateOneAndConnections = (req, res) => {
  if (req.user.role === "professor" && req.body.graderEval && req.body.graderEval.length > 0) {
    Thesis
    .update({ graderEval: req.body.graderEval }, { id: req.body.id })
    .then(() => {
      return ThesisProgress.setGraderEvalDone(req.body.id);
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({
        location: "Thesis updateOne .catch other",
        message: "Updating Thesis caused an internal server error.",
        error: err,
      });
    });
  } else if (req.user.role === "admin") {
    Thesis
    .update(req.body, { id: req.body.id })
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({
        location: "Thesis updateOne .catch other",
        message: "Updating Thesis caused an internal server error.",
        error: err,
      });
    });
  } else {
    res.status(401).send({
      location: "Thesis updateOne else role",
      message: "Missing privileges.",
      error: err,
    });
  }
};

module.exports.updateOneEthesis = (req, res) => {
  let foundEtoken;

  EthesisToken
  .findOne({ token: req.body.token })
  .then(etoken => {
    if (!etoken) {
      throw new ValidationError("No EthesisToken found with the provided token. Ask admin to manually input the ethesis link.");
    } else if (etoken.expires && etoken.expires < new Date()) {
      throw new ValidationError("Token has expired. Ask admin to manually input the ethesis link.");
    } else {
      foundEtoken = etoken;
      return Thesis.update({ ethesis: req.body.link }, { id: etoken.ThesisId });
    }
  })
  .then(thesis => ThesisProgress.setEthesisDone(foundEtoken.ThesisId))
  .then(() => EthesisToken.setToExpire(foundEtoken.ThesisId))
  .then(() => {
    res.status(200).send();
  })
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        location: "Thesis updateOneEthesis .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "Thesis updateOneEthesis .catch other",
        message: "Updating Thesis' ethesis link caused an internal server error.",
        error: err,
      });
    }
  });
};

module.exports.generateThesesToPdf = (req, res) => {
  // console.log(req.headers)
  const thesisIDs = req.body;
  let professors;
  let pathToFile;

  if (thesisIDs && thesisIDs.length > 0) {
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
    .catch(err => {
      res.status(500).send({
        location: "Thesis generateThesesToPdf .catch other",
        message: "Generating Theses' to pdf caused an internal server error.",
        error: err,
      });
    });
  } else {
    res.status(400).send({
      location: "Thesis generateThesesToPdf if !thesisIDs",
      message: "No thesis ids received",
      error: {},
    });
  }
};

module.exports.deleteOne = (req, res) => {
  Thesis
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send();
    } else {
      res.status(404).send({
        location: "Thesis deleteOne deletedRows === 0",
        message: "No thesis found",
        error: {},
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      location: "Thesis deleteOne .catch other",
      message: "Deleting Thesis caused an internal server error.",
      error: err,
    });
  });
};
