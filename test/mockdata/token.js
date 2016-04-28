const users_admin = require("./database").users_admin;
const TokenGenerator = require("../../services/TokenGenerator");

module.exports.admin = {
  decoded: users_admin,
  token: TokenGenerator.generateToken(users_admin),
  expiredToken: "TODO",
  id: users_admin.id,
}
