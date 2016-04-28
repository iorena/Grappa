"use strict";

const CouncilMeeting = require("../models/councilmeeting");

module.exports.findAll = (req, res) => {
  CouncilMeeting
  .findAll()
  .then(cmeetings => {
    res.status(200).send(cmeetings);
  })
  .catch(err => {
    res.status(500).send({
      message: "CouncilMeeting findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  CouncilMeeting
  .saveOne(req.body)
  .then(cmeeting => {
    res.status(200).send(cmeeting);
  })
  .catch(err => {
    res.status(500).send({
      message: "CouncilMeeting saveOne produced an error",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  CouncilMeeting
  .update(req.body, req.params)
  .then(councilMeeting => {
    res.status(200).send(councilMeeting);
  })
  .catch(err => {
    res.status(500).send({
      message: "CouncilMeeting updateOne produced an error",
      error: err,
    });
  });
};

module.exports.deleteOne = (req, res) => {
  CouncilMeeting
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({ message: "CouncilMeeting with id: " + req.params.id + " successfully deleted" });
    }
    else {
      res.status(404).send({ message: "CouncilMeeting to delete with id: " + req.params.id + " was not found" });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "CouncilMeeting deleteOne produced an error",
      error: err,
    });
  });
};
