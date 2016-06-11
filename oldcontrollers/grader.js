"use strict";

const Grader = require("../models/grader");

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
  .update(req.body, req.params)
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

module.exports.deleteOne = (req, res) => {
  Grader
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({ message: "Grader with id: " + req.params.id + " successfully deleted" });
    }
    else {
      res.status(404).send({ message: "Grader to delete with id: " + req.params.id + " was not found" });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Grader deleteOne produced an error",
      error: err,
    });
  });
};
