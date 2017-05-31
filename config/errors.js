/**
 * Custom errors thrown by controllers or occasionally services.
 *
 * Determines the correct type of error a standard HTTP error -type.
 * @param {String} message - Contains the error message shown by the client.
 * @param {Object} details - Additional details such as stack trace.
 */

function BadRequestError(message, details) {
  this.name = "BadRequestError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.stack = (new Error()).stack;
  this.statusCode = 400;
}

BadRequestError.prototype = Object.create(Error.prototype);

function AuthenticationError(message, details) {
  this.name = "AuthenticationError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.statusCode = 401;
  this.stack = (new Error()).stack;
}

AuthenticationError.prototype = Object.create(Error.prototype);

function ForbiddenError(message, details) {
  this.name = "ForbiddenError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.statusCode = 403;
  this.stack = (new Error()).stack;
}

ForbiddenError.prototype = Object.create(Error.prototype);

function NotFoundError(message, details) {
  this.name = "NotFoundError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.statusCode = 404;
  this.stack = (new Error()).stack;
}

function LoginTimeoutError(message, details) {
  this.name = "LoginTimeoutError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.statusCode = 440;
  this.stack = (new Error()).stack;
}

LoginTimeoutError.prototype = Object.create(Error.prototype);

// Error caused when prerequisite data is missing e.g. email drafts from database
function PremiseError(message, details) {
  this.name = "PremiseError";
  this.message = message || "Something went wrong";
  this.details = details || {};
  this.statusCode = 500;
  this.stack = (new Error()).stack;
}

PremiseError.prototype = Object.create(Error.prototype);

module.exports = {
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  LoginTimeoutError,
  PremiseError,
};
