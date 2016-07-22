"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "email", "name", "role", "isActive", "StudyFieldId"],
      include: [{
        model: this.Models.Thesis,
        as: "Theses",
      }, {
        model: this.Models.StudyField,
      }],
    });
  }

  findAllNotActive() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "email", "name", "role", "isActive"],
      where: {
        isActive: false,
      },
    });
  }

  update(values, params) {
    // when deleting association setting StudyFieldId="" doesn't work, it must be StudyFieldId=null x_x
    if (!values.StudyFieldId) {
      values.StudyFieldId = null;
    }
    return this.Models[this.modelname].update(values, { where: params });
  }
}

module.exports = new User();
