const bcrypt = require("bcrypt-nodejs");
const passwordGenerator = require("password-generator");

/**
 * Service for manipulating the password stuff.
 *
 * Uses anonymous functions instead of functions so they can't call eachother.
 * Using hashPassword: function(password) { ... would expose it for the other methods
 * to use like this.hashPassword. Kinda like private methods except they are like super
 * private. Billonaire recluse private.
 */
const PasswordHelper = {
  hashPassword: (password) => {
    return bcrypt.hashSync(password);
  },
  comparePassword: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
  generatePassword: () => {
    return passwordGenerator(24, false);
  }
};

module.exports = Object.freeze(PasswordHelper);
