"use strict";

module.exports = function(sequelize, DataTypes) {
  var CouncilMeeting = sequelize.define("CouncilMeeting", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        notEmpty: true,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        notEmpty: true,
      },
    },
    // studentDeadline: {
    //   type: DataTypes.DATE,
    //   validate: {
    //     isDate: true,
    //     notEmpty: true,
    //   },
    // },
    // instructorDeadline: {
    //   type: DataTypes.DATE,
    //   validate: {
    //     isDate: true,
    //     notEmpty: true,
    //   },
    // },
  });
  return CouncilMeeting;
}
