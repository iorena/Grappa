"use strict";

const Models = require("../db/tables").Models;

/**
 * Defines a base model for the other models to inherit.
 * 
 * This defines neatly the basic methods for all the models 
 * in a single file and sets the database schemas for all the models to use (as this.Models).
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
    return this.Models[this.modelname].findAll({ where: params });
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
