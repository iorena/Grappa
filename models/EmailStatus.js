"use strict";

const BaseModel = require("./BaseModel");

class EmailStatus extends BaseModel {
  constructor() {
    super("EmailStatus");
  }
}

module.exports = new EmailStatus();
