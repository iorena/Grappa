const TokenGenerator = require("../../services/TokenGenerator");

const db_admin = {
  id: 1,
  email: "ohtugrappa@gmail.com",
  firstname: "First",
  lastname: "Admin",
  role: "admin",
  isActive: true,
  isRetired: false,
  StudyFieldId: null,
  passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
}

module.exports.admin = {
  db: db_admin,
  token: TokenGenerator.generateToken(db_admin),
  expiredToken: "TODO",
};
