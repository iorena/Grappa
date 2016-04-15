"use strict";

const Sender = require("../services/EmailSender");
const Reader = require("../services/EmailReader");

module.exports.sendEmail = (req, res) => {
  Sender
  .sendEmail("teemu.koivisto@helsinki.fi", "Viestin Otsikko", "asdf\nasdf\n\n\tasdfasdf\ntext")
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
