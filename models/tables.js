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
  author:
  {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  email: {
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
  abstract: {
    type: Sequelize.TEXT,
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
  graderEvaluation: {
    type: Sequelize.TEXT,
  },
});

const EthesisToken = seq.define("EthesisToken", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  author: Sequelize.STRING,
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
  ethesisReminder: Sequelize.DATE,
  professorReminder: Sequelize.DATE,
  gradersStatus: { type: Sequelize.BOOLEAN, defaultValue: false },
  documentsSent: Sequelize.DATE,
  isDone: { type: Sequelize.BOOLEAN, defaultValue: false },
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

StudyField.hasMany(Thesis);
StudyField.hasMany(User);
ThesisProgress.belongsTo(Thesis, { foreignKey: "thesisId" });
Thesis.hasOne(ThesisProgress, { foreignKey: "thesisId" });

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
  EthesisToken,
};
