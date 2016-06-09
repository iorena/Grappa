"use strict";

const BaseModel = require("./BaseModel");

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

  linkThesisToGraders(graders, thesis) {
    if (graders === undefined) {
      return Promise.resolve();
    }
    return Promise.all(graders.map(grader => {
        return this.getModel()
          .findOne({ where: { id: grader.id } })
          .then(grader => grader.addThesis(thesis));
      }))
      .then(() => {
        console.log("Thesis and Graders all linked!");
      });
  }
}

module.exports.class = Grader;
module.exports = new Grader();
