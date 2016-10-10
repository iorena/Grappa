"use strict";

const StudyField = require("../models/StudyField");

module.exports.findAll = (req, res) => {
  StudyField
  .findAll()
  .then(studyfields => {
    res.status(200).send(studyfields);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res) => {
  StudyField
  .saveOne(req.body)
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res) => {
  StudyField
  .update(req.body, { id: req.params.id })
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => next(err));
};
