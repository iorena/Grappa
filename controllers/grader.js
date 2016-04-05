"use strict";

const Grader = require("../models/councilmeeting");

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
