"use strict";

const SocketIOServer = require("../services/SocketIOServer");

const Notification = require("../models/Notification");

module.exports.findAll = (req, res, next) => {
  Notification
  .findAll({ RecipientId: req.user.id })
  .then(notifications => {
    res.status(200).send(notifications);
  })
  .catch(err => next(err));
};

module.exports.setRead = (req, res, next) => {
  const ids = req.body;

  Notification
  .setRead(ids)
  // .then(rows => SocketIOServer.broadcast(
  //   ["admin"],
  //   [{
  //     type: "NOTIFICATION_SET_READ_SUCCESS",
  //     payload: ids,
  //   }], req.user))
  .then(() => {
    res.status(200).send(req.body);
  })
  .catch(err => next(err));
};
