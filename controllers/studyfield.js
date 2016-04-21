"use strict";

const StudyField = require("../models/studyfield");

module.exports.findAll = (req, res) => {
  StudyField
  .findAll(req.body)
  .then(studfields => {
    res.status(200).send(studfields);
  })
  .catch(err => {
    res.status(500).send({
      message: "StudyField findAll produced an error",
      error: err.message,
    });
  });
};
