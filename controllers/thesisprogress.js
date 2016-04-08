"use strict";

const ThesisProgress = require("../models/thesisprogress");


module.exports.findAll = (req, res) => {
  ThesisProgress
  .findAll()
  .then(thesisprogresses => {
    res.status(200).send(thesisprogresses);
  })
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  ThesisProgress
  .saveOne(req.body)
  .then(thesisprogress => {
    res.status(200).send(thesisprogress);
  })
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress saveOne produced an error",
      error: err,
    });
  });
};
module.exports.saveThesisProgressFromNewThesis = (thesis) => {
  ThesisProgress.saveOne({thesisId : thesis.id, ethesisReminder: null, professorReminder: null, 
    documentsSent: null, isDone: false , gradersStatus: false});
  console.log("Thesisprogress saved!")
};
