"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  saveIfDoesntExist(thesis) {
    tables.Grader.findOrCreate({
      where: {name: thesis.grader, title: thesis.gradertitle},
      default: {name: thesis.grader, title: thesis.gradertitle},
    });
    tables.Grader.findOrCreate({
      where: {name: thesis.grader2, title: thesis.grader2title},
      default: {name: thesis.grader2, title: thesis.grader2title},
    });
  }
}


module.exports.class = Grader;
module.exports = new Grader();
