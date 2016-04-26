"use strict";

const BaseModel = require("./base_model");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  findAll() {
    return this.Models[this.modelname]
    .findAll({
      include: [{
        model: this.Models.Thesis,
        as: "Theses"
      }]
    });
  }
}

module.exports.class = User;
module.exports = new User();
