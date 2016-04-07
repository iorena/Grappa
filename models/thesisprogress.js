"use strict";

const BaseModel = require("./base_model");

class Thesisprogress extends BaseModel {
  constructor() {
    super("Thesisprogress");
  }
}

module.exports.class = Thesisprogress;
module.exports = new Thesisprogress();
