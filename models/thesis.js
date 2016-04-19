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
  /*
   * Or remove, I don't really know what it does..
   */
  add10DaysToDeadline(deadline) {
    const date = new Date(deadline);
    date.setDate(date.getDate() - 10);
    return date.toISOString();
  }
  saveOne(params) {
    // console.log("params are: " + JSON.stringify(params));
    const values = Object.assign({}, params);
    // the crazy validation loop. wee!
    Object.keys(params).map(key => {
      if (values[key] !== null && !this.Validator.validate(values[key], key)) {
        throw("ValidationError: " + key + " isn't the wanted type!");
      }
    });
    if (values.deadline !== null) {
      values.deadline = this.add10DaysToDeadline(params.deadline);
    }
    return this.getModel().create(values);
  }
  findAllByUserRole(user) {
    if (user.role === "admin" || user.role === "print-person") {
      return this.Models.Thesis.findAll();
    } else if (user.role === "professor") {
      return this.Models.Thesis.findAll({ where: { StudyFieldId: user.StudyFieldId }});
    } else if (user.role === "instructor") {
      return this.Models.Thesis.findOne({ where: { UserId: user.id }});
    }
    // calls the parent classes method. nice!
    // return BaseModel.prototype.findAll.call(this);
  }
}

module.exports.class = Thesis;
module.exports = new Thesis();
