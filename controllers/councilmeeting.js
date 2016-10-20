"use strict";

const CouncilMeeting = require("../models/CouncilMeeting");
const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.findAll = (req, res, next) => {
  CouncilMeeting
  .findAll()
  .then(cmeetings => {
    res.status(200).send(cmeetings);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
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

module.exports.updateOne = (req, res, next) => {
  CouncilMeeting
  .update(req.body, { id: req.params.id })
  .then(cmeeting => {
    res.status(200).send(cmeeting);
  })
  .catch(err => next(err));
};

module.exports.deleteOne = (req, res, next) => {
  Thesis
  .findOne({ CouncilMeetingId: req.params.id, })
  .then(thesis => {
    if (thesis) {
      throw new errors.BadRequestError("Meeting has theses linked to it. Move/remove them before deleting this meeting.");
    } else {
      return CouncilMeeting.delete({ id: req.params.id });
    }
  })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.sendStatus(200);
    } else {
      throw new errors.NotFoundError("No councilmeeting found.");
    }
  })
  .catch(err => next(err));
};
