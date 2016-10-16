"use strict";

const EmailDraft = require("../models/EmailDraft");

module.exports.findAll = (req, res, next) => {
  EmailDraft
  .findAll()
  .then(drafts => {
    res.status(200).send(drafts);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  EmailDraft
  .update(req.body, { id: req.params.id })
  .then(rows => {
    res.status(200).send(rows);
  })
  .catch(err => next(err));
};
