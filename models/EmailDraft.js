"use strict";

const BaseModel = require("./BaseModel");

class EmailDraft extends BaseModel {
  constructor() {
    super("EmailDraft");
  }
  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "type", "title", "body"],
    });
  }
}

module.exports = new EmailDraft();
