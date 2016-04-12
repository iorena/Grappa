"use strict";

const BaseModel = require("./base_model");

class User extends BaseModel {
  constructor() {
    super("User");
  }
}

module.exports.class = User;
module.exports = new User();
module.exports.getModel = () =>{
  return BaseModel.tables.User;
};
