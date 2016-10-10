"use strict";

const CouncilMeeting = require("../models/CouncilMeeting");

const errors = require("../config/errors");

module.exports.findAll = (req, res) => {
  CouncilMeeting
  .findAll()
  .then(cmeetings => {
    res.status(200).send(cmeetings);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res) => {
  CouncilMeeting
  .checkIfExists(req.body)
  .then(exists => {
    if (exists) {
      throw new errors.BadRequestError("Meeting already exists with the same date.");
    } else {
      return CouncilMeeting.saveOne(req.body);
    }
  })
  .then(cmeeting => {
    res.status(200).send(cmeeting);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res) => {
  CouncilMeeting
  .update(req.body, { id: req.params.id })
  .then(cmeeting => {
    res.status(200).send(cmeeting);
  })
  .catch(err => next(err));
};
