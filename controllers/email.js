"use strict";

const Sender = require("../services/EmailSender");
const Reader = require("../services/EmailReader");
const Reminder = require("../services/EmailReminder");
const tokenGen = require("../services/TokenGenerator");

const Thesis = require("../models/thesis");

/**
* Method for sending an email reminder to the professor, student or (printperson?)
*@param {Object} req - The build of req.body being {thesis[], "professor/student"}
*/
module.exports.sendReminder = (req, res) => {
  if (req.body.type === "professor"){
    Reminder.sendProfessorReminder(req.body.thesis)
    .then(result => {
      res.status(200).send({
        result,
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "sendProfessorReminder hajos",
        error: err,
      });
    });
  } else if (req.body.type === "student") {
    const token = tokenGen.generateEthesisToken(req.body.thesis.author, req.body.thesis.id);
    Reminder.sendStudentReminder(req.body.thesis.email, token, req.body.thesis.id)
    .then(result => {
      res.status(200).send({
        result,
      });
    })
    // .catch(err => {
    //   res.status(500).send({
    //     message: "sendStudentReminder hajos",
    //     error: err,
    //   });
    // });
  } else if (req.body.type === "print") {
    Reminder.sendPrintPersonReminder(req.body.thesis)
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
  } else {
    res.status(500).send({
      message: "Type not professor, print or student",
    });
  }
};

module.exports.sendEmail = (req, res) => {
  Sender
  .sendEmail("ohtugrappa@gmail.com", "Viestin Otsikko", "Heippa!")
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
    console.log(err);
    res.status(500).send({
      message: "checkEmail hajos",
      error: err,
    });
  });
};
