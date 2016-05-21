"use strict";

const jwt = require("jwt-simple");

class TokenGenerator {
  constructor() {
    this.secret = process.env.TOKEN_SECRET;
  }
  generateToken(user) {
    const date = new Date();
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        StudyFieldId: user.StudyFieldId,
      },
      created: date,
      expires: date.setDate(date.getDate() + 14),
    };
    console.log(payload);
    return jwt.encode(payload, this.secret);
  }
  decodeToken(token) {
    const user = jwt.decode(token, this.secret);
    return user;
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

module.exports = new TokenGenerator();
