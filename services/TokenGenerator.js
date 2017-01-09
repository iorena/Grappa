"use strict";

// TODO use async decoding?
const jwt = require("jsonwebtoken");

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  decodeToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (e) {
      decoded = undefined;
    }
    return decoded;
  }
  isTokenExpired(decodedToken) {
    // return new Date() > decodedToken.expires;
    return Math.floor(Date.now() / 1000) > decodedToken.expires;
  }
  generateLoginPayload(user) {
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
      name: "login",
      // expires: Math.floor(Date.now() / 1000) + 25,
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
      // expiresIn: 172800, // seconds
    };
    return payload;
  }
  generateToken(payload) {
    return jwt.sign(payload, this.secret);
  }
  generateEthesisToken(thesis) {
    const payload = {
      thesis: {
        id: thesis.id,
        CouncilMeetingId: thesis.CouncilMeetingId,
      },
      name: "ethesis",
      // TODO set to expire in a year?
      // doesnt really expire as it all depends about the councilmeeting's deadline
      expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
    };
    return jwt.sign(payload, this.secret);
  }
  generateResetPasswordToken(user) {
    const payload = {
      user: {
        id: user.id,
      },
      name: "password",
      expires: Math.floor(Date.now() / 1000) + 60 * 60,
    }
    return jwt.sign(payload, this.secret);
  }
}

module.exports = new TokenGenerator(process.env.TOKEN_SECRET);
module.exports.class = TokenGenerator;
