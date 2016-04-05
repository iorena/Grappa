"use strict";

const Models = require("./shared");

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// date: Sequelize.DATE,

module.exports.findAll = () => {
  return Models.findAll("CouncilMeeting");
};

module.exports.saveOne = (cmeeting) => {
  return Models.saveOne("CouncilMeeting", cmeeting);
};
