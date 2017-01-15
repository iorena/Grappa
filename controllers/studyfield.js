"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const StudyField = require("../models/StudyField");

module.exports.findAll = (req, res, next) => {
  StudyField
  .findAll()
  .then(studyfields => {
    res.status(200).send(studyfields);
  })
  .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  StudyField
  .saveOne(req.body)
  .then(studyfield => {
    SocketIOServer.broadcast(
      ["all"],
      [{
        type: "STUDYFIELD_SAVE_ONE_SUCCESS",
        payload: studyfield,
      }]
    )
    res.status(200).send(studyfield);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  StudyField
  .update(req.body, { id: req.params.id })
  .then(rows => StudyField.findOne({ id: req.params.id }))
  .then(field => {
    SocketIOServer.broadcast(
      ["all"],
      [{
        type: "STUDYFIELD_UPDATE_ONE_SUCCESS",
        payload: field,
      }]
    )
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
