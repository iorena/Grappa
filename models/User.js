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

  findAll(params) {
    return this.Models[this.modelname].findAll({
        where: params || {},
        attributes: ["id", "email", "firstname", "lastname", "role", "isActive", "isRetired", "StudyFieldId"],
      });
  }

  findAllNotActive() {
    return this.Models[this.modelname].findAll({
        attributes: ["id", "email", "firstname", "lastname", "role", "isActive"],
        where: {
          isActive: false,
        },
      });
  }

  findStudyfieldsProfessor(StudyFieldId) {
    return this.Models.User.findOne({
      where: {
        role: "professor",
        StudyFieldId,
        isRetired: false,
      },
    });
  }

  findAllProfessors() {
    return this.Models[this.modelname].findAll({
        attributes: ["id", "email", "firstname", "lastname", "role", "StudyFieldId"],
        where: {
          isActive: true,
          isRetired: false,
          role: "professor",
          StudyFieldId: {
            $ne: null
          }
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
