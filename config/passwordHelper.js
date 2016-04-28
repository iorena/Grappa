"use strict";

const bcrypt = require("bcrypt-nodejs");

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password);
};

exports.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
