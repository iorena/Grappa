"use strict";

const BaseModel = require("./base_model");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }
  changeGraderStatus(thesisId) {
    return this.getModel().update({
      gradersStatus: true,
    }, {
      where: { thesisId },
    });
  }
  saveFromThesis(thesis) {
    return this.saveOne({
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
