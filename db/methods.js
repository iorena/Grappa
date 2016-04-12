"use strict";

const Q = require("q");

const tables = require("../models/tables");

module.exports.destroyTables = () => {
  let queries = [];
  for(let key in tables) {
    queries.push(tables[key].destroy({where: {}}));
  }
  return Promise.all(queries);
};

module.exports.createTestData = () => {
  return Q.all([
    tables["User"].create({
      name: "B Virtanen",
      title: "print-person",
      email: "ohtugrappa@gmail.com",
      admin: true,
    }),
    tables["User"].create({
      name: "Kjell Lemström",
      title: "head of studies",
      email: "ohtugrappa@gmail.com",
      admin: true,
    }),
    tables["Thesis"].create({
      author: "Pekka Graduttaja",
      email: "ohtugrappa@gmail.com",
      title: "Oliko Jeesus olemassa",
      urkund: "urkunlinkki.com",
      ethesis: "ethesislinkki.com",
      abstract: "Abstract from ethesis blaablaa",
      grade: "Laudatur",
    }),
    tables["Grader"].create({
      name: "Mr. Grader2",
      title: "Professor of internet",
    }),
    tables["CouncilMeeting"].create({
      date: Date.now(),
    }),
    tables["StudyField"].create({
      name: "Algoritmit",
    }),
  ]);
};

module.exports.dump = () => {
  let queries = [];
  for(const key in tables) {
    queries.push(tables[key].findAll());
  }
  return Promise.all(queries);
}

module.exports.destroyAndCreateTables = () => {
  return module.exports.destroyTables()
    .then(() => {
      return module.exports.createTestData()
    })
    .then(() => {
      console.log("Destroyed and created tables succesfully!");
    })
    .catch(err => {
      console.log("add_test_data destroyAndCreateTables produced an error!");
      console.log(err);
    });
};
