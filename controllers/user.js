"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const passwordHelper = require("../config/passwordHelper");

const User = require("../models/User");

const errors = require("../config/errors");

module.exports.findAll = (req, res, next) => {
  User
  .findAll()
  .then(users => {
    res.status(200).send(users);
  })
  .catch(err => next(err));
};

module.exports.updateOne = (req, res, next) => {
  const user = req.body;

  Promise.resolve()
  .then(() => {
    if (req.user.id.toString() !== req.params.id && req.user.role !== "admin") {
      throw new errors.ForbiddenError("Missing privileges to edit User.");
    } else if (req.user.id.toString() === req.params.id && !user.password) {
      throw new errors.BadRequestError("No password supplied.");
    } else if (req.user.id.toString() === req.params.id && user.newPassword && user.newPassword.length < 8) {
      throw new errors.BadRequestError("New password is under 8 characters.");
    } else {
      return User.findOne({ id: req.params.id });
    }
  })
  .then(foundUser => {
    if (!foundUser) {
      throw new errors.NotFoundError("No User found.");
    } else if (user.password && !passwordHelper.comparePassword(user.password, foundUser.passwordHash)) {
      throw new errors.AuthenticationError("Wrong password.");
    }
    let strippedUser = {};
    if (req.user.id.toString() === req.params.id) {
      strippedUser = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
      if (user.newPassword) {
        strippedUser.passwordHash = passwordHelper.hashPassword(user.newPassword);
      }
    } else {
      strippedUser = user;
      if ((strippedUser.role === "professor" || strippedUser.role === "instructor") && !strippedUser.StudyFieldId) {
        throw new errors.BadRequestError("Professor or instructor must have a studyfield.");
      } else if (strippedUser.role === "professor") {
        return User.findStudyfieldsProfessor(strippedUser.StudyFieldId)
          .then(prof => {
            if (prof && prof.id !== strippedUser.id) {
              throw new errors.BadRequestError("Studyfield already has professor.");
            } else {
              return User.update(strippedUser, { id: req.params.id });
            }
          });
      }
    }
    return User.update(strippedUser, { id: req.params.id });
  })
  .then(rows => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};


module.exports.saveOne = (req, res, next) => {
  User
  .findOne({ email: req.body.email })
  .then(foundUser => {
    if (foundUser) {
      throw new errors.BadRequestError("User already exists with the same email.");
    } else {
      req.body.passwordHash = passwordHelper.hashPassword(req.body.password);
      return User.saveOne(req.body);
    }
  })
  .then(savedUser => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};

module.exports.deleteOne = (req, res, next) => {
  User
  .delete({ id: req.params.id })
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.sendStatus(200);
    } else {
      throw new errors.NotFoundError("No user found.");
    }
  })
  .catch(err => next(err));
};

module.exports.loginUser = (req, res, next) => {
  User
  .findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      throw new errors.NotFoundError("No user found with given email.");
    } else if (!user.isActive) {
      throw new errors.ForbiddenError("Your account is inactive, please contact admin for activation.");
    } else if (user.isRetired) {
      throw new errors.ForbiddenError("Your account has been retired, please contact admin to reactivate.");
    } else {
      if (!passwordHelper.comparePassword(req.body.password, user.passwordHash)) {
        throw new errors.AuthenticationError("Incorrect password.");
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
  .catch(err => next(err));
};
