"use strict";

const BaseModel = require("./BaseModel");

class StudyField extends BaseModel {
  constructor() {
    super("StudyField");
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

  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "name", "isActive"],
    });
  }
}

module.exports = new StudyField();
