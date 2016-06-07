"use strict";

const EmailStatus = require("../models/email_status");

module.exports.findAll = (req, res) => {
  EmailStatus
  .findAll()
  .then(statuses => {
    res.status(200).send(statuses);
  })
  .catch(err => {
    res.status(500).send({
      message: "EmailStatus findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  EmailStatus
  .saveOne(req.body)
  .then(status => {
    res.status(200).send(status);
  })
  .catch(err => {
    res.status(500).send({
      message: "EmailStatus saveOne produced an error",
      error: err,
    });
  });
};
