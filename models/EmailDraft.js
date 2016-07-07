"use strict";

const BaseModel = require("./BaseModel");

class EmailDraft extends BaseModel {
  constructor() {
    super("EmailDraft");
  }
}

module.exports = new EmailDraft();
