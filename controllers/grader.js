"use strict";

const Grader = require("../models/Grader");

module.exports.findAll = (req, res, next) => {
  Grader
  .findAll()
  .then(graders => {
    res.status(200).send(graders);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  Grader
  .saveOne(req.body)
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  Grader
  .update(req.body, { id: req.params.id })
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => next(err));
};
