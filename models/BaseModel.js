"use strict";

const Models = require("../db/tables").Models;

/**
 * Defines a base model for the other models to inherit.
 * 
 * I know, I know functional programming is all the rage nowadays BUT you can't say 
 * that this isn't handy here? This defines neatly the basic methods for all the models 
 * in a single file and sets the database schemas for all the models to use (as this.Models).
 * 
 * Yeah okay most of the models overwrite these methods or don't need them but they are still 
 * useful IMO and this structure is super simple to understand.
 */
class BaseModel {
  constructor(modelname) {
    this.modelname = modelname;
    this.Models = Models;
  }
  saveOne(values) {
    return this.Models[this.modelname].create(values);
  }
  findAll(params) {
    // if (params) {
    return this.Models[this.modelname].findAll({ where: params });
    // }
    // return this.Models[this.modelname].findAll();
  }
  findOne(params) {
    return this.Models[this.modelname].findOne({ where: params });
  }
  update(values, params) {
    return this.Models[this.modelname].update(values, { where: params });
  }
  delete(params) {
    return this.Models[this.modelname].destroy({ where: params });
  }
}

module.exports = BaseModel;
