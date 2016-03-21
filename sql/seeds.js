var db = require('../src/dbRequest');


db.add({
	name: 'testikäyttäja',
	email: 'email@email.com',
	admin: true
}, "user");

db.add({
	author: 'Pekka Graduttaja',
	email: 'pekka@maili.com',
	title: "testigradu",
	urkund: 'urkunlinkki.com',
	ethesis: 'ethesislinkki.com',
	abstract: 'Abstract from ethesis blaablaa',
	grade: 'Laudatur'
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





