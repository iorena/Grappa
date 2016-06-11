"use strict";

const BaseModel = require("./BaseModel");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }

  setEthesisDone(thesisId) {
    return this.getModel().update({
      ethesisDone: true,
    }, {
      where: { thesisId },
    });
  }

  setGraderEvalDone(thesisId) {
    return this.getModel().update({
      graderevalDone: true,
    }, {
      where: { thesisId },
    });
  }

  saveFromThesis(thesis) {
    return this.getModel().create({
    // return this.saveOne({
      thesisId: thesis.id,
      ethesisReminderId: null,
      graderevalReminderId: null,
      printReminderId: null,
    });
  }

  isGraderEvaluationNeeded(thesisId, graders) {
    let professor = false;
    let doctor = false;
    graders.map((grader) => {
      var title = grader.title;
      if (title === "Prof") {
        if (professor) {
          doctor = true;
        } else {
          professor = true;
        }
      } else if (title === "AssProf" || title === "Doc" || title === "AdjProf") {
        doctor = true;
      }
    });
    return !(professor && doctor);
  }
}

module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
