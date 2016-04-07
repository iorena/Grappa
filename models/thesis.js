"use strict";

const BaseModel = require("./base_model");
// const Models = require("./shared");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// author: Sequelize.STRING,
// email: Sequelize.STRING,
// title: Sequelize.STRING,
// urkund: Sequelize.STRING,
// ethesis: Sequelize.STRING,
// abstract: Sequelize.TEXT,
// grade: Sequelize.STRING,

class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }
  saveOne(thesis) {
    let thesisId;
    return tables["Thesis"].create(params).
    then((savedThesis) => {
      if (thesis.grader === "undefined" || thesis.grader===null) {
        return;
      }
      return tables["GraderTheses"].find({
        ThesisId: savedThesis.id,
      });
    })
    .then((gradertheses) => {
      let queries = [];
      gradertheses.map((graderthesis) =>{
        queries.push(
          tables["Grader"].find({
            id: grader
          })
        )
      })
      return Promise.all(queries);
    })
    .then((graders) => {
      let professor = false;
      let doctor = false;
      graders.map((grader) => {
        const title = grader.title;
        if (title === "professor") {
          if (professor) {
            doctor = true;
          } else {
            professor = true;
          }
        } else if (title.contains("professor") || title === "doctor") {
          doctor = true;
        }
      })
      if (!professor || !doctor) {
        return tables["ThesisProgress"].find({
          ThesisId: ThesisId,
        })
      }
    })
    .then((thesisProgress) => {
      return tables["ThesisProgress"].update({
        id: thesisProgress.id,
        graderStatus: true,
      })
    })
  }
  // validateAuthor() {
  //
  // }
}

module.exports.class = Thesis;
module.exports = new Thesis();
