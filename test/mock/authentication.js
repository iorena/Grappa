const _ = require("lodash");

const TokenGenerator = require("../../services/TokenGenerator");

const db = require("./database");

module.exports.createToken = (userRole) => {
  const user = _.get(db, `user.${userRole}`);
  return TokenGenerator.generateLoginToken(user);
}
