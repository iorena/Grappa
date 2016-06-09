"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const passwordHelper = require("../config/passwordHelper");

const User = require("../models/User");

module.exports.findAllNotActive = (req, res) => {
  User
  .findAllNotActive()
  .then(users => {
    res.status(200).send(users);
  })
  .catch(err => {
    res.status(500).send({
      message: "User findAllNotActive produced an error",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  User
  .update(req.body, { id: req.params.id })
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(500).send({
      message: "User updateOne produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  if (req.body.password !== undefined) {
    req.body.passwordHash = passwordHelper.hashPassword(req.body.password);
  }
  User
  .saveOne(req.body)
  .then(user => {
    res.status(200).send({ message: "User was successfully saved" });
  })
  .catch(err => {
    res.status(500).send({
      message: "User saveOne produced an error",
      error: err,
    });
  });
};

module.exports.deleteOne = (req, res) => {
  User
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({ message: "User with id: " + req.params.id + " successfully deleted" });
    } else {
      res.status(404).send({ message: "User to delete with id: " + req.params.id + " was not found" });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "User deleteOne produced an error",
      error: err,
    });
  });
};

module.exports.loginUser = (req, res) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (user === null) {
      res.status(401).send({
        message: "Logging in failed authentication",
        error: "",
      });
    } else if (!user.isActive) {
      res.status(401).send({
        message: "Your account is inactive, please contact admin for activation",
        error: "",
      });
    } else {
      if (!passwordHelper.comparePassword(req.body.password, user.passwordHash)) {
        res.status(403).send({ message: "Wrong username and password combination!" });
      } else {
        const token = TokenGenerator.generateToken(user);
        user.passwordHash = undefined;
        res.status(200).send({
          user: user,
          token: token,
        });
      }
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "User loginUser produced an error",
      error: err,
    });
  });
};
