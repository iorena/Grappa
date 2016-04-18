"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const User = require("../models/user");

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

module.exports.loginUser = (req, res) => {
  User
  .findOne({ email: req.body.email, password: req.body.password})
  .then(user => {
    if (user === null) {
      res.status(400).send({
        message: "Logging in failed authentication",
        error: "Dawg",
      });
    } else {
      // generate token
      const token = TokenGenerator.generateToken(user);
      console.log(token);
      TokenGenerator.decodeToken(token);
      res.status(200).send({
        token: token,
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "User loginOne produced an error",
      error: err.message,
    });
  });
}
