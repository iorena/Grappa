"use strict";

function VError() {
  const temp = Error.apply(this, arguments);
  temp.name = this.name = "ValidationError";
  this.stack = temp.stack;
  this.message = temp.message;
}
  //inherit prototype using ECMAScript 5 (IE 9+)
VError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: VError,
    writable: true,
    configurable: true
  }
});

module.exports.ValidationError = VError;

// function BError() {
//   const temp = Error.apply(this, arguments);
//   temp.name = this.name = "BadError";
//   this.stack = temp.stack;
//   this.message = temp.message;
// }
//   //inherit prototype using ECMAScript 5 (IE 9+)
// BError.prototype = Object.create(Error.prototype, {
//   constructor: {
//     value: BError,
//     writable: true,
//     configurable: true
//   }
// })

// module.exports.BadError = BError;