"use strict";

const Models = require("./shared");
// const Thesis = require("./tables").Thesis;

// id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
// author: Sequelize.STRING,
// email: Sequelize.STRING,
// title: Sequelize.STRING,
// urkund: Sequelize.STRING,
// ethesis: Sequelize.STRING,
// abstract: Sequelize.TEXT,
// grade: Sequelize.STRING,

// module.exports.validate = (thesis) => {
//   thesis.map( key => {
//     switch(key) {
//       case author:
//     }
//   })
// }

module.exports.findAll = () => {
  return Models.findAll("Thesis");
  // return Thesis.findAll();
}

module.exports.saveOne = (thesis) => {
  return Models.saveOne("Thesis", thesis);
  // return Thesis.create(thesis);
}
