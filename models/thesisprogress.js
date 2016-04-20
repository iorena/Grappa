"use strict";

const BaseModel = require("./base_model");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }
  changeGraderStatus(thesisId) {
    this.getModel().update({ gradersStatus: true }, { where: { thesisId } });
  }
  saveFromNewThesis(thesis) {
    console.log("Thesisprogress saved!");
    return this.saveOne({ thesisId: thesis.id, ethesisReminder: null, professorReminder: null,
      documentsSent: null, isDone: false, gradersStatus: false });
  }

  evaluateGraders(thesis) {
    const thesisId = thesis.id;
    return this.Models.Thesis
      .findOne({ where: { id: thesis.id } })
      .then((foundThesis) => foundThesis.getGraders())
      .then((graders) => {
        let professor = false;
        let doctor = false;
        graders.map((grader) => {
          const title = grader.title;
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
        if (professor && doctor) {
          this.changeGraderStatus(thesisId);
        }
      });
  }
}


module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
