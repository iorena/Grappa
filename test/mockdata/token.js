const users_admin = require("./database").users_admin;
const TokenGenerator = require("../../services/TokenGenerator");

module.exports.admin = {
  token: TokenGenerator.generateToken(users_admin),
  id: users_admin.id,
}
