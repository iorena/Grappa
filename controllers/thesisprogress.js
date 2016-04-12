"use strict";

const ThesisProgress = require("../models/thesisprogress");
const Thesis = require("../models/thesis");
const Grader = require("../models/grader");
module.exports.findAll = (req, res) => {
  ThesisProgress
  .findAll()
  .then(thesisprogresses => {
    res.status(200).send(thesisprogresses);
  })
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  ThesisProgress
  .saveOne(req.body)
  .then(thesisprogress => {
    res.status(200).send(thesisprogress);
  })
  .catch(err => {
    res.status(500).send({
      message: "ThesisProgress saveOne produced an error",
      error: err,
    });
  });
};

module.exports.saveThesisProgressFromNewThesis = (thesis) => {
  ThesisProgress.saveOne({ thesisId: thesis.id, ethesisReminder: null, professorReminder: null,
    documentsSent: null, isDone: false, gradersStatus: false });
  console.log("Thesisprogress saved!");
}
module.exports.evalGraders = (thesis) => {
  let thesisId = thesis.id;
  let progressId = 0;
  Grader
  .findAll({
    where: { thesisID: thesisId }
  })
  .then((graders) => {
    let professor = false;
    let doctor = false;
    graders.map((grader) => {
      if(grader !== null || grader !== "undefined") {
        const title = grader.title;
        if (title === "Prof") {
          if (professor) {
            doctor = true;
          } else {
            professor = true;
          }
        } else if ( title === "AssProf" || title === "Doc" || title === "AdjProf") {
          doctor = true;
        }
      }
    });
    console.log(professor);
    console.log(doctor);
    if (professor || doctor) {
      ThesisProgress.changeGraderStatus(thesisId);
    }
    console.log("EvalGraders Done!");
  });
};
