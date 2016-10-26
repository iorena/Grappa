"use strict";

// TODO Switch to jsonwebtoken
// or maybe creat pull request to make this return undefined
// but probably I still want to use the async version
const jwt = require("jwt-simple");

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  decodeToken(token) {
    let decoded;
    try {
      decoded = jwt.decode(token, this.secret);
    } catch (e) {
      decoded = undefined;
    }
    return decoded;
  }
  isTokenExpired(decodedToken) {
    return new Date() > decodedToken.expires;
  }
  generateLoginToken(user) {
    const date = new Date();
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
      name: "login",
      created: new Date(),
      // expires: date.setDate(date.getDate() + 1),
      expires: date.setHours(date.getHours() + 3),
    };
    return jwt.encode(payload, this.secret);
  }
  generateEthesisToken(ThesisId) {
    const date = new Date();
    const payload = {
      ThesisId,
      name: "ethesis",
      created: new Date(),
      // TODO set to expire in a year?
      expires: date.setHours(date.getHours() + 1),
    };
    return jwt.encode(payload, this.secret);
  }
  generateResetPasswordToken(user) {
    const date = new Date();
    const payload = {
      user: {
        id: user.id,
      },
      name: "password",
      created: new Date(),
      expires: date.setHours(date.getHours() + 1),
    }
    return jwt.encode(payload, this.secret);
  }
}

module.exports = new TokenGenerator(process.env.TOKEN_SECRET);
module.exports.class = TokenGenerator;
