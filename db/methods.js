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
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nYour thesis has been reviewed and submitted to the system. In this email's attachments you can find and read your review. If you're not satisfied with your grade, please contact Kjell Lemström.\n\nIf you accept your grade, please submit your thesis into eThesis https://ethesis.helsinki.fi/. And after submitting please re-submit the same PDF-document to Grappa using the supplied field below. The link expires in $VAR1$ after which you your thesis will be moved to the next councilmeeting.\n$LINK$",
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
  models.EmailDraft.create({
    type: "ResetPassword",
    title: "Password resetion",
    body: "You have requested to reset your password. To do so follow the provided link in the next 24 hours.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "NewPassword",
    title: "Your new password",
    body: "Here is your new password. Please change it as soon as possible.\n$VAR1$",
  }),
]);

module.exports.addLotTestData = () => Promise.all([
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
    firstname: "Kjell",
    lastname: "Lemström",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    isActive: true,
    StudyFieldId: null,
  }),
  models.User.create({
    firstname: "Proffa",
    lastname: "Sykerö",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "tkoivisto456@gmail.com",
    role: "professor",
    isActive: true,
    StudyFieldId: 1,
  }),
  models.Grader.create({
    name: "Arto Wikla",
    title: "Prof",
  }),
  models.Grader.create({
    name: "Arto Vihavainen",
    title: "Doc",
  }),
  models.CouncilMeeting.create({
    date: new Date("11/30/2016"),
    instructorDeadline: new Date("11/20/2016"),
    studentDeadline: new Date("11/25/2016"),
  }),
  models.EmailDraft.create({
    type: "EthesisReminder",
    title: "REMINDER: Submit your thesis to eThesis",
    body: "Hi\n\nThis is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in managing the final stages of approving student's master's degree.\n\nYour thesis has been reviewed and submitted to the system. In this email's attachments you can find and read your review. If you're not satisfied with your grade, please contact Kjell Lemström.\n\nIf you accept your grade, please submit your thesis into eThesis https://ethesis.helsinki.fi/. And after submitting please re-submit the same PDF-document to Grappa using the supplied field below. The link expires in $VAR1$ after which you your thesis will be moved to the next councilmeeting.\n$LINK$",
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
  models.EmailDraft.create({
    type: "ResetPassword",
    title: "Password resetion",
    body: "You have requested to reset your password. To do so follow the provided link in the next 24 hours.\n$LINK$",
  }),
  models.EmailDraft.create({
    type: "NewPassword",
    title: "Your new password",
    body: "Here is your new password. Please change it as soon as possible.\n$VAR1$",
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

module.exports.resetLotTestData = () => {
  module.exports.destroyTables()
    .then(() => module.exports.addLotTestData())
    .then(() => {
      console.log("Resetted the database with test data successfully!");
    })
    .catch(err => {
      console.log("resetTestData produced an error!");
      console.log(err);
    });
};
