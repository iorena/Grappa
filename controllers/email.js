"use strict";

const EmailReminder = require("../services/EmailReminder");
const SocketIOServer = require("../services/SocketIOServer");

const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.sendReminder = (req, res, next) => {
  let savedEmail;

  Thesis
  .findOne(req.body.thesisId)
  .then(thesis => {
    if (!thesis) {
      throw new errors.NotFoundError("No Thesis found with the provided thesisId.");
    } else {
      if (req.body.reminderType === "EthesisReminder") {
        return EmailReminder.sendEthesisReminder(thesis, thesis.CouncilMeeting);
      } else if (req.body.reminderType === "GraderEvalReminder") {
        return EmailReminder.sendProfessorReminder(thesis);
      } else if (req.body.reminderType === "PrintReminder") {
        return EmailReminder.sendPrintPersonReminder(thesis);
      } else {
        // should never end up here as bodyValidations forbid that
        throw new errors.BadRequestError("Invalid reminderType.");
      }
    }
  })
  .then(emailStatus => {
    savedEmail = emailStatus;
    return SocketIOServer.broadcast(["admin"], [{
      type: "SEND_REMINDER_SUCCESS",
      payload: emailStatus,
      notification: `Admin ${req.user.fullname} sent a Reminder`,
    }], req.user)
  })
  .then(() => {
    res.status(200).send(savedEmail);
  })
  .catch(err => next(err));
};
