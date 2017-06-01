const TokenGenerator = require("../services/TokenGenerator");
const errors = require("../config/errors");

/**
 * Authentication middleware that is called before any requests.
 *
 * Checks the request for the X-Access-Token header which it then decodes into a token.
 * If that succeeds then checks for expiration of the token after which all is good and 
 * passes the request to the next handler.
 */
module.exports.authenticate = (req, res, next) => {
  if (!req.headers["x-access-token"]) {
    throw new errors.AuthenticationError("Please make sure your request has X-Access-Token header.");
  }
  const decoded = TokenGenerator.verifyToken(req.headers["x-access-token"], { audience: "login" });
  if (TokenGenerator.isTokenExpired(decoded)) {
    throw new errors.LoginTimeoutError("Your token has expired. Please re-login.");
  } else {
    req.user = decoded.user;
    next();
  }
};

/**
 * Used to block spectators (users that can only view) from modifying anything.
 */
module.exports.restrictSpectators = (req, res, next) => {
  if (req.user && !req.user.isSpectator) {
    next();
  } else {
    throw new errors.ForbiddenError("User not spectator permission check failed.");
  }
};


module.exports.onlyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new errors.ForbiddenError("User admin permission check failed.");
  }
};
