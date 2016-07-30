"use strict";

const BaseModel = require("./BaseModel");

class EthesisToken extends BaseModel {
  constructor() {
    super("EthesisToken");
  }
  updateOrCreate(values, params) {
    return this.Models.EthesisToken.upsert(values, {
      where: params,
    });
  }
  setToExpire(ThesisId) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return this.Models.EthesisToken.update({
      expires: date,
    }, {
      where: {
        ThesisId,
      },
    });
  }
}

module.exports = new EthesisToken();
