"use strict";

const User = require("../models/councilmeeting");

module.exports.findAll = (req, res) => {
  User
  .findAll()
  .then(users => {
    res.status(200).send(users);
  })
  .catch(err => {
    res.status(500).send({
      message: "User findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  User
  .saveOne(req.body)
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(500).send({
      message: "User saveOne produced an error",
      error: err,
    });
  });
};
