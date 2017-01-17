"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const Notification = require("../models/Notification");

module.exports.findAll = (req, res, next) => {
  Notification
  .findAll()
  .then(drafts => {
    res.status(200).send(drafts);
  })
  .catch(err => next(err));
};

module.exports.setRead = (req, res, next) => {
  Notification
  .update(req.body, { id: req.params.id })
  .then(rows => Notification.findOne({ id: req.params.id }))
  .then(draft => {
    SocketIOServer.broadcast(
      ["admin"],
      [{
        type: "Notification_UPDATE_ONE_SUCCESS",
        payload: draft,
      }]
    )
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
