"use strict";

const BaseModel = require("./BaseModel");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }

// deprecated
  linkEthesisEmail(ThesisId, emailId) {
    return this.Models.ThesisProgress.update({
      EthesisEmailId: emailId,
    }, {
      where: { ThesisId },
    });
  }

  setEthesisDone(ThesisId) {
    return this.Models.ThesisProgress.update({
      ethesisDone: true,
    }, {
      where: { ThesisId },
    });
  }

  setGraderEvalDone(ThesisId) {
    return this.Models.ThesisProgress.update({
      graderEvalDone: true,
    }, {
      where: { ThesisId },
    });
  }

  setPrintDone(ThesisId) {
    return this.Models.ThesisProgress.update({
      printDone: true,
    }, {
      where: { ThesisId },
    });
  }

  setStudentNotificationDone(ThesisId) {
    return this.Models.ThesisProgress.update({
      studentNotificationSent: true,
    }, {
      where: { ThesisId },
    });
  }

  isGraderEvaluationNeeded(thesisId, graders) {
    let professor = false;
    let doctor = false;
    graders.map((grader) => {
      var title = grader.title;
      if (title === "Prof.") {
        if (professor) {
          doctor = true;
        } else {
          professor = true;
        }
        //TODO: Move Ass. Prof later to row 56
      } else if (title === "Ass. Prof." || title === "Dr." || title === "Adj. Prof.") {
        doctor = true;
      }
    });
    return !(professor && doctor);
  }
}

module.exports = new ThesisProgress();
