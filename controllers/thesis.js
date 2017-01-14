"use strict";

const Reminder = require("../services/EmailReminder");
const TokenGenerator = require("../services/TokenGenerator");
const PdfManipulator = require("../services/PdfManipulator");
const FileManipulator = require("../services/FileManipulator");
const SocketIOServer = require("../services/SocketIOServer");

const Thesis = require("../models/Thesis");
const ThesisReview = require("../models/ThesisReview");
const ThesisAbstract = require("../models/ThesisAbstract");
const ThesisProgress = require("../models/ThesisProgress");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");
const EmailStatus = require("../models/EmailStatus");
const User = require("../models/User");

const errors = require("../config/errors");

module.exports.findAllByUserRole = (req, res, next) => {
  User
  .findOne({ id: req.user.id })
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
      throw new errors.BadRequestError("Less than 2 Graders found.");
    } else if (!connections[3]) {
      throw new errors.BadRequestError("StudyField has no professor.");
    } else if (new Date() > connections[0].instructorDeadline) {
      throw new errors.ForbiddenError("Deadline for the CouncilMeeting has passed. Please select other meeting or contact admin about resubmitting.");
    }
    foundConnections = connections;
    return Thesis.saveOneAndProgress(req.body.json, foundConnections[0]);
  })
  .then(thesis => {
    savedThesis = thesis;
    return Promise.all([
      ThesisReview.saveOne({
        pdf: req.body.files[0].buffer,
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
        Reminder.sendEthesisReminder(savedThesis, foundConnections[0]),
        Reminder.sendProfessorReminder(savedThesis)
      ]);
    } else {
      return Promise.all([
        Reminder.sendEthesisReminder(savedThesis, foundConnections[0]),
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
  // console.log("wut", req.body.files)
  let updationPromises = [];
  const thesis = req.body.json;

  if (req.user.role === "professor" && thesis.graderEval && thesis.graderEval.length > 0) {
    updationPromises.push(
      Thesis.update({ graderEval: thesis.graderEval }, { id: thesis.id })
      .then(() => ThesisProgress.setGraderEvalDone(thesis.id))
    );
  } else if (req.user.role === "admin") {
    updationPromises.push(Thesis.update(thesis, { id: thesis.id }));
    req.body.files.map(item => {
      if (item.filetype === "GraderReviewFile") {
        updationPromises.push(ThesisReview.update({ pdf: item.buffer }, { ThesisId: thesis.id }));
      } else if (item.filetype === "AbstractFile") {
        updationPromises.push(
          PdfManipulator.parseAbstractFromThesisPDF(item.buffer)
          .then((pathToFile) => FileManipulator.readFileToBuffer(pathToFile))
          .then(buffer => ThesisAbstract.update({ pdf: buffer }, { ThesisId: thesis.id }))
          .then(() => ThesisProgress.setEthesisDone(thesis.id))
        );
      }
    })
  } else {
    updationPromises.push(new errors.ForbiddenError("No permission to edit Thesis."));
  }
  
  Promise.all(updationPromises)
  .then(rows => {
    Thesis
    .findOne({ id: thesis.id })
    .then(found => SocketIOServer.broadcast(
      ["admin", "print-person", `professor/${found.StudyFieldId}`, `user/${found.UserId}`],
      [{
        type: "THESIS_UPDATE_ONE_SUCCESS",
        payload: found,
      }]
    ))
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.moveThesesToMeeting = (req, res, next) => {
  CouncilMeeting
  .findOne({ id: req.body.CouncilMeetingId })
  .then(meeting => {
    if (meeting) {
      return Promise.all(req.body.thesisIds.map(id =>
        Thesis.update({ CouncilMeetingId: meeting.id }, { id, })
      ))
    } else {
      throw new errors.NotFoundError("No Councilmeeting found.");
    }
  })
  .then(rows => {
    // TODO client has to update theses X_X
    res.sendStatus(200);
  })
  .catch(err => next(err));
}

module.exports.uploadEthesisPDF = (req, res, next) => {
  let decodedToken;
  let thesisMoved = false;

  Promise.resolve(TokenGenerator.decodeToken(req.params.token))
  .then((decoded) => {
    if (!decoded || decoded.name !== "ethesis") {
      throw new errors.BadRequestError("Invalid token.");
    } else {
      decodedToken = decoded;
      // return ThesisProgress.findOne({ ThesisId: decoded.thesis.id });
      return Promise.all([
        ThesisProgress.findOne({ ThesisId: decoded.thesis.id }),
        CouncilMeeting.findOne({ id: decoded.thesis.CouncilMeetingId }),
      ]);
    }
  })
  .then(resolvedArray => {
    if (!resolvedArray[0]) {
      throw new errors.NotFoundError("No ThesisProgress found for the Thesis. Please inform admin that something terrible has happened to the database :(.");
      // } else if (TokenGenerator.isTokenExpired(decoded)) {
    } else if (resolvedArray[0].ethesisDone) {
      throw new errors.BadRequestError("Your PDF has already been uploaded to the system.");
    } else if (new Date() > resolvedArray[1].studentDeadline) {
      // throw new errors.ForbiddenError("Deadline for the CouncilMeeting has passed. Please contact admin about resubmitting.");
      // TODO find the next councilmeeting
      return CouncilMeeting.findOne({
          date: { gt: resolvedArray[1].date }
        })
        .then(meeting => {
          if (meeting) {
            thesisMoved = true;
            return Thesis.update({ CouncilMeetingId: meeting.id }, { id: decodedToken.thesis.id })
              .then(() => PdfManipulator.parseAbstractFromThesisPDF(req.body.files[0].buffer));
          } else {
            throw new errors.NotFoundError("No next Councilmeeting found, please contact admin about the schedule or just wait, you know he/she might be adding a new one when they feel like it. Either way it's your fault missing your deadline ;(");
          }
        })
    } else {
      return PdfManipulator.parseAbstractFromThesisPDF(req.body.files[0].buffer);
    }
  })
  .then((pathToFile) => FileManipulator.readFileToBuffer(pathToFile))
  .then((buffer) => {
    return Promise.all([
      ThesisAbstract.saveOne({
        pdf: buffer,
        ThesisId: decodedToken.thesis.id,
      }),
      ThesisProgress.setEthesisDone(decodedToken.thesis.id),
    ]);
  })
  .then(() => {
    const message = thesisMoved ? "Your thesis has been moved to the next " +
    "Councilmeeting due to you missing your deadline" : "";
    res.status(200).send({ message, });
  })
  .catch(err => next(err));
};

module.exports.generateThesesToPdf = (req, res, next) => {
  let pathToFile;

  Promise.all([
    Thesis.findAllDocuments(req.body.thesisIds),
    User.findAllProfessors(),
    CouncilMeeting.findMeetingAndSequence(req.body.CouncilMeetingId)
  ])
  .then(responses => {
    return PdfManipulator.generatePdfFromTheses(responses[0], responses[1], responses[2]);
  })
  .then((path) => {
    pathToFile = path;
    if (req.user.role === "print-person") {
      return Promise.all(req.body.thesisIds.map(thesis_id =>
        ThesisProgress.setPrintDone(thesis_id))
      );
    } else {
      return Promise.resolve();
    }
  })
  .then(() => {
    FileManipulator.pipeFileToResponse(pathToFile, "pdf", "theses.pdf", res)
  })
  .catch(err => next(err));
};

module.exports.serveThesisDocument = (req, res, next) => {
  let promise;

  if (req.body.type === "review") {
    promise = ThesisReview.findOne({ ThesisId: req.body.id });
  } else if (req.body.type === "abstract") {
    promise = ThesisAbstract.findOne({ ThesisId: req.body.id });
  }

  promise
  .then(doc => {
    if (doc) {
      res.contentType("application/pdf");
      res.send(doc.pdf);
    } else {
      throw new errors.NotFoundError("No document found.");
    }
  })
  .catch(err => next(err));
}

module.exports.deleteOne = (req, res, next) => {
  Thesis
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      return Promise.all([
        ThesisProgress.delete({ ThesisId: req.params.id }),
        ThesisReview.delete({ ThesisId: req.params.id }),
        ThesisAbstract.delete({ ThesisId: req.params.id }),
        EmailStatus.delete({ ThesisId: req.params.id }),
        // Grader.delete({ ThesisId: req.params.id }),
      ])
    } else {
      throw new errors.NotFoundError("No thesis found.");
    }
  })
  .then(() => {
    // SocketIOServer.broadcast(["admin", "print-person", "professor/{thesis-studyfield}", "user/{thesis-user.id}"], "thesis", delete", thesisId);
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
