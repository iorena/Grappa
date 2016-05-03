"use strict";

const BaseModel = require("./base_model");
const Reminder = require("../services/EmailReminder");
const Thesis = require("./thesis");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }
  changeGraderStatus(thesisId) {
    this.getModel().update({ gradersStatus: true }, { where: { thesisId } });
  }
  saveFromNewThesis(thesis) {
    console.log("Thesisprogress saved!");
    return this.saveOne({ thesisId: thesis.id, ethesisReminder: Date.now(), professorReminder: null,
      documentsSent: null, isDone: false, gradersStatus: false });
  }

  evaluateGraders(thesisId, graders) {
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
    if (professor && doctor) {
      this.changeGraderStatus(thesisId);
    } else {
      Thesis
        .findOne({ id: thesisId })
        .then(fT => {
          if (fT === null) {
            throw new TypeError("Professor not found");
          } else {
            Reminder.sendProfessorReminder(fT);
          }
        });
    }
  }
}


module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
