"use strict";

const Review = require("../models/review");

module.exports.findAll = (req, res) => {
  Review
  .findAllByRole(req.body.user)
  .then(reviews => {
    res.status(200).send(reviews);
  })
  .catch(err => {
    res.status(500).send({
      message: "Review findAllByRole produced an error",
      error: err.message,
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
