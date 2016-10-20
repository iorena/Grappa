"use strict";

const BaseModel = require("./BaseModel");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }

// deprecated
  linkEthesisEmail(ThesisId, emailId) {
    return this.getModel().update({
      EthesisEmailId: emailId,
    }, {
      where: { ThesisId },
    });
  }

  setEthesisDone(ThesisId) {
    return this.getModel().update({
      ethesisDone: true,
    }, {
      where: { ThesisId },
    });
  }

  setGraderEvalDone(ThesisId) {
    return this.getModel().update({
      graderEvalDone: true,
    }, {
      where: { ThesisId },
    });
  }

  setPrintDone(ThesisId) {
    return this.getModel().update({
      printDone: true,
    }, {
      where: { ThesisId },
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

module.exports = new ThesisProgress();
