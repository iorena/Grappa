"use strict";

const BaseModel = require("./base_model");
// const Models = require("./shared");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// author: Sequelize.STRING,
// email: Sequelize.STRING,
// title: Sequelize.STRING,
// urkund: Sequelize.STRING,
// ethesis: Sequelize.STRING,
// abstract: Sequelize.TEXT,
// grade: Sequelize.STRING,

class Thesis extends BaseModel {
  constructor() {
    super("Thesis");
  }
}

module.exports.class = Thesis;
module.exports = new Thesis();
module.exports.getModel = () =>{
  return BaseModel.tables.Thesis;
};
