"use strict";

const Reminder = require("../services/EmailReminder");
const TokenG = require("../services/TokenGenerator");

const Thesis = require("../models/thesis");

const ValidationError = require("../config/errors").ValidationError;

// Reminder.sendEthesisReminder(savedThesis, token),
// Reminder.sendProfessorReminder(savedThesis);
/**
* Method for sending an email reminder to the professor, student or (printperson?)
*@param {Object} req - The build of req.body being {thesis[], "professor/student"}
*/
module.exports.sendReminder = (req, res) => {
  console.log(req.body);

  Thesis
  .findOne(req.body.thesisId)
  .then(thesis => {
    if (!thesis) {
      throw new ValidationError("No Thesis found with the same id.");
    } else {
      if (req.body.reminderType === "EthesisEmail") {
        return Reminder.sendEthesisReminder(thesis);
      } else if (req.body.reminderType === "GraderEvalEmail") {
        return Reminder.sendProfessorReminder(thesis);
      } else if (req.body.reminderType === "PrintEvalEmail") {
        return Reminder.sendPrintReminder(thesis);
      } else {
        throw new ValidationError("Invalid reminderType.");
      }
    }
  })
  .then(result => {
    res.status(200).send(result);
  })
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        location: "Email sendReminder .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else if (err.name === "PremiseError") {
      res.status(400).send({
        location: "Email sendReminder .catch PremiseError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "Email sendReminder .catch other",
        message: "Sending EmailReminder caused an internal server error.",
        error: err,
      });
    }
  });
};
