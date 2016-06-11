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

module.exports.updateMany = (req, res) => {
  Promise.all(req.body.map(grader =>
    Grader.updateOne(grader)
  ))
  .then(rowsUpdated => {
    res.status(200).send(rowsUpdated);
  })
  .catch(err => {
    res.status(500).send({
      message: "Grader updateMany produced an error",
      error: err,
    });
  });
};
