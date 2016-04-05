"use strict";

const BaseModel = require("./base_model");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// date: Sequelize.DATE,

class CouncilMeeting extends BaseModel {
  constructor() {
    super("CouncilMeeting");
  }
}

module.exports.class = CouncilMeeting;
module.exports = new CouncilMeeting();
