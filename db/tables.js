const Sequelize = require("sequelize");
const seq = require("../db/db_connection").sequelize;

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
  firstname: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  lastname: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
      isIn: [[
        "admin",
        "professor",
        "instructor",
        "print-person",
      ]],
    },
  },
  hasBeenShownStartInfo: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isRetired: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isSpectator: {
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
  graderEval: {
    type: Sequelize.TEXT,
  },
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
  studentDeadline: {
    type: Sequelize.DATE,
    validate: {
      isDate: true,
      notEmpty: true,
    },
  },
  instructorDeadline: {
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
    },
  },
  isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
});

const ThesisReview = seq.define("ThesisReview", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  pdf: {
    type: Sequelize.BLOB,
    validate: {
      notEmpty: true,
    },
  },
});

const ThesisAbstract = seq.define("ThesisAbstract", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  pdf: {
    type: Sequelize.BLOB,
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
});

const EmailDraft = seq.define("EmailDraft", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  type: Sequelize.STRING,
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
});

const EmailStatus = seq.define("EmailStatus", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  lastSent: Sequelize.DATE,
  type: Sequelize.STRING,
  to: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  wasError: { type: Sequelize.BOOLEAN, defaultValue: false },
});

const Notification = seq.define("Notification", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  type: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  content: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  hasBeenRead: { type: Sequelize.BOOLEAN, defaultValue: false },
});

Thesis.belongsTo(StudyField);

ThesisReview.belongsTo(Thesis);
ThesisReview.belongsTo(User);
Thesis.hasOne(ThesisReview);

ThesisAbstract.belongsTo(Thesis);
Thesis.hasOne(ThesisAbstract);

Grader.belongsToMany(Thesis, { through: "GraderThesis" });
Thesis.belongsToMany(Grader, { through: "GraderThesis" });

CouncilMeeting.hasMany(Thesis, { as: "Theses" });
Thesis.belongsTo(CouncilMeeting);

User.belongsTo(StudyField);

User.hasMany(Thesis, { as: "Theses" });
Thesis.belongsTo(User);

ThesisProgress.belongsTo(EmailStatus, { as: "EthesisReminder" });
ThesisProgress.belongsTo(EmailStatus, { as: "GraderEvalReminder" });
ThesisProgress.belongsTo(EmailStatus, { as: "PrintReminder" });

StudyField.hasMany(Thesis);
StudyField.hasMany(User);
ThesisProgress.belongsTo(Thesis);
Thesis.hasOne(ThesisProgress);

EmailStatus.belongsTo(EmailDraft);
EmailStatus.belongsTo(Thesis);

Notification.belongsTo(User, { as: "Recipient" });
Notification.belongsTo(User, { as: "CreatedBy" });

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
  ThesisReview,
  ThesisAbstract,
  ThesisProgress,
  EmailStatus,
  EmailDraft,
  Notification,
};
