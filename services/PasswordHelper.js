"use strict";

const bcrypt = require("bcrypt-nodejs");
const passwordGenerator = require("password-generator");

class PasswordHelper {

  hashPassword(password) {
    return bcrypt.hashSync(password);
  }

  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  generatePassword() {
    return passwordGenerator.generatePassword();
  }
}

module.exports = new PasswordHelper();
module.exports.class = PasswordHelper;
