"use strict";

const TokenGenerator = require("../services/TokenGenerator");
const User = require("../models/user");

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
    console.log(user);
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(500).send({
      message: "User updateOne produced an error",
      error: err,
    });
  });
};

module.exports.findOne = (req, res) => {
  User
  .findOne({id: req.params.id})
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(500).send({
      message: "User findOne produced an error",
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

module.exports.deleteOne = (req, res) => {
  User
  .delete({id: req.params.id})
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({message: "User with id: " + req.params.id+ " successfully deleted"});
    }
    else {
      res.status(404).send({message: "User to delete with id: " + req.params.id +  " was not found"})
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
  .findOne({ email: req.body.email, password: req.body.password})
  .then(user => {
    if (user === null) {
      res.status(401).send({
        message: "Logging in failed authentication",
        error: "",
      });
    } else {
      const token = TokenGenerator.generateToken(user);
      res.status(200).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          StudyFieldId: user.StudyFieldId,
        },
        token: token,
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "User loginUser produced an error",
      error: err,
    });
  });
}
