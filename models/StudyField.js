"use strict";

const BaseModel = require("./BaseModel");

class StudyField extends BaseModel {
  constructor() {
    super("StudyField");
  }
  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "name", "isActive"],
    });
  }
}

module.exports = new StudyField();
