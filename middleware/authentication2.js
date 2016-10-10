"use strict";

const jwt = require("jwt-simple");
const secret = process.env.TOKEN_SECRET;

/**
 * Authentication middleware that is called before any requests
 *
 * Checks the request for the correct Headers and then decodes
 * the token and checks if everything matches out after which
 * it lets the user to access the controller's method.
 * NOTE: You can comment out the req.user -statements to hard-code
 * succesfull authentication the fasten the development process.
 */
module.exports.authenticate = (req, res, next) => {
  if (!req.headers["x-access-token"]) {
    return res.status(401).send({
      message: "Please make sure your request has X-Access-Token header",
    });
  }
  const token = req.headers["x-access-token"];
  let decoded;
  try {
    decoded = jwt.decode(token, secret);
  }
  catch (err) {
    return res.status(401).send({
      message: "Token authentication failed",
      error: err.message,
    });
  }
  if (decoded.created > decoded.expires) {
    return res.status(401).send({
      message: "Token has expired",
    });
  } else {
    // console.log("autentikoitu!");
    req.user = decoded.user;
    next();
  }
};

module.exports.onlyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).send({
      message: "User privilege check failed",
    });
  }
};

module.exports.onlyAdminAndPrintPerson = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "print-person")) {
    next();
  } else {
    res.status(401).send({
      message: "User privilege check failed",
    });
  }
};
