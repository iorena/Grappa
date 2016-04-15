"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  findOrCreate(gradername, gradertitle) {
    tables.Grader
    .findOne({ where: { name: gradername, title: gradertitle } })
    .then((grader) => {
      if (grader === null) {
        return tables.Grader.create({ name: gradername, title: gradertitle });
      }
      return grader;
    });
  }

  saveIfDoesntExist(thesis) {
    const queries = [];
    queries.push(this.findOrCreate(thesis.grader, thesis.gradertitle));
    queries.push(this.findOrCreate(thesis.grader2, thesis.grader2title));
    return Promise.all(queries);
  }

  linkGraderAndThesis(graderName, title, thesis) {
    return this
    .getModel()
    .findOne({ where: { name: graderName, title } })
    .then((grader) => {
      grader
      .addThesis(thesis)
      .then(() => {
        console.log("Thesis and Grader added to GraderTheses");
      });
    });
  }
}

module.exports.class = Grader;
module.exports = new Grader();
module.exports.getModel = () => BaseModel.tables.Grader;
