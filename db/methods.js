"use strict";

const tables = require("./tables");
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
  models.StudyField.create({
    id: 1,
    name: "Algorithmic Bioinformatics",
  }),
  models.StudyField.create({
    id: 2,
    name: "Algorithms, Data Analytics and Machine Learning",
  }),
  models.StudyField.create({
    id: 3,
    name: "Networking and Services",
  }),
  models.StudyField.create({
    id: 4,
    name: "Software Systems",
  }),
  models.User.create({
    firstname: "Testi",
    lastname: "Admin",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    isActive: true,
    StudyFieldId: null,
  }),
  models.EmailDraft.create({
    type: "EthesisReminder",
    title: "REMINDER: Submit your thesis to eThesis",
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nPlease submit your thesis into eThesis https://ethesis.helsinki.fi/. And after submitting please copy the eThesis link to your thesis' PDF-file and enter it into the supplied field below.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "GraderEvalReminder",
    title: "REMINDER: Submit your evaluation",
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nDue to rules of the process, your evaluation of the instructors is needed for the process to continue. Please submit your evaluation in the provided link.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "PrintReminder",
    title: "REMINDER: Theses are ready to print",
    body: "Hi\n\nThis is an automatic reminder from Grappa, a web application to help in managing the bureaucratic side of the processes related to the final stages of a students Masters degree.\n\nTheses for the next councilmeeting are ready to be printed at https://grappa.cs.helsinki.fi.",
  }),
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
  .then(() => module.exports.addTestData())
  .then(() => {
    console.log("Dropped and created models with test data succesfully!");
  })
  .catch((err) => {
    console.log("dropAndCreateTables produced an error!");
    console.log(err);
  });
};

module.exports.resetTestData = () => {
  module.exports.destroyTables()
  .then(() => module.exports.addTestData())
  .then(() => {
    console.log("Resetted the database with test data successfully!");
  })
  .catch(err => {
    console.log("resetTestData produced an error!");
    console.log(err);
  });
};
