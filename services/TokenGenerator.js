"use strict";

const jwt = require("jwt-simple");
const config = require("../config/authentication");

class TokenGenerator {
  constructor(config) {
    this.secret = config.secret;
  }
  generateToken(user) {
    const date = new Date();
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
  generateEthesisToken(authorname, thesisId) {
    const payload = {
      authorname,
      thesisId,
    };
    return jwt.encode(payload, this.secret);
  }
  decodeEthesisToken(token) {
    const ethesisToken = jwt.decode(token, this.secret);
    console.log(ethesisToken);
    return ethesisToken;
  }
}

module.exports = new TokenGenerator(config);
