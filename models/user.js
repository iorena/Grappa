"use strict";

const BaseModel = require("./base_model");

class User extends BaseModel {
  constructor() {
    super("User");
  }
}

module.exports.class = User;
module.exports = new User();
