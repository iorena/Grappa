"use strict";

const StudyField = require("../models/StudyField");

module.exports.findAll = (req, res) => {
  StudyField
  .findAll()
  .then(studyfields => {
    res.status(200).send(studyfields);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  StudyField
  .saveOne(req.body)
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField saveOne produced an error",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  StudyField
  .update(req.body, { id: req.params.id })
  .then(studyfield => {
    res.status(200).send(studyfield);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField updateOne produced an error",
      error: err,
    });
  });
};
