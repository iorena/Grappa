"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const StudyField = require("../models/StudyField");
const User = require("../models/User");
const Thesis = require("../models/Thesis");

module.exports.findAll = (req, res, next) => {
  StudyField
    .findAll()
    .then(studyfields => {
      res.status(200).send(studyfields);
    })
    .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  let savedStudyfield;

  StudyField
    .saveOne(req.body)
    .then(studyfield => {
      savedStudyfield = studyfield;
      return SocketIOServer.broadcast(["all"], [{
        type: "STUDYFIELD_SAVE_ONE_SUCCESS",
        payload: studyfield,
        notification: `User ${req.user.fullname} saved a StudyField`,
      }], req.user)
    })
    .then(() => {
      res.status(200).send(savedStudyfield);
    })
    .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  StudyField
    .update(req.body, { id: req.params.id })
    .then(rows => StudyField.findOne({ id: req.params.id }))
    .then(field => SocketIOServer.broadcast(["all"], [{
      type: "STUDYFIELD_UPDATE_ONE_SUCCESS",
      payload: field,
      notification: `Admin ${req.user.fullname} updated a StudyField`,
    }], req.user))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
};

module.exports.deleteOne = (req, res, next) => {
  Thesis.findOne({ StudyFieldId: req.params.id })
    .then(thesis => {
      if (thesis !== null) {
        return Promise.reject({ statusCode: 403, message: "Thesis with studyfield found" });
      }
      return User.findOne({ StudyFieldId: req.params.id })
    })
    .then(user => {
      if (user !== null) {
        return Promise.reject({ statusCode: 403, message: "Studyfield has a professor" });
      }
      return StudyField.findOne({ id: req.params.id });
    })
    .then(studyfield => {
      if (studyfield !== null) {
        return StudyField.delete(studyfield.dataValues);
      }
      return Promise.reject({ statusCode: 403, message: "No studyfield with id found" });
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
}
