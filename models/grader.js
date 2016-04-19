"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  findOrCreate(grader) {
    return this.getModel()
    .findOne({ where: { name: grader.name, title: grader.title } })
    .then((newgrader) => {
      if (newgrader === null) {
        return this.getModel().create({ name: grader.name, title: grader.title });
      }
      return newgrader;
    });
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
