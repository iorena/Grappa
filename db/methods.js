"use strict";

const Q = require("q");

const tables = require("../models/tables");

module.exports.destroyTables = () => {
  const queries = [];
  for (const key in tables) {
    if ({}.hasOwnProperty.call(tables.key)) {
      queries.push(tables[key].destroy({ where: {} }));
    }
  }
  return Promise.all(queries);
};

module.exports.createTestData = () => {
  return Q.all([
    tables["User"].create({
      name: "testikäyttäja",
      email: "email@email.com",
      admin: true,
    }),
    tables["ThesisProgress"].create({
      thesisId: "1",
      ethesisReminder: Date.now(),
      professorReminder: Date.now(),
      documentsSent: Date.now(),
    }),
    tables["Thesis"].create({
      author: "Pekka Graduttaja",
      email: "pekka@maili.com",
      title: "testigradu",
      urkund: "urkunlinkki.com",
      ethesis: "ethesislinkki.com",
      abstract: "Abstract from ethesis blaablaa",
      grade: "Laudatur",
      deadline: "2016-04-19T21:00:00.000Z",
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
  const queries = [];
  for (const key in tables) {
    if ({}.hasOwnProperty.call(tables.key)) {
      queries.push(tables[key].findAll());
    }
  }
  return Promise.all(queries);
};

module.exports.destroyAndCreateTables = () => module.exports.destroyTables()
  .then(() => module.exports.createTestData()
  )
  .then(() => {
    console.log("Destroyed and created tables succesfully!");
  })
  .catch(err => {
    console.log("add_test_data destroyAndCreateTables produced an error!");
    console.log(err);
  });
