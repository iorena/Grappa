var Sequelize = require("sequelize");
var dbUrl = process.env.DATABASE_URL;
var seq = new Sequelize(dbUrl, { dialectOptions: { ssl: true } });

var User = seq.define('User', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    admin: { type: Sequelize.BOOLEAN, defaultValue: false}

});
var Thesis = seq.define('Thesis', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    author: Sequelize.STRING,
    email: Sequelize.STRING,
    title: Sequelize.STRING,
    urkund: Sequelize.STRING,
    ethesis: Sequelize.STRING,
    abstract: Sequelize.TEXT,
    grade: Sequelize.STRING
});
var Grader = seq.define('Grader', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: Sequelize.STRING,
    title: Sequelize.STRING
});
var CouncilMeeting = seq.define('CouncilMeeting',{
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    date: Sequelize.DATE
});
var StudyField = seq.define('StudyField',{
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: Sequelize.STRING
});
var Review = seq.define('Review',{
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    author: Sequelize.STRING,
    text: Sequelize.TEXT
});

Thesis.belongsToMany(User, {through: 'UserTheses'});
Thesis.belongsTo(StudyField);

Review.belongsTo(Thesis);
Review.belongsTo(User);

Grader.belongsToMany(Thesis, {through: 'GraderTheses'});

CouncilMeeting.belongsToMany(Thesis, {through: 'CouncilMeetingTheses'});

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
    "user": User,
    "thesis": Thesis,
    "grader": Grader,
    "councilmeeting": CouncilMeeting,
    "studyfield": StudyField,
    "review": Review
};
