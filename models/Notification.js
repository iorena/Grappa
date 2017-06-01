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

// TODO actually I think keeping the log data might be useful for statistics or something
  saveOne(values) {
    // remove all 30 days old notifications first
    const today = new Date();
    today.setDate(today.getDate() - 30)

    return this.Models[this.modelname].destroy({
        where: {
          createdAt: {
            $lt: today
          }
        }
      })
      .then(deletedRows => this.Models[this.modelname].create(values))
  }
}

module.exports = new Notification();
