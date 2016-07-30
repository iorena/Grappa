"use strict";

const EmailDraft = require("../models/EmailDraft");

module.exports.findAll = (req, res) => {
  EmailDraft
  .findAll()
  .then(drafts => {
    res.status(200).send(drafts);
  })
  .catch(err => {
    res.status(500).send({
      location: "EmailDraft findAll .catch other",
      message: "Getting all EmailDrafts caused an internal server error.",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  EmailDraft
  .update(req.body, { id: req.params.id })
  .then(rows => {
    res.status(200).send(rows);
  })
  .catch(err => {
    res.status(500).send({
      location: "EmailDraft updateOne .catch other",
      message: "Updating EmailDraft caused an internal server error.",
      error: err,
    });
  });
};
