"use strict";

const BaseModel = require("./BaseModel");

class StudyField extends BaseModel {
  constructor() {
    super("StudyField");
  }

  findOne(params) {
    return this.Models[this.modelname]
      .findOne({
        attributes: ["id", "name", "isActive"],
        where: params,
      });
  }

  findAll() {
    return this.Models[this.modelname]
      .findAll({
        attributes: ["id", "name", "isActive"],
      });
  }

  saveOne(values) {
    return this.getModel().create(values)
      .then(newField => {
        return {
          id: newField.id,
          name: newField.name,
          isActive: newField.isActive
        }
      });
  }
}

module.exports = new StudyField();
