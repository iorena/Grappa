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
    .then(rows => EmailDraft.findOne({ id: req.params.id }))
    .then(draft => SocketIOServer.broadcast(["admin"], [{
      type: "EMAILDRAFT_UPDATE_ONE_SUCCESS",
      payload: draft,
      notification: `Admin ${req.user.fullname} updated an EmailDraft`,
    }], req.user))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
};

module.exports.saveOne = (req, res, next) => {
  EmailDraft
    .findOne({ id: req.params.id })
    .then(draft => {
      if (draft) {
        throw new errors.BadRequestError("Duplicate draft found.");
      } else {
        return EmailDraft.saveOne(req.body);
      }
    })
    .then(draft => {
      SocketIOServer.broadcast(["admin"], [{
        type: "EMAILDRAFT_SAVE_ONE_SUCCESS",
        payload: draft,
        notification: `Admin ${req.user.fullname} created an EmailDraft`,
      }], req.user)
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
}

module.exports.deleteOne = (req, res, next) => {
  EmailDraft
    .findOne({ id: req.params.id })
    .then(draft => {
      if (draft) {
        return EmailDraft.delete({ id: req.params.id });
      } else {
        throw new errors.BadRequestError("No draft with id " + req.params.id + " found to delete.");
      }
    })
    .then(deletedRows => SocketIOServer.broadcast(["admin"], [{
      type: "EMAILDRAFT_DELETE_ONE_SUCCESS",
      payload: { id: req.params.id },
      notification: `User ${req.user.fullname} deleted a Draft`,
    }], req.user))
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => next(err));
}