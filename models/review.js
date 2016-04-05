"use strict";

const BaseModel = require("./base_model");

class Review extends BaseModel {
  constructor() {
    super("Review");
  }
}

module.exports.class = Review;
module.exports = new Review();
