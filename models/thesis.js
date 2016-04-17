"use strict";

const BaseModel = require("./base_model");

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
  add10DaysToDeadline(deadline) {
    let date = new Date(deadline);
    date.setDate(date.getDate() - 10);
    return date.toISOString();
  }
  saveOne(params) {
    // console.log("params are: " + JSON.stringify(params));
    let values = Object.assign({}, params);
    // the crazy validation loop. wee!
    Object.keys(params).map(key => {
      if (values[key] !== null && !this.Validator.validate(values[key], key)) {
        throw("ValidationError: " + key + " isn't the wanted type!");
      }
    })
    if (values.deadline !== null) {
      values.deadline = this.add10DaysToDeadline(params.deadline);
    }
    return this.getModel().create(values);
  }
}

module.exports.class = Thesis;
module.exports = new Thesis();
