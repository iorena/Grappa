const users = require("./database").users;
const TokenGenerator = require("../../services/TokenGenerator");

module.exports.admin = {
  token: TokenGenerator.generateToken(users.admin),
  id: users.admin.id,
}
