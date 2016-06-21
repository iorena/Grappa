"use strict";

const Sequelize = require("sequelize");
const seq = require("../db/db_connection").sequalize;

const User = seq.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  passwordHash: Sequelize.STRING,
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

const Thesis = seq.define("Thesis", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  authorFirstname:
  {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  authorLastname:
  {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  authorEmail: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  title: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  urkund: {
    type: Sequelize.STRING,
  },
  ethesis: {
    type: Sequelize.STRING,
  },
  grade: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [[
        "Approbatur",
        "Lubenter Approbatur",
        "Non Sine Laude Approbatur",
        "Cum Laude Approbatur",
        "Magna Cum Laude Approbatur",
        "Eximia Cum Laude Approbatur",
        "Laudatur",
      ]],
    },
  },
  deadline: {
    type: Sequelize.DATE,
    validate: {
      isDate: true,
      notEmpty: true,
    },
  },
  graderEval: {
    type: Sequelize.TEXT,
  },
  pathToFileReview: Sequelize.STRING,
});

const EthesisToken = seq.define("EthesisToken", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  token: Sequelize.STRING,
});

const Grader = seq.define("Grader", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  title: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [["Prof", "AssProf", "AdjProf", "Doc", "Other"]],
    },
  },
});

const CouncilMeeting = seq.define("CouncilMeeting", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  date: {
    type: Sequelize.DATE,
    validate: {
      isDate: true,
      notEmpty: true,
    },
  },
});

const StudyField = seq.define("StudyField", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [[
        "Algorithmic Bioinformatics",
        "Algorithms, Data Analytics and Machine Learning",
        "Networking and Services",
        "Software Systems",
      ]],
    },
  },
});

const Review = seq.define("Review", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  authoredByProf: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  text: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true,
    },
  },
});

const ThesisProgress = seq.define("ThesisProgress", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  ethesisDone: { type: Sequelize.BOOLEAN, defaultValue: false },
  graderEvalDone: { type: Sequelize.BOOLEAN, defaultValue: false },
  printDone: { type: Sequelize.BOOLEAN, defaultValue: false },
  done: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const EmailDraft = seq.define("EmailDraft", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  type: Sequelize.STRING,
  title: Sequelize.STRING,
  body: Sequelize.STRING,
});

const EmailStatus = seq.define("EmailStatus", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  lastSent: Sequelize.DATE,
  type: Sequelize.STRING,
  to: Sequelize.STRING,
  deadline: Sequelize.DATE,
  wasError: { type: Sequelize.BOOLEAN, defaultValue: false },
});

Thesis.belongsTo(StudyField);

EthesisToken.belongsTo(Thesis);

Review.belongsTo(Thesis);
Review.belongsTo(User);

Grader.belongsToMany(Thesis, { through: "GraderThesis" });
Thesis.belongsToMany(Grader, { through: "GraderThesis" });

CouncilMeeting.hasMany(Thesis, { as: "Theses" });
Thesis.belongsTo(CouncilMeeting);

User.belongsTo(StudyField);

Thesis.hasMany(Review);

User.hasMany(Thesis, { as: "Theses" });
Thesis.belongsTo(User);

User.hasMany(Review);

ThesisProgress.belongsTo(EmailStatus, { as: "EthesisEmail" });
ThesisProgress.belongsTo(EmailStatus, { as: "GraderEvalEmail" });
ThesisProgress.belongsTo(EmailStatus, { as: "PrintEmail" });

StudyField.hasMany(Thesis);
StudyField.hasMany(User);
ThesisProgress.belongsTo(Thesis);
Thesis.hasOne(ThesisProgress);

EmailStatus.belongsTo(EmailDraft);

module.exports.sync = () => {
  return seq.sync();
};
module.exports.syncForce = () => {
  return seq.sync({ force: true });
};

module.exports.Models = {
  User,
  Thesis,
  Grader,
  CouncilMeeting,
  StudyField,
  Review,
  ThesisProgress,
  EmailStatus,
  EmailDraft,
  EthesisToken,
};
