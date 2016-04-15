"use strict";

const Reminder = require("../services/EmailReminder");

const Thesis = require("../models/thesis");
const Thesisprogress = require("../controllers/thesisprogress");
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
  .then(theses => {
    res.status(200).send(theses);
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
  let thesisValues;
  if (req.body.deadline !== null) {
    thesisValues = addCorrectDeadline(req.body);
  }
  Grader.saveIfDoesntExist(req.body);

  Thesis
  .saveOne(thesisValues)
  .then(thesis => {
    savedthesis = thesis;
    return Promise.all([
      Reminder.sendStudentReminder(thesis),
      Thesisprogress.saveThesisProgressFromNewThesis(thesis),
      addMeetingdateidAndThesisIdToCouncilMeetingTheses(thesis, originalDate),
      Grader.linkGraderAndThesis(req.body.grader, req.body.gradertitle, thesis),
      Grader.linkGraderAndThesis(req.body.grader2, req.body.grader2title, thesis),
    ]);
  })
  .then((stuff) => Thesisprogress.evalGraders(savedthesis))
  .then(() => {
    res.status(200).send(savedthesis);
  })

  .catch(err => {
    res.status(500).send({
      message: "Thesis saveOne produced an error",
      error: err,
    });
  });
};

function addCorrectDeadline(thesisValues) {
  const date = new Date(thesisValues.deadline);
  date.setDate(date.getDate() - 10);
  thesisValues.deadline = date.toISOString();
  return thesisValues;
};

function addMeetingdateidAndThesisIdToCouncilMeetingTheses(thesis, date) {
  CouncilMeeting
  .getModel()
  .findOne({ where: { date: new Date(date) } })
  .then(function(cm){
    cm
    .addTheses(thesis)
    .then(() => {
      console.log("Thesis linked to councilmeeting")
    });
  });
}
