"use strict";

const jwt = require("jwt-simple");
// const secret = process.env.TOKEN_SECRET;
const secret = require("../config/authentication").secret;

module.exports.authenticate = (req, res, next) => {
  // console.log(req.headers);
  // console.log(req.body);
  if (!req.headers["x-access-token"]) {
    res.status(401).send({
      message: "Please make sure your request has X-Access-Token header",
    });
  }
  if (!req.headers["x-key"]) {
    res.status(401).send({
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
      message: "Authentication failed",
      error: err.message,
    });
  }
  // checks if userId is the same that the one who was created
  // TODO should also check if token expired..
  if (decoded.userId !== userid) {
    res.status(403).send({
      message: "User authentication failed",
    });
  } else {
    console.log("autentikoitu!");
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
