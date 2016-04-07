"use strict";

const Thesisprogress = require("../models/thesisprogress");

module.exports.findAll = (req, res) => {
  Thesisprogress
  .findAll()
  .then(thesisprogresses => {
    res.status(200).send(thesisprogresses);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesisprogress findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  Thesisprogress
  .saveOne(req.body)
  .then(Thesisprogress => {
    res.status(200).send(thesisprogress);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesisprogress saveOne produced an error",
      error: err,
    });
  });
};
