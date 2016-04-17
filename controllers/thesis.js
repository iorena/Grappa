"use strict";

const Reminder = require("../services/EmailReminder");

const Thesis = require("../models/thesis");
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

module.exports.saveOne = (req, res) => {
  let savedthesis;
  const originalDate = new Date(req.body.deadline);

  Grader.saveIfDoesntExist(req.body);

  Thesis
  .saveOne(req.body)
  .then(thesis => {
    savedthesis = thesis;
    return Promise.all([
      Reminder.sendStudentReminder(thesis),
      ThesisProgress.saveOne(thesis),
      CouncilMeeting.addThesisToCouncilMeeting(thesis, originalDate),
      Grader.linkGraderAndThesis(req.body.grader, req.body.gradertitle, thesis),
      Grader.linkGraderAndThesis(req.body.grader2, req.body.grader2title, thesis),
    ]);
  })
  .then(() => ThesisProgress.evaluateGraders(savedthesis))
  .then(() => {
    res.status(200).send(savedthesis);
  })
  .catch(err => {
    if (err.message.indexOf("ValidationError") !== -1) {
      res.status(400).send({
        message: "Thesis saveOne failed validation",
        error: err.message,
      });
    } else {
      res.status(500).send({
        message: "Thesis saveOne produced an error",
        error: err.message,
      });
    }
  });
};
