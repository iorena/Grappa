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
      message: "Grader findAll produced an error",
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
      message: "Grader saveOne produced an error",
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
      message: "Grader updateOne produced an error",
      error: err,
    });
  });
};
