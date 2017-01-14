"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const EmailDraft = require("../models/EmailDraft");

module.exports.findAll = (req, res, next) => {
  EmailDraft
  .findAll()
  .then(drafts => {
    res.status(200).send(drafts);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  EmailDraft
  .update(req.body, { id: req.params.id })
  .then(rows => {
    EmailDraft
    .findOne({ id: req.params.id })
    .then(draft => {
      SocketIOServer.broadcast(
        ["admin"],
        [{
          type: "EMAILDRAFT_UPDATE_ONE_SUCCESS",
          payload: draft,
        }]
      )
    })
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
