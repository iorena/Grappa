"use strict";

const errors = require("../config/errors");

/**
 * Middleware for handling all the errors thrown by other middlewares and controllers
 * and generating proper responses.
 */
module.exports.handleErrors = (err, req, res, next) => {
  if (err) {
    console.log(JSON.stringify(err, null, 2))
    // console.log(err.stack)
    const statusCode = err.statusCode !== undefined ? err.statusCode : 500;

    // We don't mind seeing error messages on the client
    // if (process.env.NODE_ENV === "development") {
      if (statusCode !== 500) {
        res.status(statusCode).send(err);
      } else {
        res.status(statusCode).send({
          message: "Something caused an internal server error",
          stack: err.stack,
        });
      }
    // } else {
    //   res.status(statusCode).send("Error");
    // }
  } else {
    next();
  }
};
