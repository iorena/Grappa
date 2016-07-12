"use strict";

const Reminder = require("../services/EmailReminder");
const TokenGen = require("../services/TokenGenerator");
const FormParser = require("../services/FormParser");
const FileUploader = require("../services/FileUploader");
const PdfManipulator = require("../services/PdfManipulator");

const Thesis = require("../models/Thesis");
const EthesisToken = require("../models/EthesisToken");
const ThesisReview = require("../models/ThesisReview");
const ThesisProgress = require("../models/ThesisProgress");
// const ThesisPdf = require("../models/ThesisPdf");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");

const fs = require("fs");
const ValidationError = require("../config/errors").ValidationError;

module.exports.findAllByUserRole = (req, res) => {
  Thesis
  .findAllByUserRole(req.user)
  .then(theses => {
    res.status(200).send(theses);
  });
  // .catch(err => {
  //   res.status(500).send({
  //     message-: "Thesis findAllByUserRole produced an error",
  //     error: err,
  //   });
  // });
};

module.exports.findAllByCouncilMeeting = (req, res) => {
  Thesis
  .findAllByCouncilMeeting(req.body.CouncilMeetingId)
  .then(theses => {
    res.status(200).send(theses);
  });
  // .catch(err => {
  //   res.status(500).send({
  //     message-: "Thesis findAllByUserRole produced an error",
  //     error: err,
  //   });
  // });
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
    }
    foundConnections = connections;
    return Thesis.saveOneAndProgress(parsedForm.json, foundConnections[0]);
  })
  .then(thesis => {
    savedThesis = thesis;
    const token = TokenGen.generateEthesisToken(savedThesis.author, savedThesis.id);
    return Promise.all([
      ThesisReview.saveOne({
        pdf: parsedForm.file,
        ThesisId: thesis.id,
        UserId: req.user.id,
      }),
      EthesisToken.saveOne({
        thesisId: savedThesis.id,
        token,
      }),
      Reminder.sendEthesisReminder(savedThesis, token),
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
    console.error(err)
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
        message: "Thesis update produced an error",
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
        message: "Thesis update produced an error",
        error: err,
      });
    });
  }
};

module.exports.updateOneEthesis = (req, res) => {
  const thesis_id = TokenGen.decodeEthesisToken(req.body.token).thesisId;
  Thesis
   .update(req.body.thesis, { id: thesis_id })
   .then(thesis => ThesisProgress.setEthesisDone(thesis_id))
   .then(() => {
     res.status(200).send();
   })
   .catch(err => {
     res.status(500).send({
       message: "Thesis update produced an error",
       error: err,
     });
   });
};

module.exports.generateThesesToPdf = (req, res) => {
  // console.log(req.headers)
  const thesisIDs = req.body;
  Thesis
  .findAllDocuments(thesisIDs)
  .then((theses) => PdfManipulator.generatePdfFromTheses(theses))
  .then((pathToFile) => {
    const file = fs.createReadStream(pathToFile);
    const stat = fs.statSync(pathToFile);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=theses.pdf");
    file.pipe(res);
  });
  // .catch(err => {
  //   res.status(500).send({
  //     message: "Thesis generateThesesToPdf produced an error",
  //     error: err,
  //   });
  // });
};
