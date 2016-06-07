"use strict";

const BaseModel = require("./base_model");

class EthesisToken extends BaseModel {
  constructor() {
    super("EthesisToken");
  }
}

module.exports.class = EthesisToken;
module.exports = new EthesisToken();
