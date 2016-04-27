"use strict";

const jwt = require("jwt-simple");
// const secret = process.env.TOKEN_SECRET;
const secret = require("../config/authentication").secret;

/*
 * Authentication middleware that is called before any requests
 *
 * Checks the request for the correct Headers and then decodes
 * the token and checks if everything matches out after which
 * it lets the user to access the controller's method.
 * NOTE: Currently every request is being accepted to fasten
 * the development process.
 */
module.exports.authenticate = (req, res, next) => {
  // console.log(req.headers);
  req.user = {
    id: 1,
    role: "admin",
    StudyFieldId: null,
  };
  // req.user = {
  //   id: 3,
  //   role: "professor",
  //   StudyFieldId: 1,
  // };
  // req.user = {
  //   id: 6,
  //   role: "instructor",
  //   StudyFieldId: 2,
  // }
  next();
  return;
  // console.log(req.headers);
  if (typeof req.headers["x-access-token"] === "undefined" || req.headers["x-access-token"] === null) {
    return res.status(401).json({
      message: "Please make sure your request has X-Access-Token header",
    });
  }
  if (typeof req.headers["x-key"] === "undefined" || req.headers["x-key"] === null) {
    return res.status(401).send({
      message: "Please make sure your request has X-Key header",
    });
  }
  const token = req.headers["x-access-token"];
  const userid = parseInt(req.headers["x-key"]);
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
  // checks if userId is the same that the one who was created
  // TODO should also check if token expired..
  if (decoded.user.id !== userid) {
    return res.status(403).send({
      message: "User authentication failed",
    });
  } else {
    console.log("autentikoitu!");
    req.user = decoded.user;
    next();
  }
}

module.exports.authenticate2 = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}
