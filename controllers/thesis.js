"use strict";

const Thesis = require("../models/thesis");

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
  Thesis
  .saveOne(req.body)
  .then(thesis => {
    res.status(200).send(thesis);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis saveOne produced an error",
      error: err,
    });
  });
};
