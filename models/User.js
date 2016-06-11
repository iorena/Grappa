"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  findAllNotActive() {
    return this.Models[this.modelname]
    .findAll({
      where: {
        isActive: false,
      },
      include: [{
        model: this.Models.Thesis,
        as: "Theses",
      }],
    });
  }
}

module.exports = new User();
