"use strict";

const EmailReminder = require("../services/EmailReminder");
const TokenGenerator = require("../services/TokenGenerator");
const PasswordHelper = require("../services/PasswordHelper");

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
      throw new errors.BadRequestError("New password is less than 8 characters.");
    } else {
      return User.findOne({ id: req.params.id });
    }
  })
  .then(foundUser => {
    if (!foundUser) {
      throw new errors.NotFoundError("No User found.");
    } else if (req.user.id.toString() === req.params.id && user.password && !PasswordHelper.comparePassword(user.password, foundUser.passwordHash)) {
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
        strippedUser.passwordHash = PasswordHelper.hashPassword(user.newPassword);
      }
    } else {
      strippedUser = user;
      if (user.password) {
        strippedUser.passwordHash = PasswordHelper.hashPassword(user.password);
      }
      if (strippedUser.role === "professor") {
        return User.findStudyfieldsProfessor(strippedUser.StudyFieldId)
          .then(prof => {
            if (prof && prof.id !== strippedUser.id) {
              throw new errors.BadRequestError("Studyfield already has a professor in charge.");
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
      req.body.passwordHash = PasswordHelper.hashPassword(req.body.password);
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
      throw new errors.ForbiddenError("Your account has been retired, please contact admin for reactivation.");
    } else if (!PasswordHelper.comparePassword(req.body.password, user.passwordHash)) {
      throw new errors.AuthenticationError("Incorrect password.");
    } else {
      const token = TokenGenerator.generateLoginToken(user);
      user.passwordHash = undefined;
      res.status(200).send({
        user,
        token,
      });
    }
  })
  .catch(err => next(err));
};

module.exports.requestPasswordResetion = (req, res, next) => {
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
      return EmailReminder.sendResetPasswordMail(user);
    }
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
}

module.exports.sendNewPassword = (req, res, next) => {
  let decodedToken;
  let foundUser;
  let generatedPassword;

  Promise.resolve(TokenGenerator.decodeToken(req.body.token))
  .then((decoded) => {
    if (!decoded || decoded.name !== "password") {
      throw new errors.BadRequestError("Invalid token.");
    } else if (TokenGenerator.isTokenExpired(decoded)) {
      throw new errors.BadRequestError("Token has expired.");
    } else {
      decodedToken = decoded;
      return User.findOne({ id: decodedToken.user.id });
    }
  })
  .then(user => {
    if (!user) {
      throw new errors.NotFoundError("No user found with given email.");
    } else if (!user.isActive) {
      throw new errors.ForbiddenError("Your account is inactive, please contact admin for activation.");
    } else if (user.isRetired) {
      throw new errors.ForbiddenError("Your account has been retired, please contact admin to reactivate.");
    } else {
      foundUser = user;
      generatedPassword = PasswordHelper.generatePassword();
      const passwordHash = PasswordHelper.hashPassword(generatedPassword);
      return User.update({ passwordHash, }, { id: decodedToken.user.id });
    }
  })
  .then(rows => EmailReminder.sendNewPasswordMail(foundUser, generatedPassword))
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => next(err));
};
