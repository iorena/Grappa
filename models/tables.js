const Sequelize = require("sequelize");
// const db = require("../db/db_connection");
const seq = require("../db/db_connection").sequalize;

const User = seq.define("User", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  admin: { type: Sequelize.BOOLEAN, defaultValue: false },
});
const Thesis = seq.define("Thesis", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  author: Sequelize.STRING,
  email: Sequelize.STRING,
  title: Sequelize.STRING,
  urkund: Sequelize.STRING,
  ethesis: Sequelize.STRING,
  abstract: Sequelize.TEXT,
  grade: Sequelize.STRING,
});
const Grader = seq.define("Grader", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  title: Sequelize.STRING,
});
const CouncilMeeting = seq.define("CouncilMeeting", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  date: Sequelize.DATE,
});
const StudyField = seq.define("StudyField", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
});
const Review = seq.define("Review", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  author: Sequelize.STRING,
  text: Sequelize.TEXT,
});

Thesis.belongsToMany(User, { through: "UserTheses" });
Thesis.belongsTo(StudyField);

Review.belongsTo(Thesis);
Review.belongsTo(User);

Grader.belongsToMany(Thesis, { through: "GraderTheses" });

CouncilMeeting.belongsToMany(Thesis, { through: "CouncilMeetingTheses" });

User.belongsTo(StudyField);

Thesis.hasMany(Review);
Thesis.hasMany(Grader);
Thesis.hasOne(CouncilMeeting);

User.hasMany(Thesis);
User.hasMany(Review);

StudyField.hasMany(Thesis);
StudyField.hasMany(User);

seq.sync();

module.exports = {
  User,
  Thesis,
  Grader,
  CouncilMeeting,
  StudyField,
  Review,
};
