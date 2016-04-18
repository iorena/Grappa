"use strict";

const BaseModel = require("./base_model");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }
  changeGraderStatus(thesisId) {
    this.getModel().update({ gradersStatus: true }, { where: { thesisId } });
  }
  evaluateGraders(thesis) {
    const thesisId = thesis.id;
    return this.Models.Thesis
      .findOne({ where: { id: thesis.id } })
      .then((thesis) => {
        return thesis.getGraders();
      })
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
      })
  }
}


module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
// module.exports.getModel = () => BaseModel.tables.ThesisProgress;
