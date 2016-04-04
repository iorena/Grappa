const Q = require("q");

// const tables = require("../models/tables");
const Models = require("../models/shared");

module.exports.dropTables = () => {
  return Q.all([
    Models.drop("User"),
    Models.drop("Thesis"),
    Models.drop("Grader"),
    Models.drop("CouncilMeeting"),
    Models.drop("StudyField"),
    Models.drop("Review"),
    // tables.User.destroy({where: {}}),
    // tables.Thesis.destroy({where: {}}),
    // tables.Grader.destroy({where: {}}),
    // tables.CouncilMeeting.destroy({where: {}}),
    // tables.StudyField.destroy({where: {}}),
    // tables.Review.destroy({where: {}}),
  ]);
  // tables.map(table => {
  //   table.drop();
  // })
};

module.exports.createTestData = () => {
  return Q.all([
    Models.saveOne("User", {
      name: "testikäyttäja",
      email: "email@email.com",
      admin: true,
    }),
    Models.saveOne("Thesis", {
      author: "Pekka Graduttaja",
      email: "pekka@maili.com",
      title: "testigradu",
      urkund: "urkunlinkki.com",
      ethesis: "ethesislinkki.com",
      abstract: "Abstract from ethesis blaablaa",
      grade: "Laudatur",
    }),
    Models.saveOne("Grader", {
      name: "Mr. Grader2",
      title: "Professor of internet",
    }),
    Models.saveOne("CouncilMeeting", {
      date: Date.now(),
    }),
    Models.saveOne("StudyField", {
      name: "Algoritmit",
    }),
  ]);
};

module.exports.dropAndCreateTables = () => {
  return module.exports.dropTables()
    .spread(() => {
      return module.exports.createTestData()
    })
    .spread(() => {
      console.log("Dropped and created tables succesfully!");
    })
    .catch(err => {
      console.log("add_test_data dropAndCreateTables produced an error!");
      console.log(err);
    });
};
