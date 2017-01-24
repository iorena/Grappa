"use strict";

const BaseModel = require("./BaseModel");

class Notification extends BaseModel {
  constructor() {
    super("Notification");
  }

  setRead(ids) {
    return Promise.all(ids.map(id => 
      this.Models.Notification.update({ hasBeenRead: true }, { where: { id, }})
    ))
  }
}

module.exports = new Notification();
