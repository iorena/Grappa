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
