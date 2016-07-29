"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  findOne(params) {
    return this.Models[this.modelname].findOne({
      attributes: ["id", "email", "passwordHash", "firstname", "lastname", "role", "isActive", "isRetired", "StudyFieldId"],
      where: params,
    });
  }

  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "email", "firstname", "lastname", "role", "isActive", "isRetired", "StudyFieldId"],
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
      attributes: ["id", "email", "firstname", "lastname", "role", "isActive"],
      where: {
        isActive: false,
      },
    });
  }

  findAllProfessors() {
    return this.Models.StudyField.findAll()
      .then(fields => {
        return Promise.all(fields.map(field => {
          return this.Models.User.findOne({
            where: {
              role: "professor",
              StudyFieldId: field.id,
            },
          });
        }));
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
