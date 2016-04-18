"use strict";

class BaseValidator {
  validate(value, name) {
    switch(name) {
      case "author":
        return this.validateToBeStringWithLength(value, 50);
      case "deadline":
        return this.validateToBeDate(value);
      default:
        return true;
    }
  }
  validateToBeStringWithLength(param, length) {
    return typeof param === "string" && param.length <= length;
  }
  validateToBeDate(param) {
    return !isNaN(Date.parse(param));
  }
}

module.exports = new BaseValidator();
