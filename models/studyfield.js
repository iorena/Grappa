"use strict";

const BaseModel = require("./base_model");

class StudyField extends BaseModel {
  constructor() {
    super("StudyField");
  }
}

module.exports.class = StudyField;
module.exports = new StudyField();
