const errors = require("../config/errors");

/**
 * Middleware for handling all the errors thrown by other middlewares or controllers
 * from which it generates proper responses.
 */
module.exports.handleErrors = (err, req, res, next) => {
  if (err) {
    const statusCode = err.statusCode !== undefined ? err.statusCode : 500;
    // Log the error to the console in development environment and send
    // stack traces to the user.
    if (process.env.NODE_ENV === "development") {
      console.log(JSON.stringify(err, null, 2))
      if (err.message !== undefined) {
        res.status(statusCode).json(err);
      } else {
        res.status(statusCode).send({
          message: "Something caused an internal server error",
          stack: err.stack,
        });
      }
    } else {
      // Maybe send stack traces to users from production server?
      // makes debugging maybe easier
      const message = err.message ? err.message : "Internal server error.";
      res.status(statusCode).send({ message, });
    }
  } else {
    next();
  }
};
