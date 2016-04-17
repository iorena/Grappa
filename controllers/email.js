"use strict";

const Sender = require("../services/EmailSender");
const Reader = require("../services/EmailReader");
const Reminder = require("../services/EmailReminder");

const Thesis = require("../models/thesis");

module.exports.sendReminder = (req, res) => {
  Thesis
  .findOne({ author: "Pekka Graduttaja" })
  .then(thesis => {
    // console.log(thesis);
    // return Reminder.sendStudentReminder(thesis);
    // return Reminder.sendProfessorReminder(thesis);
    return Reminder.sendPrintPersonReminder(thesis);
  })
  .then(result => {
    res.status(200).send({
      result,
    });
  })
  .catch(err => {
    res.status(500).send({
      message: "sendEmail hajos",
      error: err,
    });
  });
};

module.exports.sendEmail = (req, res) => {
  Sender
  .sendEmail("ohtugrappa@gmail.com", "Viestin Otsikko", "asdf\nasdf\n\n\tasdfasdf\ntext")
  .then(info => {
    res.status(200).send({
      info,
    });
  })
  .catch(err => {
    res.status(500).send({
      message: "sendEmail hajos",
      error: err,
    });
  });
};

module.exports.checkEmail = (req, res) => {
  Reader
  .checkEmail()
  .then(() => {
    res.status(200).send({
      message: "Emails checked succesfully",
    });
  })
  .catch(err => {
    res.status(500).send({
      message: "checkEmail hajos",
      error: err,
    });
  });
};
