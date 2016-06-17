"use strict";

const Reminder = require("../services/EmailReminder");
const TokenGen = require("../services/TokenGenerator");

const Thesis = require("../models/Thesis");
const EthesisToken = require("../models/EthesisToken");
const ThesisProgress = require("../models/ThesisProgress");
const ThesisPdf = require("../models/ThesisPdf");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");

const fs = require("fs");

module.exports.asdf = (req, res) => {
  ThesisPdf
  .findOne({ id: 6 })
  .then((pdf) => {
    fs.writeFile("./tmp/out.pdf", pdf.review, 'base64', function(err) {
      console.log(err);
    });
    res.status(200).send("pdf seivattu");
  })
};

module.exports.asdf = (req, res) => {
  var pdf = fs.readFileSync('./tmp/print.pdf');
  // fs.writeFileSync("./tmp/out.pdf", pdf);
  ThesisPdf
  .saveOne({ review: pdf })
  .then((savedPdf) => {
    return ThesisPdf.findOne({id: savedPdf.id})
  })
  .then((found) => {
    fs.writeFile("./tmp/out2.pdf", found.review, "base64", function(err) {
      console.log(err);
      res.status(200).send("pdf seivattu");
    });
  })
};

module.exports.sendPdf = (req, res) => {
  var file = fs.createReadStream("./tmp/print.pdf");
  var stat = fs.statSync("./tmp/print.pdf");
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=theses.pdf");
  file.pipe(res);
};

module.exports.findAllByUserRole = (req, res) => {
  Thesis
  .findAllByUserRole(req.user)
  .then(theses => {
    res.status(200).send(theses);
  });
  // .catch(err => {
  //   res.status(500).send({
  //     message: "Thesis findAllByUserRole produced an error",
  //     error: err,
  //   });
  // });
};

module.exports.saveOne = (req, res) => {
  let savedThesis;
  let savedGraders;
  let foundConnections;

  Thesis
  .findConnections(req.body)
  .then(connections => {
    if (connections[0] === null) {
      throw new TypeError("ValidationError: No such CouncilMeeting found");
    } else if (connections[1] === null) {
      throw new TypeError("ValidationError: No such StudyField found");
    }
    foundConnections = connections;
    if (req.body.graders === undefined) {
      return;
    }
    return Promise.all(
      req.body.graders.map(grader =>
        Grader.findOrCreate(grader)
      )
    );
  })
  .then((graders) => {
    savedGraders = graders;
    return Thesis.saveOneAndProgress(req.body, foundConnections[0]);
  })
  .then(thesis => {
    savedThesis = thesis;
    const token = TokenGen.generateEthesisToken(savedThesis.author, savedThesis.id);
    return Promise.all([
      EthesisToken.saveOne({
        thesisId: savedThesis.id,
        token,
      }),
      Reminder.sendStudentReminder(savedThesis.authorEmail, token, savedThesis.id),
      CouncilMeeting.linkThesis(foundConnections[0], savedThesis),
      Grader.linkThesisToGraders(savedGraders, savedThesis.id),
      Thesis.linkStudyField(savedThesis, foundConnections[1].id),
      Thesis.linkUser(savedThesis, req.user.id),
    ]);
  })
  .then(() => {
    if (ThesisProgress.isGraderEvaluationNeeded(savedThesis.id, req.body.graders)) {
      return Reminder.sendProfessorReminder(savedThesis);
    } else {
      return ThesisProgress.setGraderEvalDone(savedThesis.id);
    }
  })
  .then(() => {
    res.status(200).send(savedThesis);
  });
  // .catch(err => {
  //   if (err.message.indexOf("ValidationError") !== -1) {
  //     res.status(400).send({
  //       message: "Thesis saveOne failed validation",
  //       error: err.message,
  //     });
  //   } else {
  //     res.status(500).send({
  //       message: "Thesis saveOne produced an error",
  //       error: err.message,
  //     });
  //   }
  // });
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
