"use strict";

const Models = require("../db/tables").Models;

const Thesis = require("../models/Thesis");
const EthesisToken = require("../models/EthesisToken");
const ThesisReview = require("../models/ThesisReview");
const ThesisProgress = require("../models/ThesisProgress");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");
const User = require("../models/User");

class Validator {
  constructor() {
    this.Models = Models;
  }
  validate(modelname, values) {
    if (modelname === "thesis") {
      return Promise.all([
        StudyField.findOne({}),
      ]);
    }
  }
}

module.exports = new Validator();
