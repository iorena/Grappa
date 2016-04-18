"use strict";

const Reminder = require("../services/EmailReminder");
const tokenGen = require("../services/TokenGenerator");

const Thesis = require("../models/thesis");
const EthesisToken = require("../models/ethesisToken");
const ThesisProgress = require("../models/thesisprogress");
const CouncilMeeting = require("../models/councilmeeting");
const Grader = require("../models/grader");

module.exports.findAll = (req, res) => {
  Thesis
  .findAll()
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis findAll produced an error",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  console.log(req.body);
  Thesis
  .update(req.body, { id: req.body.id })
  .then(thesis => {
    res.status(200).send(thesis);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis update produced an error",
      error: err,
    });
  });
};

/*
 * Saves a single thesis, links it to a bunch of stuff and sends an email
 *
 * Required fields for a thesis:
 * author, email, deadline, graders?, and stuff?
 */
module.exports.saveOne = (req, res) => {
  let savedthesis;
  let foundCouncilMeeting;
  const originalDate = new Date(req.body.deadline);

  CouncilMeeting
  .findOne({ date: originalDate })
  .then(cm => {
    // console.log("cm : ");
    // console.log(cm);
    if (cm === null) {
      throw new TypeError("ValidationError: unvalid deadline, no such CouncilMeeting found");
    } else {
      foundCouncilMeeting = cm;
      if (typeof req.body.graders === "undefined") {
        return Promise.resolve();
      }
      return Promise.all(req.body.graders.map(grader => Grader.saveIfDoesntExist(grader)));
    }
  })
  .then(() => Thesis.saveOne(req.body))
  .then(thesis => {
    savedthesis = thesis;
    const token = tokenGen.generateEthesisToken(thesis.author);
    return Promise.all([
      EthesisToken.saveOne({ thesisId: thesis.id,
                             author: thesis.author,
                             token,
                           }),
      Reminder.sendStudentReminder(thesis, token),
      ThesisProgress.saveOne(thesis),
      CouncilMeeting.linkThesisToCouncilMeeting(thesis, originalDate),
      Grader.linkThesisToGraders(thesis, req.body.graders),
    ]);
  })
  .then(() => ThesisProgress.evaluateGraders(savedthesis))
  .then(() => {
    res.status(200).send(savedthesis);
  })
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
