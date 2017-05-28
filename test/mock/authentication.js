const _ = require("lodash");

const TokenGenerator = require("../../services/TokenGenerator");

const db = require("./database");

module.exports.createToken = (userRole) => {
  const user = _.get(db, `user.${userRole}`);
  const payload = TokenGenerator.generateLoginPayload(user);
  const token = TokenGenerator.generateToken(payload);
  // console.log(token)
  return token;
}
