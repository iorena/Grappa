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
