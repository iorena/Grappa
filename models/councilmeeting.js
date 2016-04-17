"use strict";

const BaseModel = require("./base_model");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// date: Sequelize.DATE,

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }
  addThesisToCouncilMeeting(thesis, date) {
    this.getModel()
    .findOne({ where: { date: new Date(date) } })
    .then((CM) => {
      return CM.addTheses(thesis);
    })
    .then(() => {
      console.log("Thesis linked to councilmeeting")
    });
  }
}

module.exports.class = CouncilMeeting;
module.exports = new CouncilMeeting();
