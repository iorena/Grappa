const SocketIOServer = require("../services/SocketIOServer");

const Grader = require("../models/Grader");

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
  let savedGrader;

  Grader
  .saveOne(req.body)
  .then(grader => {
    savedGrader = grader;
    return SocketIOServer.broadcast(["all"], [{
      type: "GRADER_SAVE_ONE_SUCCESS",
      payload: grader,
      notification: `User ${req.user.fullname} saved a Grader`,
    }], req.user)
  })
  .then(() => {
    res.status(200).send(savedGrader);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  Grader
  .update(req.body, { id: req.params.id })
  .then(rows => Grader.findOne({ id: req.params.id }))
  .then(grader => SocketIOServer.broadcast(["all"], [{
    type: "GRADER_UPDATE_ONE_SUCCESS",
    payload: grader,
    notification: `User ${req.user.fullname} updated a Grader`,
  }], req.user))
  .then(() => {
    res.sendStatus(200);
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
  .then(deletedRows => SocketIOServer.broadcast(["all"], [{
    type: "GRADER_DELETE_ONE_SUCCESS",
    payload: { id: parseInt(req.params.id) },
    notification: `User ${req.user.fullname} deleted a Grader`,
  }], req.user))
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
