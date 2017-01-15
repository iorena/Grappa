"use strict";

const BaseModel = require("./BaseModel");

class EmailDraft extends BaseModel {
  constructor() {
    super("EmailDraft");
  }

  findOne(params) {
    return this.Models[this.modelname]
      .findOne({
        attributes: ["id", "type", "title", "body"],
        where: params,
      });
  }

  findAll() {
    return this.Models[this.modelname]
      .findAll({
        attributes: ["id", "type", "title", "body"],
      });
  }
}

module.exports = new EmailDraft();
