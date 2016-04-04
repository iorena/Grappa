const tables = require("../models/tables");
const db = require("../models/shared");

module.exports.dropTables = () => {
  tables.user.destroy({where: {}}).then(function () {});
  tables.thesis.destroy({where: {}}).then(function () {});
  tables.grader.destroy({where: {}}).then(function () {});
  tables.councilmeeting.destroy({where: {}}).then(function () {});
  tables.studyfield.destroy({where: {}}).then(function () {});
  tables.review.destroy({where: {}}).then(function () {});
}

module.exports.createTestData = () => {
  db.add({
  	name: "testikäyttäja",
  	email: "email@email.com",
  	admin: true
  }, "user");

  db.add({
  	author: "Pekka Graduttaja",
  	email: "pekka@maili.com",
  	title: "testigradu",
  	urkund: "urkunlinkki.com",
  	ethesis: "ethesislinkki.com",
  	abstract: "Abstract from ethesis blaablaa",
  	grade: "Laudatur"
  }, "thesis");

  db.add({
  	name: "Mr. Grader2",
  	title: "Professor of internet"
  }, "grader");

  db.add({
  	author: "Tauno Tarkastaja",
  	review_text: "Mielestäni Tauno on erittäin pätevä jätkä"
  }, "grader");

  db.add({
  	date: Date.now()
  }, "councilmeeting");

  db.add({
  	name: "Algoritmit"
  }, "studyfield");
}
