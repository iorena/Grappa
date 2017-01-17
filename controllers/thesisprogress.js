"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const ThesisProgress = require("../models/ThesisProgress");

module.exports.updateOne = (req, res, next) => {
  ThesisProgress
  .update(req.body, { id: req.params.id })
  .then(rows => ThesisProgress.findOne({ id: req.params.id }))
  .then(tp => SocketIOServer.broadcast(["admin", "print-person"], [{
    type: "THESISPROGRESS_UPDATE_ONE_SUCCESS",
    payload: tp,
    notification: `Admin ${req.user.fullname} set Thesises reminder done`,
  }], req.user))
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
