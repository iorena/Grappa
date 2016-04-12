"use strict";

const BaseModel = require("./base_model");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }
}

module.exports.class = Grader;
module.exports = new Grader();
module.exports.getModel = () =>{
  return BaseModel.tables.Grader;
};
