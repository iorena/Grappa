"use strict";

const jwt =  require("jwt-simple");

class TokenGenerator {
  constructor() {
    this.secret = "grappa maistuu pahalta";
  }
  generateToken(user) {
    let date = new Date();
  	const payload = {
  		userId: user.id,
  		created: date,
  		expires: date.setDate(date.getDate() + 14),
  	};
    console.log(payload);
  	return jwt.encode(payload, this.secret);
  }
  decodeToken(token) {
    const user = jwt.decode(token, this.secret);
    console.log(user);
  }
}

module.exports = new TokenGenerator();
