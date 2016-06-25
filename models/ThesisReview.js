"use strict";

const BaseModel = require("./BaseModel");

class ThesisReview extends BaseModel {
  constructor() {
    super("ThesisReview");
  }
}

module.exports = new ThesisReview();
