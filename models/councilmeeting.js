"use strict";

const BaseModel = require("./base_model");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// date: Sequelize.DATE,

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }
  linkThesisToCouncilMeeting(thesis, date) {
    return this.getModel()
      .findOne({ where: { date: new Date(date) } })
      .then((CM) => {
        // console.log("HEI CM");
        // console.log(CM);
        return CM.addTheses(thesis);
      })
      .then(() => {
        console.log("Thesis linked to councilmeeting");
      });
  }
}

module.exports.class = CouncilMeeting;
module.exports = new CouncilMeeting();
