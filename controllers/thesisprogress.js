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

module.exports.findOne = (req, res) => {
  ThesisProgress
  .findOne({ id: req.params.id })
  .then(thesisprogress => {
    res.status(200).send(thesisprogress);
  })
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress findOne produced an error",
      error: err,
    });
  });
};

module.exports.updateEval = (req, res) => {
  console.log("yolo");
  let theprog;
  theprog = ThesisProgress
  .findOne({ thesisId: req.body.id })
  .then(thesisprog => {
    return thesisprog;
  });
  if(req.body.graderEvaluation !== "") {
      theprog.gradersStatus = true;
  }

  ThesisProgress
  .update(theprog, ({thesisId: req.body.id}))
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress updateEval produced an error",
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
