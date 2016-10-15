"use strict";

const Reminder = require("../services/EmailReminder");

const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.sendReminder = (req, res, next) => {
  Thesis
  .findOne(req.body.thesisId)
  .then(thesis => {
    if (!thesis) {
      throw new errors.NotFoundError("No Thesis found with the same id.");
    } else {
      if (req.body.reminderType === "EthesisEmail") {
        return Reminder.sendEthesisReminder(thesis);
      } else if (req.body.reminderType === "GraderEvalEmail") {
        return Reminder.sendProfessorReminder(thesis);
      } else if (req.body.reminderType === "PrintEvalEmail") {
        return Reminder.sendPrintReminder(thesis);
      } else {
        throw new errors.BadRequestError("Invalid reminderType.");
      }
    }
  })
  .then(result => {
    res.status(200).send(result);
  })
  .catch(err => next(err));
};
