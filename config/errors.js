"use strict";

function VError() {
  const temp = Error.apply(this, arguments);
  temp.name = this.name = "ValidationError";
  this.stack = temp.stack;
  this.message = temp.message;
}
  // inherit prototype using ECMAScript 5 (IE 9+)
VError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: VError,
    writable: true,
    configurable: true,
  },
});

module.exports.ValidationError = VError;

// Error caused when requisite data is missing e.g. email drafts from database

function PError() {
  const temp = Error.apply(this, arguments);
  temp.name = this.name = "PremiseError";
  this.stack = temp.stack;
  this.message = temp.message;
}
  // inherit prototype using ECMAScript 5 (IE 9+)
PError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: PError,
    writable: true,
    configurable: true,
  },
});

module.exports.PremiseError = PError;
