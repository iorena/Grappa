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
      message: "EmailDraft findAll produced an error",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  EmailDraft
  .update(req.body, { id: req.params.id })
  .then(draft => {
    res.status(200).send(draft);
  })
  .catch(err => {
    res.status(500).send({
      message: "EmailDraft updateOne produced an error",
      error: err,
    });
  });
};
