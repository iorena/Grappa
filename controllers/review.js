"use strict";

const Review = require("../models/review");

module.exports.findAll = (req, res) => {
  Review
  .findAllByRole(req.user)
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

module.exports.updateOne = (req, res) => {
  Review
  .update(req.body, req.params)
  .then(review => {
    res.status(200).send(review);
  })
  .catch(err => {
    res.status(500).send({
      message: "Review updateOne produced an error",
      error: err,
    });
  });
};

module.exports.deleteOne = (req, res) => {
  Review
  .delete({id: req.params.id})
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({message: "Review with id: " + req.params.id+ " successfully deleted"});
    }
    else {
      res.status(404).send({message: "Review to delete with id: " + req.params.id +  " was not found"})
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Review deleteOne produced an error",
      error: err,
    });
  });
};
