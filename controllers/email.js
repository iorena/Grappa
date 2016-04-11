"use strict";

const Imap = require('imap');
const inspect = require('util').inspect;

const sender = require("./EmailSender");
const reader = require("./EmailReader");

module.exports.sendEmail = (req, res) => {
  sender
  .sendEmail("teemu.koivisto@helsinki.fi", "Viestin Otsikko", "asdf\nasdf\n\n\tasdfasdf\ntext")
  .then(info => {
    res.send({
      info,
    })
  })
  .catch(err => {
    res.status(500).send({
      message: "sendEmail hajos",
      error: err,
    })
  })
}

module.exports.checkEmail = (req, res) => {
  reader
  .openImap()
  .then(() => {
    return reader.openInbox();
  })
  .then(box => {
    return reader.readInbox(box);
  })
  .then(() => {
    res.status(200).send({
      message: "Emails checked succesfully"
    });
  })
  .catch(err => {
    res.status(500).send({
      message: "checkEmail hajos",
      error: err,
    })
  })
}
