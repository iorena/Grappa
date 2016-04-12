"use strict";

const Thesis = require("../models/thesis");
const Thesisprogress = require("../controllers/thesisprogress");
const Grader = require("../models/grader");

module.exports.findAll = (req, res) => {
  Thesis
  .findAll()
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  Grader.saveIfDoesntExist(req.body);
  Thesis
  .saveOne(req.body)
  .then(thesis => {
    Thesisprogress.saveThesisProgressFromNewThesis(thesis);
    // Thesisprogress.evalGraders(thesis);
    res.status(200).send(thesis);
  })
  .catch(err => {
    console.log("error" + err);
    res.status(500).send({
      message: "Thesis saveOne produced an error",
      error: err,
    });
  });
};
