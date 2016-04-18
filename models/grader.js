"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  findOrCreate(gradername, gradertitle) {
    return this.getModel()
    .findOne({ where: { name: gradername, title: gradertitle } })
    .then((grader) => {
      if (grader === null) {
        return this.getModel().create({ name: gradername, title: gradertitle });
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

  linkThesisToGraders(thesis, graders) {
    if (typeof graders === "undefined") {
      return Promise.resolve();
    }
    return Promise.all(graders.map(grader => {
      return this.getModel()
        .findOne({ where: { name: grader.name, title: grader.title } })
        .then(grader => grader.addThesis(thesis))
      }))
      .then(() => {
        console.log("Thesis and Graders all linked!");
      })
  }
}

module.exports.class = Grader;
module.exports = new Grader();
