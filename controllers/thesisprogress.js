"use strict";

const ThesisProgress = require("../models/ThesisProgress");

module.exports.updateOne = (req, res) => {
  ThesisProgress
  .update(req.body, { id: req.params.id })
  .then(rows => {
    res.status(200).send(rows);
  })
  .catch(err => {
    res.status(500).send({
      location: "ThesisProgress updateOne .catch other",
      message: "Updating ThesisProgress caused an internal server error.",
      error: err,
    });
  });
};
