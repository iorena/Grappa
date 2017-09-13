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

module.exports.findAllGrades = (req, res, next) => {
  Thesis.findAllGrades()
    .then(theses => {
      res.status(200).send(theses);
    })
    .catch(err => next(err));
}

module.exports.saveOne = (req, res, next) => {
  let savedThesis;
  let foundConnections;
  let thesisForClient;

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
          Reminder.sendProfessorReminder(savedThesis),
          Reminder.sendSupervisingProfessorNotification(savedThesis)
        ]);
      } else {
        return Promise.all([
          Reminder.sendEthesisReminder(savedThesis, foundConnections[0]),
          Reminder.sendSupervisingProfessorNotification(savedThesis),
          ThesisProgress.setGraderEvalDone(savedThesis.id)
        ]);
      }
    })
    .then(() => Thesis.findOne({ id: savedThesis.id }))
    .then((thesisWithConnections) => {
      thesisForClient = thesisWithConnections;
      return SocketIOServer.broadcast(["admin", "print-person",
        `professor/${thesisWithConnections.StudyFieldId}`, `user/${thesisWithConnections.UserId}`],
        [{
          type: "THESIS_SAVE_ONE_SUCCESS",
          payload: thesisWithConnections,
          notification: `User ${req.user.fullname} saved a Thesis`,
        }], req.user)
    })
    .then(() => {
      res.status(200).send(thesisForClient);
    })
    .catch(err => next(err));
};

module.exports.updateOneAndConnections = (req, res, next) => {
  let updationPromises = [];
  const thesis = req.body.json;

  if (req.user.role === "professor" && req.user.StudyFieldId && req.user.StudyFieldId === thesis.StudyFieldId
    && thesis.graderEval && thesis.graderEval.length > 0) {
    updationPromises.push(
      Thesis.update({ graderEval: thesis.graderEval }, { id: thesis.id })
        .then(() => ThesisProgress.setGraderEvalDone(thesis.id))
    );
  } else if (req.user.role === "admin") {
    updationPromises.push(Thesis.update(thesis, { id: thesis.id }));
    updationPromises.push(Grader.removeThesisFromOtherGraders(thesis.Graders, thesis.id));
    updationPromises.push(Grader.linkThesisToGraders(thesis.Graders, thesis.id));
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
    updationPromises.push(Promise.reject(new errors.ForbiddenError("No permission to edit Thesis.")));
  }

  Promise.all(updationPromises)
    .then(rows => Thesis.findOne({ id: thesis.id }))
    .then(updatedThesis => SocketIOServer.broadcast(["admin", "print-person",
      `professor/${updatedThesis.StudyFieldId}`, `user/${updatedThesis.UserId}`],
      [{
        type: "THESIS_UPDATE_ONE_SUCCESS",
        payload: updatedThesis,
        notification: `User ${req.user.fullname} updated a Thesis`,
      }], req.user))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
};

module.exports.moveThesesToMeeting = (req, res, next) => {
  let foundMeeting;
  let dataForClient;
  let thesisIdPrintPairs = req.body.thesisIds.map(id => {
    return { id, printDone: undefined }
  });
  CouncilMeeting.findOne({ id: req.body.CouncilMeetingId })
    .then(meeting => {
      foundMeeting = meeting;
      if (!foundMeeting) {
        throw new errors.NotFoundError("No Councilmeeting found.");
      }
      return Promise.all(req.body.thesisIds.map(id =>
        Thesis.update({ CouncilMeetingId: foundMeeting.id }, { id })
      ))
    }).then(() => {
      const now = new Date();
      const councilMeetingDate = new Date(foundMeeting.date);
      if (councilMeetingDate > now) {
        thesisIdPrintPairs = thesisIdPrintPairs.map(thesis => {
          if (req.body.thesisIds.includes(thesis.id)) {
            return { id: thesis.id, printDone: false }
          }
          return thesis;
        })
        return Promise.all(req.body.thesisIds.map(id =>
          ThesisProgress.setPrintNotDone(id)
        ))
      }
      return Promise.resolve();
    }).then(() => {
      let theses =
        dataForClient = {
          CouncilMeetingId: req.body.CouncilMeetingId,
          CouncilMeeting: foundMeeting,
          theses: thesisIdPrintPairs,
        }
      return SocketIOServer.broadcast(["all"],
        [{
          type: "THESIS_MOVE_SUCCESS",
          payload: dataForClient,
          notification: `Admin ${req.user.fullname} moved Theses to another meeting`,
        }], req.user)
    })
    .then(() => {
      res.status(200).send(dataForClient);
    })
    .catch(err => next(err));
}

module.exports.uploadEthesisPDF = (req, res, next) => {
  let decodedToken;
  let thesisMoved = false;
  let forClient;

  Promise.resolve(TokenGenerator.verifyToken(req.params.token, { audience: "ethesis" }))
    .then((decoded) => {
      decodedToken = decoded;
      // return ThesisProgress.findOne({ ThesisId: decoded.thesis.id });
      return Promise.all([
        ThesisProgress.findOne({ ThesisId: decoded.thesis.id }),
        CouncilMeeting.findOne({ id: decoded.thesis.CouncilMeetingId }),
      ]);
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
      forClient = {
        message: thesisMoved ? "Your thesis has been moved to the next " +
          "Councilmeeting due to you missing your deadline" : ""
      };
      // TODO should be an update for ThesisProgress that Thesis reducer
      // will update to the correct Thesis
      return SocketIOServer.broadcast(["all"],
        [{
          type: "THESIS_UPLOAD_ETHESIS_PDF_SUCCESS",
          payload: forClient,
          notification: `Student uploaded their abstract`,
        }], { id: null })
    })
    .then(() => {
      if (req.body.regreq) {
        return Thesis.update({ regreq: req.body.regreq }, { id: decodedToken.thesis.id });
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      res.status(200).send(forClient);
    })
    .catch(err => next(err));
};

/**
 * Generates requested Theses to PDFs and sends them back to client
 * 
 * Also if the user has the role 'print-person' sets Theses printDone
 * to true to their ThesisProgress.
 */
module.exports.generateThesesToPdf = (req, res, next) => {
  let pathToFile;
  let setDone;

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
        setDone = true;
        return Promise.all(req.body.thesisIds.map(thesis_id =>
          ThesisProgress.setPrintDone(thesis_id))
        );
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      FileManipulator.pipeFileToResponse(pathToFile, "pdf", "theses.pdf", res)
      if (setDone) {
        return SocketIOServer.broadcast(["all"],
          [{
            type: "THESISPROGRESS_UPDATE_STATUS",
            payload: {
              status: "printDone",
              thesisIds: req.body.thesisIds,
            },
            notification: `Print-person ${req.user.fullname} downloaded theses`,
          }], req.user)
      }
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
      return Promise.all([
        ThesisProgress.delete({ ThesisId: req.params.id }),
        ThesisReview.delete({ ThesisId: req.params.id }),
        ThesisAbstract.delete({ ThesisId: req.params.id }),
        EmailStatus.delete({ ThesisId: req.params.id }),
        // Grader.delete({ ThesisId: req.params.id }),
      ])
    })
    .then(deletedRows => SocketIOServer.broadcast(["all"],
      [{
        type: "THESIS_DELETE_ONE_SUCCESS",
        payload: { id: parseInt(req.params.id, 10) },
        notification: `Admin ${req.user.fullname} deleted a Thesis`,
      }], req.user))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
};
