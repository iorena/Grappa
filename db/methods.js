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


module.exports.dropTables = () => {
  let queries = [];
  for(let key in tables) {
    queries.push(tables[key].drop({cascade: true}));
  }
  return Promise.all(queries);
};

module.exports.createTestData = () => Q.all([
  tables.User.create({
    name: "testikäyttäja",
    email: "email@email.com",
    admin: true,
  }),
  tables.Thesis.create({
    author: "Pekka Graduttaja",
    email: "pekka@maili.com",
    title: "testigradu",
    urkund: "urkunlinkki.com",
    ethesis: "ethesislinkki.com",
    abstract: "Abstract from ethesis blaablaa",
    grade: "Laudatur",
  }),
  tables.ThesisProgress.create({
    thesisId: "1",
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    documentsSent: Date.now(),
  }),
  tables.Grader.create({
    name: "Mr. Grader2",
    title: "Professor of internet",
  }),
  tables.CouncilMeeting.create({
    date: "2016-04-12T00:00:00.000Z",
  }),
  tables.StudyField.create({
    name: "Algoritmit",
  }),
  tables.ThesisProgress.create({
    thesisId: 1,
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    gradersStatus: false,
    documentsSent: Date.now(),
    isDone: false,
  }),
  tables.sync();
]);

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
  console.log("Destroyed and created tables successfully!");
})
.catch(err => {
  console.log("add_test_data destroyAndCreateTables produced an error!");
  console.log(err);
});
