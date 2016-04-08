"use strict";

const BaseModel = require("./base_model");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }
}

module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
