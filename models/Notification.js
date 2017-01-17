"use strict";

const BaseModel = require("./BaseModel");

class Notification extends BaseModel {
  constructor() {
    super("Notification");
  }
}

module.exports = new Notification();
