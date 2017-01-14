"use strict";

const ThesisProgress = require("../models/ThesisProgress");

module.exports.updateOne = (req, res, next) => {
  ThesisProgress
  .update(req.body, { id: req.params.id })
  .then(rows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
