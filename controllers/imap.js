"use strict";

var Imap = require('imap'),
    inspect = require('util').inspect;

const reader = require("./EmailReader");

module.exports.checkEmail = (req, res) => {
  reader
  .openImap()
  .then(() => {
    return reader.openInbox();
  })
  .then((box) => {
    return reader.readInbox(box);
  })
  .then(() => {
    res.send({
      message: "asdf",
    })
  })
  .catch((err) => {
    res.send({
      error: err,
    })
  })
}
