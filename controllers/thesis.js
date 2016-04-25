"use strict";

const Reminder = require("../services/EmailReminder");
const tokenGen = require("../services/TokenGenerator");

const Thesis = require("../models/thesis");
const EthesisToken = require("../models/ethesisToken");
const ThesisProgress = require("../models/thesisprogress");
const CouncilMeeting = require("../models/councilmeeting");
const Grader = require("../models/grader");

module.exports.findAll = (req, res) => {
  Thesis
  .findAllByUserRole(req.body.user)
  .then(theses => {
    res.status(200).send(theses);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis findAll produced an error",
      error: err,
    });
  });
};

module.exports.findOne = (req, res) => {
  Thesis
  .findOne({id: req.params.id})
  .then(thesis => {
    res.status(200).send(thesis);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis findOne produced an error",
      error: err,
    });
  });
};

/*
 * Recieves hashed id and updates thesis
 *
 * request is in form { token: "ABC123", thesis: { ethesis: "link.com" } }
 */
module.exports.updateOne = (req, res) => {
  Thesis
  .update(req.body.thesis, { id: tokenGen.decodeEthesisToken(req.body.token).thesisId })
  .then(thesis => {
    res.status(200).send(thesis);
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis update produced an error",
      error: err,
    });
  });
};

module.exports.deleteOne = (req, res) => {
  Thesis
  .delete({id: req.params.id})
  .then(deletedRows => {
    if (deletedRows !== 0) {
      res.status(200).send({message: "Thesis with id: " + req.params.id+ " successfully deleted"});
    }
    else {
      res.status(404).send({message: "Thesis to delete with id: " + req.params.id +  " was not found"})
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Thesis deleteOne produced an error",
      error: err,
    });
  });
};

/*
 * Saves a single thesis, links it to a bunch of stuff and sends an email
 *
 * Required fields for a thesis:
 * author, email, deadline, graders?, and stuff?
 */
module.exports.saveOne = (req, res) => {
  let savedthesis;
  let foundCouncilMeeting;
  const originalDate = new Date(req.body.deadline);

  CouncilMeeting
  .findOne({ date: originalDate })
  .then(cm => {
    // console.log("cm : ");
    // console.log(cm);
    if (cm === null) {
      throw new TypeError("ValidationError: unvalid deadline, no such CouncilMeeting found");
    } else {
      foundCouncilMeeting = cm;
      if (typeof req.body.graders === "undefined") {
        return;
      }
      return Promise.all(req.body.graders.map(grader => Grader.findOrCreate(grader)));
    }
  })
  .then(() => Thesis.saveOne(req.body))
  .then(thesis => {
    savedthesis = thesis;
    const token = tokenGen.generateEthesisToken(thesis.author, thesis.id);
    return Promise.all([
      EthesisToken.saveOne({
        thesisId: thesis.id,
        author: thesis.author,
        token,
      }),
      Reminder.sendStudentReminder(thesis.email, token),
      ThesisProgress.saveFromNewThesis(thesis),
      CouncilMeeting.linkThesisToCouncilMeeting(thesis, originalDate),
      Grader.linkThesisToGraders(thesis, req.body.graders),
      Thesis.linkStudyField(thesis, req.body.field),
    ]);
  })
  .then(() => ThesisProgress.evaluateGraders(savedthesis.id, req.body.graders))
  .then(() => {
    res.status(200).send(savedthesis);
  })
  .catch(err => {
    if (err.message.indexOf("ValidationError") !== -1) {
      res.status(400).send({
        message: "Thesis saveOne failed validation",
        error: err.message,
      });
    } else {
      res.status(500).send({
        message: "Thesis saveOne produced an error",
        error: err.message,
      });
    }
  });
};
