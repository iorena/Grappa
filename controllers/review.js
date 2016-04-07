"use strict";

const Review = require("../models/review");

module.exports.findAll = (req, res) => {
  Review
  .findAll()
  .then(reviews => {
    res.status(200).send(reviews);
  })
  .catch(err => {
    res.status(500).send({
      message: "Review findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  Review
  .saveOne(req.body)
  .then(review => {
    res.status(200).send(review);
  })
  .catch(err => {
    res.status(500).send({
      message: "Review saveOne produced an error",
      error: err,
    });
  });
};
