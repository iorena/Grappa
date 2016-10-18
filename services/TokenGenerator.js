"use strict";

const jwt = require("jwt-simple");

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
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
      expires: date.setDate(date.getDate() + 14),
    };
    return jwt.encode(payload, this.secret);
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
  generateEthesisToken(authorname, thesisId) {
    const payload = {
      authorname,
      thesisId,
    };
    return jwt.encode(payload, this.secret);
  }
  generatePassword() {
    return jwt.encode(new Date().toString(), "lulz");
  }
  generatePasswordResetionToken(user) {
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
