"use strict";

const Reminder = require("../services/EmailReminder");

const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.sendReminder = (req, res, next) => {
  Thesis
  .findOne(req.body.thesisId)
  .then(thesis => {
    if (!thesis) {
      throw new errors.NotFoundError("No Thesis found with the provided thesisId.");
    } else {
      if (req.body.reminderType === "EthesisReminder") {
        return Reminder.sendEthesisReminder(thesis, thesis.CouncilMeeting);
      } else if (req.body.reminderType === "GraderEvalReminder") {
        return Reminder.sendProfessorReminder(thesis);
      } else if (req.body.reminderType === "PrintReminder") {
        return Reminder.sendPrintPersonReminder(thesis);
      } else {
        // should never end up here as bodyValidations forbid that
        throw new errors.BadRequestError("Invalid reminderType.");
      }
    }
  })
  .then(result => {
    res.status(200).send(result);
  })
  .catch(err => next(err));
};
