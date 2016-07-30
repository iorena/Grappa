"use strict";

const Grader = require("../models/Grader");

module.exports.findAll = (req, res) => {
  Grader
  .findAll()
  .then(graders => {
    res.status(200).send(graders);
  })
  .catch(err => {
    res.status(500).send({
      location: "Grader findAll .catch other",
      message: "Getting all Graders caused an internal server error.",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  Grader
  .saveOne(req.body)
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => {
    res.status(500).send({
      location: "Grader saveOne .catch other",
      message: "Saving Grader caused an internal server error.",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  Grader
  .update(req.body, { id: req.params.id })
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => {
    res.status(500).send({
      location: "Grader updateOne .catch other",
      message: "Updating Grader caused an internal server error.",
      error: err,
    });
  });
};
