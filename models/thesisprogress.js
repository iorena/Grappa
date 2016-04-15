"use strict";

const BaseModel = require("./base_model");
const tables = require("./tables.js");

class ThesisProgress extends BaseModel {
  constructor() {
    super("ThesisProgress");
  }

  changeGraderStatus(thesisId) {
    tables.ThesisProgress.update({ gradersStatus: true }, { where: { thesisId } });
  }
}


module.exports.class = ThesisProgress;
module.exports = new ThesisProgress();
module.exports.getModel = () => BaseModel.tables.ThesisProgress;
