"use strict";

const Grader = require("../models/Grader");
const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.findAll = (req, res, next) => {
  Grader
  .findAll()
  .then(graders => {
    res.status(200).send(graders);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  Grader
  .saveOne(req.body)
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  Grader
  .update(req.body, { id: req.params.id })
  .then(grader => {
    res.status(200).send(grader);
  })
  .catch(err => next(err));
};

module.exports.deleteOne = (req, res, next) => {
  Grader
  .findOneWithTheses({ id: req.params.id })
  .then(grader => {
    if (!grader) {
      throw new errors.NotFoundError("No grader found.");
    } else if (grader.Theses.length !== 0) {
      throw new errors.BadRequestError("Grader has been linked to theses. Those associations have to be removed before deleting this grader.");
    } else {
      return Grader.delete({ id: req.params.id });
    }
  })
  .then(deletedRows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
