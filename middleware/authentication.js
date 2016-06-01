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
  // console.log(req.headers);
  // req.user = {
  //   id: 1,
  //   role: "admin",
  //   StudyFieldId: null,
  // };
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
  // next();
  // return;
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
    return res.status(401).send({
      message: "User authentication failed",
    });
  } else if (decoded.created > decoded.expires) {
    return res.status(401).send({
      message: "Token has expired",
    });
  } else {
    console.log("autentikoitu!");
    req.user = decoded.user;
    next();
  }
};
