"use strict";

const BaseModel = require("./BaseModel");

class EmailDraft extends BaseModel {
  constructor() {
    super("EmailDraft");
  }

  saveOne(values) {
    return this.Models.EmailDraft.create(values)
      .then(newDraft => {
        return {
          id: newDraft.id,
          type: newDraft.type,
          title: newDraft.title,
          body: newDraft.body,
        }
      });
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
