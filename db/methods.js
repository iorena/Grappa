"use strict";

const tables = require("../models/tables");
const models = tables.Models;

module.exports.destroyTables = () => {
  return Promise.all(Object.keys(models).map(key => {
    if ({}.hasOwnProperty.call(models, key)) {
      return models[key].destroy({ where: {} });
    }
  }));
};

module.exports.createTables = () => {
  return tables.syncForce();
  // return tables.sync();
};

module.exports.dropTables = () => {
  return Promise.all(Object.keys(models).map(key => {
    return models[key].drop({ cascade: true });
  }));
};

module.exports.addTestData = () => Promise.all([
  models.User.create({
    name: "B Virtanen",
    password: "asdf",
    title: "print-person",
    email: "ohtugrappa2@gmail.com",
    admin: true,
  }),
  models.User.create({
    name: "Kjell Lemström",
    password: "asdf",
    title: "head of studies",
    email: "ohtugrappa@gmail.com",
    admin: true,
  }),
  models.Thesis.create({
    author: "Pekka Graduttaja",
    email: "ohtugrappa@gmail.com",
    title: "Oliko Jeesus olemassa",
    urkund: "urkunlinkki.com",
    ethesis: "ethesislinkki.com",
    abstract: "Abstract from ethesis blaablaa",
    grade: "Laudatur",
  }),
  models.ThesisProgress.create({
    thesisId: "1",
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    documentsSent: Date.now(),
  }),
  models.Grader.create({
    name: "Mr. Grader2",
    title: "Professor of internet",
  }),
  models.CouncilMeeting.create({
    date: new Date("1.1.2016"),
  }),
  models.CouncilMeeting.create({
    date: Date.now(),
  }),
  models.StudyField.create({
    name: "Algorithmic Bioinformatics",
  }),
  models.StudyField.create({
    name: "Algorithms, Data Analytics and Machine Learning",
  }),
  models.StudyField.create({
    name: "Networking and Services",
  }),
  models.StudyField.create({
    name: "Software Systems",
  }),
  models.ThesisProgress.create({
    thesisId: 1,
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    gradersStatus: false,
    documentsSent: Date.now(),
    isDone: false,
  }),
  models.EmailStatus.create({
    lastSent: Date.now(),
    type: "StudentReminder",
    to: "asdf@asdfasdf.com",
    whoAddedEmail: "ohtugrappa@gmail.com", // vai User
    deadline: new Date("1 1 2017"),
    wasError: true,
  })
  ]);

module.exports.dump = () => {
  return Promise.all(Object.keys(models).map(key => {
    if ({}.hasOwnProperty.call(models, key)) {
      return models[key].findAll();
    }
  }));
};

module.exports.dropAndCreateTables = () => {
  return module.exports.createTables()
  .then(() => module.exports.addTestData() )
  .then(() => {
    console.log("Dropped and created models with test data succesfully!");
  })
  .catch((err) => {
    console.log("dropAndCreateTables produced an error!");
    console.log(err);
  })
}

module.exports.resetTestData = () => {
  module.exports.destroyTables()
  .then(() => module.exports.addTestData() )
  .then(() => {
    console.log("Resetted the database with test data successfully!");
  })
  .catch(err => {
    console.log("resetTestData produced an error!");
    console.log(err);
  });
}
