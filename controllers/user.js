"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const passwordHelper = require("../config/passwordHelper");

const User = require("../models/User");

const ValidationError = require("../config/errors").ValidationError;

module.exports.findAll = (req, res) => {
  User
  .findAll()
  .then(users => {
    res.status(200).send(users);
  })
  .catch(err => {
    res.status(500).send({
      location: "User findAll .catch other",
      message: "Getting all Users caused an internal server error.",
      error: err,
    });
  });
};

module.exports.updateOne = (req, res) => {
  const user = req.body;

  Promise.resolve()
  .then(() => {
    if (req.user.id.toString() !== req.params.id && req.user.role !== "admin") {
      throw new ValidationError("Missing privileges to edit User.");
    } else if (!user.password && req.user.role !== "admin") {
      throw new ValidationError("No password supplied.");
    } else if (user.newPassword && !user.newPasswordConf || !user.newPassword && user.newPasswordConf) {
      throw new ValidationError("No new password or confirmation.");
    } else if (user.newPassword && user.newPasswordConf && user.newPassword !== user.newPasswordConf) {
      throw new ValidationError("New password didn't match confirmation.");
    } else {
      return User.findOne({ id: req.params.id });
    }
  })
  .then(foundUser => {
    if (!foundUser) {
      throw new ValidationError("No User found.");
    } else if (user.password && !passwordHelper.comparePassword(user.password, foundUser.passwordHash)) {
      throw new ValidationError("Wrong password.");
    }
    let strippedUser = {};
    if (req.user.id.toString() === req.params.id) {
      strippedUser = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
      if (user.newPassword && user.newPasswordConf) {
        strippedUser.passwordHash = passwordHelper.hashPassword(user.newPassword);
      }
    } else {
      strippedUser = user;
      if ((strippedUser.role === "professor" || strippedUser.role === "instructor") && !strippedUser.StudyFieldId) {
        throw new ValidationError("Professor or instructor must have a studyfield.");
      } else if (strippedUser.role === "professor") {
        return User.findStudyfieldsProfessor(strippedUser.StudyFieldId)
          .then(prof => {
            if (prof && prof.id !== strippedUser.id) {
              throw new ValidationError("Studyfield already has professor.");
            } else {
              return User.update(strippedUser, { id: req.params.id });
            }
          });
      }
    }
    return User.update(strippedUser, { id: req.params.id });
  })
  .then(rows => {
    res.status(200).send();
  })
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        location: "User updateOne .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "User updateOne .catch other",
        message: "Updating User caused an internal server error.",
        error: err,
      });
    }
  });
};

module.exports.saveOne = (req, res) => {
  const user = req.body;

  Promise.resolve()
  .then(() => {
    if (!user.firstname || !user.lastname || !user.email || !user.password) {
      throw new ValidationError("Missing fields.");
    } else if (user.password < 8) {
      throw new ValidationError("Password too short.");
    } else {
      return User.findOne({ email: user.email });
    }
  })
  .then(foundUser => {
    if (foundUser) {
      throw new ValidationError("User already exists with the same email.");
    } else {
      user.passwordHash = passwordHelper.hashPassword(user.password);
      return User.saveOne(user);
    }
  })
  .then(savedUser => {
    res.status(200).send();
  })
  .catch(err => {
    if (err.name === "ValidationError") {
      res.status(400).send({
        location: "User saveOne .catch ValidationError",
        message: err.message,
        error: err,
      });
    } else {
      res.status(500).send({
        location: "User saveOne .catch other",
        message: "Registering new User caused an internal server error.",
        error: err,
      });
    }
  });
};

module.exports.deleteOne = (req, res) => {
  User
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send();
    } else {
      res.status(404).send({
        location: "User deleteOne deletedRows === 0",
        message: "No User found",
        error: {},
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      location: "User deleteOne .catch other",
      message: "Deleting User caused an internal server error.",
      error: err,
    });
  });
};

module.exports.loginUser = (req, res) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      res.status(401).send({
        location: "User loginUser !user",
        message: "Logging in failed authentication",
        error: "",
      });
    } else if (!user.isActive) {
      res.status(401).send({
        location: "User loginUser !isActive",
        message: "Your account is inactive, please contact admin for activation",
        error: "",
      });
    } else if (user.isRetired) {
      res.status(401).send({
        location: "User loginUser isRetired",
        message: "Your account has been retired, please contact admin to reactivate",
        error: "",
      });
    } else {
      if (!passwordHelper.comparePassword(req.body.password, user.passwordHash)) {
        res.status(403).send({
          location: "User loginUser !comparePassword",
          message: "Wrong password",
          error: "",
        });
      } else {
        const token = TokenGenerator.generateToken(user);
        user.passwordHash = undefined;
        res.status(200).send({
          user,
          token,
        });
      }
    }
  })
  .catch(err => {
    res.status(500).send({
      location: "User loginUser .catch other",
      message: "Logging in caused an internal server error.",
      error: err,
    });
  });
};
