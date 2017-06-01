
const SocketIOServer = require("../services/SocketIOServer");

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
  let foundMeeting;

  CouncilMeeting
  .checkIfExists(req.body)
  .then(exists => {
    if (exists) {
      throw new errors.BadRequestError("Meeting already exists with the same date.");
    } else {
      const date = req.body.date;
      date.setHours(23, 59, 59, 0);
      const instructorDeadline = new Date(date);
      const studentDeadline = new Date(date);
      instructorDeadline.setDate(date.getDate() - req.body.instructorDeadlineDays);
      studentDeadline.setDate(date.getDate() - req.body.studentDeadlineDays);
      return CouncilMeeting.saveOne({
        date,
        instructorDeadline,
        studentDeadline,
      });
    }
  })
  .then(meeting => {
    foundMeeting = meeting;
    return SocketIOServer.broadcast(["all"], [{
      type: "COUNCILMEETING_SAVE_ONE_SUCCESS",
      payload: meeting,
      notification: `User ${req.user.fullname} created a CouncilMeeting`,
    }], req.user)
  })
  .then(() => {
    res.status(200).send(foundMeeting);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  CouncilMeeting
  .update(req.body, { id: req.params.id })
  .then(rows => CouncilMeeting.findOne({ id: req.params.id }))
  .then(meeting => SocketIOServer.broadcast(["all"], [{
    type: "COUNCILMEETING_UPDATE_ONE_SUCCESS",
    payload: meeting,
    notification: `User ${req.user.fullname} updated a CouncilMeeting`,
  }], req.user))
  .then(() => {
    res.sendStatus(200);
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
  .then(deletedRows => SocketIOServer.broadcast(["all"], [{
    type: "COUNCILMEETING_DELETE_ONE_SUCCESS",
    payload: { id: parseInt(req.params.id) },
    notification: `User ${req.user.fullname} deleted a CouncilMeeting`,
  }], req.user))
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
