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

module.exports.asdf2 = (req, res) => {
  ThesisPdf
  .findOne({ id: 6 })
  .then((pdf) => {
    fs.writeFile("./tmp/out.pdf", pdf.review, "base64", function (err) {
      console.log(err);
    });
    res.status(200).send("pdf seivattu");
  });
};

module.exports.asdf = (req, res) => {
  var pdf = fs.readFileSync("./tmp/print.pdf");
  console.log(pdf);
  // fs.writeFileSync("./tmp/out.pdf", pdf);
  ThesisReview
  .saveOne({ pdf: pdf })
  .then((savedPdf) => {
    return ThesisReview.findOne({ id: savedPdf.id });
  })
  .then((found) => {
    fs.writeFile("./tmp/out2.pdf", found.review, "base64", function (err) {
      console.log(err);
      res.status(200).send("pdf seivattu");
    });
  });
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
  let foundGraders;
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
    if (parsedForm.json === undefined || parsedForm.file === undefined) {
      throw new TypeError("Bad Request: Invalid form sent");
    } else if (parsedForm.fileExt !== "pdf") {
      throw new TypeError("Bad Request: File was not PDF");
    // } else if (validate.isDataValidSchema(parsedForm.json, "thesis")) {
    } else {
      return Thesis.checkIfExists(parsedForm.json);
    }
  })
  .then(exists => {
    if (exists) {
      throw new TypeError("ValidationError: Duplicate Thesis found");
    } else {
      return Thesis.findConnections(parsedForm.json);
    }
  })
  .then(connections => {
    if (connections[0] === null) {
      throw new TypeError("ValidationError: No such CouncilMeeting found");
    } else if (connections[1] === null) {
      throw new TypeError("ValidationError: No such StudyField found");
    } else if (connections[2] < 2) {
      throw new TypeError("ValidationError: Less than 2 valid Graders found");
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
      Reminder.sendStudentReminder(savedThesis.authorEmail, token, savedThesis.id),
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
    console.log(err);
    if (err.message.indexOf("ValidationError") !== -1) {
      res.status(400).send({
        location: "Thesis saveOne .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "Thesis saveOne .catch other",
        message: "Saving a Thesis caused internal server error.",
        error: err,
      });
    }
  });
};

module.exports.saveOne2 = (req, res) => {
  let savedThesis;
  let foundGraders;
  let foundConnections;

  // console.log(req.headers);
  // console.log(req.body)
  Thesis
  .checkIfExists(req.body)
  .then(exists => {
    if (exists) {
      throw new TypeError("ValidationError: Duplicate Thesis found");
    } else {
      return Thesis.findConnections(req.body);
    }
  })
  .then(connections => {
    if (connections[0] === null) {
      throw new TypeError("ValidationError: No such CouncilMeeting found");
    } else if (connections[1] === null) {
      throw new TypeError("ValidationError: No such StudyField found");
    }
    foundConnections = connections;
    if (req.body.Graders === undefined) {
      return;
    }
    return Promise.all(
      req.body.Graders.map(grader =>
        Grader.findOne({ id: grader.id })
      )
    );
  })
  .then((graders) => {
    foundGraders = graders;
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
      Grader.linkThesisToGraders(foundGraders, savedThesis.id),
      Thesis.linkStudyField(savedThesis, foundConnections[1].id),
      Thesis.linkUser(savedThesis, req.user.id),
    ]);
  })
  .then(() => {
    if (ThesisProgress.isGraderEvaluationNeeded(savedThesis.id, req.body.Graders)) {
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
    if (err.message.indexOf("ValidationError") !== -1) {
      res.status(400).send({
        location: "Thesis saveOne .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "Thesis saveOne .catch other",
        message: "Saving a Thesis caused internal server error.",
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

module.exports.uploadReview = (req, res) => {
  let parsedData;
  let pathToFile;

  FileUploader
  .parseUploadData(req, "pdf")
  .then(data => {
    parsedData = data;
    console.log(data.file);
    return Thesis.findOne({ id: data.id });
  })
  .then(thesis => {
    if (thesis) {
      return ThesisReview.saveOne({
        pdf: parsedData.file,
        ThesisId: parsedData.id,
        UserId: req.user.id,
      });
    } else {
      throw new Error("No thesis found");
    }
  })
  .then(() => {
    res.status(200).send();
  });
  // .catch(err => {
  //   res.status(500).send({
  //     message: "Thesis uploadReview produced an error",
  //     error: err,
  //   });
  // })
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
