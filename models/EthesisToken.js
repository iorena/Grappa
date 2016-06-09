"use strict";

const BaseModel = require("./BaseModel");

class EthesisToken extends BaseModel {
  constructor() {
    super("EthesisToken");
  }
}

module.exports = new EthesisToken();
